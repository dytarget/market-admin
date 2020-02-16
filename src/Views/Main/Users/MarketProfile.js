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
  message,
  Upload
} from "antd";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import { store } from "../../../store";
import { RespondList } from "../components/RespondList";
import getUserRating from "../../../utils/getUserRating";
import getUserDuration from "../../../utils/getUserDuration";
import getMasterStatus from "../../../utils/getMasterStatus";
import "./Photo.css";
import { PromosList } from "../components/PromosList";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const url = "http://91.201.214.201:8443/";

export class MarketProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master: "",
      spinning: true,
      responds: [],
      editModal: false,
      masterType: "",
      orgName: "",
      promoImage: "",
      createPromoModal: false
    };
  }

  componentDidMount() {
    this.setState({ spinning: true });
    this.refresh();
  }

  refresh = () => {
    axios
      .get(`${url}api/v1/market/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.token}`
        }
      })
      .then(res => {
        this.setState({ market: res.data });

        this.setState({
          spinning: false
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

  onChangePromoImage = info => {
    this.setState({ promoImage: info.file.originFileObj });
  };

  createPromo = () => {
    this.setState({ spinning: true, createPromoModal: false });

    axios
      .post(
        `${url}api/v1/promo?link=${this.state.link}&marketId=${this.props.match.params.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${store.getState().userReducer.token}`
          }
        }
      )
      .then(res => {
        console.log(res.data);

        this.refresh();
        // const files = new FormData();
        // files.append("file", this.state.promoImage);
        // axios
        //   .post(`${url}api/v1/promo/${res.data.id}`, files, {
        //     headers: {
        //       Authorization: `Bearer ${store.getState().userReducer.token}`,
        //       "Content-Type": "multipart/form-data"
        //     }
        //   })
        //   .then(res => {
        //     this.refresh();
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { market, spinning } = this.state;
    const usernameMatch =
      market &&
      market.phone &&
      market.phone.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    const phoneNumber =
      market &&
      "(" +
        usernameMatch[1] +
        ") " +
        usernameMatch[2] +
        "-" +
        usernameMatch[3] +
        "-" +
        usernameMatch[4];

    const galleryPhotos = [];
    market &&
      market.photos &&
      market.photos.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`
        };
        galleryPhotos.push(obj);
      });

    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      }
    };

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Карточка Маркета</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              {/* <Modal
                title="Редактировать маркет"
                visible={this.state.editModal}
                cancelButtonProps={{ style: { opacity: 0 }, disabled: true }}
                okText="Закрыть"
                closable={false}
                onOk={() => this.setState({ editModal: false })}
              >
                <Form>
                  <Form.Item label="Типа маркета">
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
                {market.worksPhotos &&
                  market.worksPhotos.map((photos, index) => (
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
              </Modal> */}
              <Modal
                title="Создать акции и скидки"
                visible={this.state.createPromoModal}
                okText="Создать"
                cancelText="Закрыть"
                closable={false}
                onOk={this.createPromo}
                onCancel={() => this.setState({ createPromoModal: false })}
              >
                <Form>
                  <Form.Item label="Переходня ссылка">
                    <Input
                      onChange={text =>
                        this.setState({ link: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Логотип маркета">
                    <Upload
                      fileList={[]}
                      {...props}
                      onChange={this.onChangePromoImage}
                    >
                      <Button>
                        <Icon type="upload" /> Нажмите чтобы загрузить
                      </Button>
                    </Upload>
                    <p>
                      {this.state.promoImage === "" ||
                        this.state.promoImage.name}
                    </p>
                  </Form.Item>
                </Form>
              </Modal>

              <div style={{ margin: "20px 0px" }}>
                <Button.Group>
                  <Button
                    onClick={() => this.setState({ createPromoModal: true })}
                    type="primary"
                  >
                    Создать Акции и Скидки
                  </Button>
                  <Button type="danger">Заблокировать</Button>
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
                          market && market.logo
                            ? `http://91.201.214.201:8443/images/${market.logo.imageName}`
                            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        }
                      />
                    }
                  ></Card>
                </Col>
                <Col span={18}>
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Название">
                          <Input value={market.marketName} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Тариф">
                          <Input
                            value={
                              market.subscriptionType === "FULL"
                                ? "Расширенный"
                                : "Стандарт"
                            }
                          />
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
                          <Input value={market.city} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Адрес">
                          <Input value={`${market.address}`} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="E-mail">
                          <Input value={market.email} />
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
                            getUserDuration(market.created) === ""
                              ? "сегодня"
                              : getUserDuration(market.created)
                          }
                        />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Статус">
                      <Input
                        readOnly
                        value={
                          market.status === "BLOCKED"
                            ? "Заблокирован"
                            : "Активный"
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Сайт">
                      <Input value={market.site} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item label="Просмотры">
                      <Input value={market.viewCount} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Просмотры телефона">
                      <Input value={market.phoneViewCount} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Ссылка на YouTube видео">
                      <Input value={market.youtubeVideoLink} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Рабочие дни">
                      <Input value={market.workdaysSchedule} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Суббота">
                      <Input value={market.saturdaySchedule} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Воскресенье">
                      <Input value={market.sundaySchedule} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Перерыв">
                      <Input value={market.breakSchedule} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Описание">
                      <TextArea rows={2} value={market.about} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div style={{ display: "flex" }}>
                <span>
                  Категория: {market.category && market.category.name}
                </span>
              </div>
              {/* <div style={{ display: "flex", marginTop: 40 }}>
                <span>Категории продуктов: </span>
                <div style={{ marginLeft: 25 }}>
                  {market.services &&
                    master.services.map(service => (
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {service.serviceName} {service.cost} {service.unit}
                      </p>
                    ))}
                </div>
              </div> */}
              <h2 style={{ textAlign: "center" }}>Фото маркета</h2>
              {galleryPhotos && galleryPhotos.length && (
                <ImageGallery items={galleryPhotos} />
              )}
              <Tabs defaultActiveKey="2">
                <TabPane tab="Продукты" key="1">
                  {/* <RespondList responds={responds} /> */}
                </TabPane>
                <TabPane tab="Акции и Скидки" key="2">
                  <PromosList promos={market.promos} />
                </TabPane>
              </Tabs>
            </Fragment>
          )}
        </Spin>
      </Content>
    );
  }
}

export default MarketProfile;
