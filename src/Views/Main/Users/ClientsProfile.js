import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Card,
  Button,
  Icon,
  Popconfirm,
  Modal,
  message
} from "antd";
import axios from "axios";
import { store } from "../../../store";
import getUserDuration from "../../../utils/getUserDuration";
import sendPushNotification from "../../../utils/sendPushNotification";

const { Content } = Layout;

const url = "https://cors-anywhere.herokuapp.com/http://91.201.214.201:8443/";

export class ClientsProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master: "",
      spinning: false,
      editModal: false,
      title: "",
      body: ""
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
        this.setState({ master: res.data, spinning: false });
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

  pushNotification = () => {
    const { title, body, master } = this.state;
    if (title.length < 1 || body.length < 1) {
      message.error("Заполните поля");
    } else {
      sendPushNotification(body, title, master.id);
      this.setState({ editModal: false });
    }
  };

  render() {
    const { master, spinning } = this.state;
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

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Карточка Клиента</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Modal
                title="Отправить уведомления для заказчика"
                visible={this.state.editModal}
                okText="Отправить"
                cancelText="Закрыть"
                onCancel={() => this.setState({ editModal: false })}
                onOk={this.pushNotification}
              >
                <Form>
                  <Form.Item label="Заголовок">
                    <Input
                      value={this.state.title}
                      onChange={text =>
                        this.setState({ title: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Содержимое">
                    <Input
                      value={this.state.body}
                      onChange={text =>
                        this.setState({ body: text.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
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
                  <Button
                    onClick={() => this.setState({ editModal: true })}
                    type="primary"
                  >
                    Отправить уведомление
                    <Icon type="message" />
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
                        <Form.Item label="На портале">
                          <Input
                            type="text"
                            value={
                              master.created && getUserDuration(master.created)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Просмотры">
                          <Input value={master.viewCount} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Fragment>
          )}
        </Spin>
      </Content>
    );
  }
}

export default ClientsProfile;
