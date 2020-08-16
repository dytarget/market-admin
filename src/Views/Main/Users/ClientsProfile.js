import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Layout,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import React, { Component, Fragment } from "react";
import createLogs from "../../../utils/createLogs";
import generateCitiesId from "../../../utils/generateCitiesId";
import getLastOnline from "../../../utils/getLastOnline";
import getUserDuration from "../../../utils/getUserDuration";
import sendPushNotification from "../../../utils/sendPushNotification";

const { Content } = Layout;

const url = "http://91.201.214.201:8443/";

export class ClientsProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master: "",
      spinning: false,
      editModal: false,
      title: "",
      body: "",
      titleKz: "",
      bodyKz: "",
      admins: [],
      chooseManager: false,
      managerId: 0,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    axios
      .get(`${url}api/v1/user/${this.props.match.params.username}`, {
        headers: {},
      })
      .then((res) => {
        this.setState({ master: res.data, spinning: false });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${url}api/v1/super/user/admins${generateCitiesId(true)}`)
      .then((res) => this.setState({ admins: res.data }));
  };

  deleteUser = () => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/user/${this.state.master?.id}`)
      .then((res) => {
        createLogs(`Удалил Юзера ${this.state.master?.username}`);
        this.refresh();
        this.props.history.push("/users/clients");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteImage = (id) => {
    this.setState({ spinning: true });
    console.log(id);

    axios
      .delete(`${url}api/v1/image/${id}`, {
        headers: {},
      })
      .then((res) => {
        createLogs(
          `Удалил фотографию пользователя ${this.state.master?.username}`
        );
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteAvatar = (userId) => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/image/user/${userId}/avatar`, {
        headers: {},
      })
      .then((res) => {
        createLogs(`Удалил аватар пользователя ${this.state.master?.username}`);
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateMasterStatus = (status) => {
    this.setState({ spinning: true });

    axios
      .put(`${url}api/v1/user/${this.state.master.username}`, { status })
      .then((res) => {
        createLogs(
          `Поменял статус пользователя ${this.state.master?.username}`
        );
        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  pushNotification = () => {
    const { title, body, master, bodyKz, titleKz } = this.state;
    if (
      title.length < 1 ||
      body.length < 1 ||
      titleKz.length < 1 ||
      bodyKz.length < 1
    ) {
      message.error("Заполните поля");
    } else {
      sendPushNotification(
        body,
        bodyKz,
        title,
        titleKz,
        master.id,
        "",
        "",
        "client",
        "bells"
      );
      createLogs(
        `Отправил уведомления пользователю ${this.state.master?.username}`
      );
      this.setState({ editModal: false });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  blockMaster = () => {
    this.setState({ spinning: true });

    axios
      .patch(`${url}api/v1/admin/user/block/${this.state.master.id}`, {
        headers: {},
      })
      .then((res) => {
        createLogs(`Заблокировал пользователя ${this.state.master?.username}`);
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  chooseManager = () => {
    this.setState({ spinning: true });
    const { managerId } = this.state;

    axios
      .put(`${url}api/v1/user/${this.state.master.username}`, {
        managerId,
      })
      .then((res) => {
        createLogs(
          `Выбрал менеджера по ID ${managerId} для пользователя ${this.state.master?.username}`
        );
        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка");
      });
  };

  render() {
    const { master, spinning } = this.state;
    console.log(master);

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
                      onChange={(text) =>
                        this.setState({ title: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Заголовок Kz">
                    <Input
                      value={this.state.titleKz}
                      onChange={(text) =>
                        this.setState({ titleKz: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Содержимое">
                    <Input
                      value={this.state.body}
                      onChange={(text) =>
                        this.setState({ body: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Содержимое Kz">
                    <Input
                      value={this.state.bodyKz}
                      onChange={(text) =>
                        this.setState({ bodyKz: text.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Выбрать Менеджера"
                visible={this.state.chooseManager}
                okText="Выбрать"
                cancelText="Закрыть"
                onCancel={() => this.setState({ chooseManager: false })}
                onOk={this.chooseManager}
              >
                <Form>
                  <Form.Item label="Менеджер">
                    <Select
                      onChange={(managerId) => this.setState({ managerId })}
                    >
                      {this.state.admins.map((admin) => (
                        <Select.Option value={admin.id}>
                          {admin.firstName} {admin.lastName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Modal>
              <div style={{ margin: 20 }}>
                <Button.Group>
                  {this.props.canEditUser &&
                    (master.status === "BLOCKED" ? (
                      <Popconfirm
                        placement="top"
                        onConfirm={() =>
                          this.updateMasterStatus("NOT_VERIFIED")
                        }
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
                        onConfirm={() => this.blockMaster()}
                        cancelText="No"
                      >
                        <Button type="danger">
                          <Icon type="lock" />
                          Заблокировать
                        </Button>
                      </Popconfirm>
                    ))}
                  {this.props.canEditUser && (
                    <Button
                      onClick={() => this.setState({ editModal: true })}
                      type="primary"
                    >
                      Уведомление
                      <Icon type="message" />
                    </Button>
                  )}
                  {this.props.canDeleteUser && (
                    <Popconfirm
                      placement="top"
                      title={"Удалить ?"}
                      onConfirm={this.deleteUser}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="default">
                        Удалить
                        <Icon type="delete" />
                      </Button>
                    </Popconfirm>
                  )}
                  {master.master && (
                    <Button
                      onClick={() =>
                        this.props.history.push(
                          `/users/masters/${master.username}`
                        )
                      }
                      type="default"
                    >
                      Профиль Мастера
                      <Icon type="eye" />
                    </Button>
                  )}
                  {this.props.canEditUser && (
                    <Button
                      onClick={() => this.setState({ chooseManager: true })}
                    >
                      Выбрать {master.manager ? " нового " : null} Менеджера
                    </Button>
                  )}
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
                          <Input value={master.city && master.city.cityName} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="На портале">
                          <Input
                            type="text"
                            value={
                              master.created && getUserDuration(master.created)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Просмотры">
                          <Input value={master.viewCount} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Был в сети">
                          <Input value={getLastOnline(master.lastRequest)} />
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
