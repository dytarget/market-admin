import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Tabs,
  Card,
  Button,
  Icon,
  Popconfirm,
  Modal,
  Select,
  message
} from "antd";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import { store } from "../../../store";
import { RespondList } from "../components/RespondList";
import getUserRating from "../../../utils/getUserRating";
import getUserDuration from "../../../utils/getUserDuration";
import getMasterStatus from "../../../utils/getMasterStatus";
import "./Photo.css";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const url = "http://91.201.214.201:8443/";

export class MasterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master: "",
      spinning: false,
      responds: [],
      editModal: false,
      masterType: "",
      orgName: ""
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    axios
      .get(`${url}api/v1/user/${this.props.match.params.username}`, {
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.token}`
        }
      })
      .then(res => {
        this.setState({ master: res.data });
        axios
          .get(`${url}api/v1/history/responded-master/${res.data.id}`, {
            headers: {
              Authorization: `Bearer ${store.getState().userReducer.token}`
            }
          })
          .then(res => {
            this.setState({
              responds: res.data.communicationHistories,
              spinning: false
            });
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteImage = id => {
    this.setState({ spinning: true });
    console.log(id);

    axios
      .delete(`${url}api/v1/image/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.token}`
        }
      })
      .then(res => {
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteAvatar = userId => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/image/user/${userId}/avatar`, {
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.token}`
        }
      })
      .then(res => {
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateMasterStatus = status => {
    this.setState({ spinning: true });

    axios
      .put(`${url}api/v1/user/${this.state.master.username}`, { status })
      .then(res => {
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  updateMasterType = () => {
    this.setState({ spinning: true });

    const { masterType, orgName, master } = this.state;
    if (masterType === "COMPANY" && orgName.length < 1) {
      message.error("Заполните организацю мастера");
    } else {
      axios
        .put(`${url}api/v1/user/${master.username}`, { masterType, orgName })
        .then(res => {
          this.refresh();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    const { master, spinning, responds } = this.state;
    const usernameMatch =
      master === "" || master.username.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    const phoneNumber =
      "(" +
      usernameMatch[1] +
      ") " +
      usernameMatch[2] +
      "-" +
      usernameMatch[3] +
      "-" +
      usernameMatch[4];

    const galleryPhotos = [];
    const pasportPhotos = [];
    master.worksPhotos &&
      master.worksPhotos.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`
        };
        galleryPhotos.push(obj);
      });
    master.identificationPhotos &&
      master.identificationPhotos.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`
        };
        pasportPhotos.push(obj);
      });

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Карточка Мастера</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Modal
                title="Редактировать мастера"
                visible={this.state.editModal}
                cancelButtonProps={{ style: { opacity: 0 }, disabled: true }}
                okText="Закрыть"
                closable={false}
                onOk={() => this.setState({ editModal: false })}
              >
                <Form>
                  <Form.Item label="Типа мастера">
                    <Select
                      defaultValue={master.masterType}
                      style={{ width: 120 }}
                      onChange={value => this.setState({ masterType: value })}
                    >
                      <Option value="INDIVIDUAL">Частный</Option>
                      <Option value="COMPANY">Организация</Option>
                    </Select>
                  </Form.Item>
                  {this.state.masterType === "COMPANY" && (
                    <Form.Item label="Организация мастера">
                      <Input
                        value={this.state.orgName}
                        onChange={text =>
                          this.setState({ orgName: text.target.value })
                        }
                      />
                    </Form.Item>
                  )}
                  <Button onClick={this.updateMasterType} type="primary">
                    Сохранить тип мастера
                  </Button>
                </Form>
                {master.worksPhotos &&
                  master.worksPhotos.map((photos, index) => (
                    <div key={`${index}`} className="photos-delete-container">
                      <img
                        style={{ width: 70, height: 70, marginRight: 20 }}
                        src={`http://91.201.214.201:8443/images/${photos.imageName}`}
                        alt="gg"
                      />
                      <Popconfirm
                        placement="top"
                        title={"Удалить ?"}
                        onConfirm={() => this.deleteImage(photos.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="danger">
                          Удалить
                          <Icon type="delete" />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
              </Modal>
              <div style={{ margin: 20 }}>
                <Button.Group>
                  {master.status === "BLOCKED" ? (
                    <Popconfirm
                      placement="top"
                      onConfirm={() => this.updateMasterStatus("NOT_VERIFIED")}
                      title={"Разблокировать ?"}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="danger">
                        <Icon type="unlock" />
                        Разблокировать
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      placement="top"
                      title={"Заблокировать ?"}
                      okText="Yes"
                      onConfirm={() => this.updateMasterStatus("BLOCKED")}
                      cancelText="No"
                    >
                      <Button type="danger">
                        <Icon type="lock" />
                        Заблокировать
                      </Button>
                    </Popconfirm>
                  )}
                  <Popconfirm
                    placement="top"
                    title={"Поменять статус мастера ?"}
                    okText="Yes"
                    onConfirm={() => this.updateMasterStatus("VERIFIED")}
                    cancelText="No"
                  >
                    <Button
                      disabled={master.status === "VERIFIED"}
                      type="primary"
                    >
                      Документы проверены
                      <Icon type="container" />
                    </Button>
                  </Popconfirm>
                  <Button
                    onClick={() => this.setState({ editModal: true })}
                    type="primary"
                  >
                    Редактировать
                    <Icon type="edit" />
                  </Button>
                  <Popconfirm
                    placement="top"
                    title={"Удалить ?"}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="default">
                      Удалить
                      <Icon type="delete" />
                    </Button>
                  </Popconfirm>
                </Button.Group>
              </div>

              <Row>
                <Col span={6}>
                  <Card
                    hoverable
                    style={{ width: 200, marginLeft: 10 }}
                    cover={
                      <img
                        alt="example"
                        src={
                          master.avatar
                            ? `http://91.201.214.201:8443/images/${master.avatar.imageName}`
                            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        }
                      />
                    }
                  >
                    {master.avatar && (
                      <Popconfirm
                        placement="top"
                        title={"Удалить ?"}
                        onConfirm={() => this.deleteAvatar(master.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="danger">
                          Удалить
                          <Icon type="delete" />
                        </Button>
                      </Popconfirm>
                    )}
                  </Card>
                </Col>
                <Col span={18}>
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Имя">
                          <Input value={master.firstName} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Фамилия">
                          <Input value={master.lastName} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Номер Телефона">
                          <Input value={"8-" + phoneNumber} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Город">
                          <Input value={master.city} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="День рождения">
                          <Input value={`${master.birthday}`} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Уровень">
                          <Input value={getUserRating(master.rating)} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="На портале">
                      {
                        <Input
                          type="text"
                          value={
                            master.created && getUserDuration(master.created)
                          }
                        />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Статус">
                      <Input readOnly value={getMasterStatus(master.status)} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Тип мастера">
                      <Input
                        value={
                          master.masterType === "COMPANY"
                            ? `Организация ${master.orgName}`
                            : "Частный"
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Просмотры">
                      <Input value={master.viewCount} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Рейтинг">
                      <Input value={master.rating} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="ИИН">
                      <Input value={master.iin} />
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item label="О себе">
                      <TextArea rows={1} value={master.notes} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div style={{ display: "flex" }}>
                <span>Специализации: </span>
                <div style={{ marginLeft: 25 }}>
                  {master.specializations &&
                    master.specializations.map(({ specName }) => (
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {specName}
                      </p>
                    ))}
                </div>
              </div>
              <div style={{ display: "flex", marginTop: 40 }}>
                <span>Услуги: </span>
                <div style={{ marginLeft: 25 }}>
                  {master.services &&
                    master.services.map(service => (
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {service.serviceName} {service.cost} {service.unit}
                      </p>
                    ))}
                </div>
              </div>
              <h2 style={{ textAlign: "center" }}>Фото документов</h2>
              {pasportPhotos && pasportPhotos.length && (
                <ImageGallery items={pasportPhotos} />
              )}
              <h2 style={{ textAlign: "center" }}>Фото работ</h2>
              {galleryPhotos && galleryPhotos.length && (
                <ImageGallery items={galleryPhotos} />
              )}
              {/* <ImageGallery items={galleryPhotos} /> */}
              <Tabs defaultActiveKey="1">
                <TabPane tab="Отклики" key="1">
                  <RespondList responds={responds} />
                </TabPane>
                <TabPane tab="Отзывы" key="2">
                  {/* <RespondList responds={master.reviews} /> */}
                </TabPane>
              </Tabs>
            </Fragment>
          )}
        </Spin>
      </Content>
    );
  }
}

export default MasterProfile;
