/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  Icon,
  Table,
  Button,
  Layout,
  Spin,
  Input,
  Form,
  Modal,
  Col,
  Row,
  Upload,
  message,
  Drawer,
  Divider,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";
import { store } from "../../../store";
import createLogs from "../../../utils/createLogs";
import config from "../../../config/config";

const { Content } = Layout;

export default class AboutService extends React.Component {
  state = {
    aboutServices: [],
    spinning: false,
    editModal: false,
    text: "",
    id: "",
    visibleUpdate: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.cleanUp();
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${config.url}api/v1/about-service/about-service`, {
        headers,
      })
      .then((res) => {
        this.setState({
          spinning: false,
          aboutServices: res.data.aboutServices,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cleanUp = () => {
    this.setState({
      text: "",
      id: "",
    });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  createCity = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "POST",
      url: `${config.url}api/v1/about-service?text=${this.state.text}`,
      headers: {},
      json: true,
    };

    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        createLogs(`Создал Запись откуда Вы узнали ID=${res.data.id}`);

        this.refresh();
        setTimeout(() => window.location.reload(), 1000);

        message.success("Успешно!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  handleUpdate = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "PATCH",
      url: `${config.url}api/v1/super/about-service/${this.state.id}?text=${this.state.text}`,
      headers: {},
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        createLogs(`Обновил Запись откуда Вы узнали ID=${res.data.id}`);
        setTimeout(() => window.location.reload(), 1000);

        this.refresh();
        message.success("Успешно!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };
  deleteCity = (cityId, text) => {
    this.setState({ spinning: true });

    axios
      .delete(`${config.url}api/v1/super/about-service/${cityId}`, {
        headers: {},
      })
      .then((res) => {
        createLogs(`Удалил Запись откуда Вы узнали ID=${text}`);

        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
    };

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Название",
        dataIndex: "text",
        key: "text",
      },
      {
        title: "Создан",
        dataIndex: "created",
        key: "created",
        render: (created) => (
          <span>
            {created ? `${created[2]}/${created[1]}/${created[0]}` : ""}
          </span>
        ),
      },
      {
        title: "Действия",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.setState({
                  text: record.text,
                  id: record.id,
                  visibleUpdate: true,
                });
              }}
            >
              Изменить
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="Вы уверены что хотите удалить?"
              onConfirm={() => this.deleteCity(record.id, record.text)}
              okText="Да"
              cancelText="Нет"
            >
              <a>Удалить</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список Откуда вы узнали</h2>
        <Drawer
          title="Изменить Откуда вы узнали"
          width={720}
          onClose={() => {
            this.cleanUp();
            this.setState({
              visibleUpdate: false,
            });
          }}
          onOk={this.handleUpdate}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название`}>
                  <Input
                    value={this.state.text}
                    onChange={(e) => this.setState({ text: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right",
            }}
          >
            <Button
              onClick={() => this.setState({ visibleUpdate: false })}
              style={{ marginRight: 8 }}
            >
              Отменить
            </Button>
            <Button onClick={this.handleUpdate} type="primary">
              Изменить
            </Button>
          </div>
        </Drawer>
        <Modal
          title="Создать откуда вы узнали о нашем сервисе"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createCity()}
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
        >
          <Form>
            <Form.Item label="Название">
              <Input
                onChange={(e) => this.setState({ text: e.target.value })}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
          <Button
            onClick={() => this.setState({ editModal: true })}
            type="primary"
          >
            <Icon type="plus" />
            Добавить
          </Button>
        </Button.Group>

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.aboutServices}
            scroll={{ x: "calc(300px + 70%)", y: 500 }}
          />
        </Spin>
      </Content>
    );
  }
}
