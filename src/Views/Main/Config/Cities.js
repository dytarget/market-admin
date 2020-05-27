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

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class Cities extends React.Component {
  state = {
    cities: [],
    spinning: false,
    editModal: false,
    nameKz: "",
    nameRu: "",
    id: "",
    image: "",
    name_update: "",
    image_old: "",
    image_update: "",
    visibleUpdate: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/city/all`, {
        headers,
      })
      .then((res) => {
        this.setState({ spinning: false, cities: res.data.cities });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  createCity = () => {
    console.log(this.state.cityName);
    console.log(this.state.cityNameKz);

    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/super/city`,
      headers: {},
      data: {
        cityName: this.state.cityName,
        cityNameKz: this.state.cityNameKz,
      },
      json: true,
    };

    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        this.refresh();
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
      url: `${url}api/v1/super/city/${this.state.id}`,
      headers: {},
      data: {
        cityName: this.state.cityName,
        cityNameKz: this.state.cityNameKz,
      },
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        this.refresh();
        message.success("Успешно!");
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };
  deleteCity = (cityId) => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/super/city/${cityId}`, {
        headers: {},
      })
      .then((res) => {
        this.refresh();
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
        title: "Название Ru",
        dataIndex: "cityName",
        key: "cityName",
      },
      {
        title: "Название Kz",
        dataIndex: "cityNameKz",
        key: "cityNameKz",
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
                  cityName: record.cityName,
                  cityNameKz: record.cityNameKz,
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
              onConfirm={() => this.deleteCity(record.id)}
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
        <h2 style={{ textAlign: "center" }}>Список городов</h2>
        <Drawer
          title="Изменить город"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false,
            })
          }
          onOk={this.handleUpdate}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название на KZ`}>
                  <Input
                    value={this.state.cityNameKz}
                    onChange={(e) =>
                      this.setState({ cityNameKz: e.target.value })
                    }
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название на RU`}>
                  <Input
                    value={this.state.cityName}
                    onChange={(e) =>
                      this.setState({ cityName: e.target.value })
                    }
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
          title="Создать город"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createCity()}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Название на KZ">
              <Input
                onChange={(e) => this.setState({ cityNameKz: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Название на RU">
              <Input
                onChange={(e) => this.setState({ cityName: e.target.value })}
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
            Добавить Город
          </Button>
        </Button.Group>

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.cities} />
        </Spin>
      </Content>
    );
  }
}
