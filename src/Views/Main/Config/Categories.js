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
  Select
} from "antd";
import axios from "axios";
import { store } from "../../../store";

const url = "https://cors-anywhere.herokuapp.com/http://91.201.214.201:8443/";
const { Content } = Layout;

export default class Categories extends React.Component {
  state = {
    categories: [],
    spinning: false,
    editModal: false,
    nameKz: "",
    nameRu: "",
    id: "",
    image: "",
    name_update: "",
    image_old: "",
    image_update: "",
    language: "KK",
    visibleUpdate: false
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {
      Authorization: `Bearer ${token}`,
      "Accept-Language": this.state.language
    };
    axios
      .get(`${url}api/v1/category`, {
        headers
      })
      .then(res => {
        this.setState({ spinning: false, categories: res.data.categories });
      })
      .catch(err => {
        console.log(err);
      });
  };

  onChangeLogo = info => {
    this.setState({ image: info.file.originFileObj });
  };

  createCategory = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/category`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "RU"
      },
      data: {
        name: this.state.nameRu
      },
      json: true
    };
    this.setState({ spinning: true });
    axios(authOptions)
      .then(res => {
        this.refresh();
        const authOptionsKZ = {
          method: "PATCH",
          url: `${url}api/v1/category/${res.data.id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "KK"
          },
          data: {
            name: this.state.nameKz
          },
          json: true
        };
        axios(authOptionsKZ).then(res => {
          const file = new FormData();
          file.append("file", this.state.image_update);
          const authOptions2 = {
            method: "POST",
            url: `${url}api/v1/image/category/${res.data.id}`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: file
          };
          axios(authOptions2).then(() => {
            this.refresh();
            message.success("Успешно!");
          });
        });
      })
      .catch(err => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  onSelect = value => {
    this.setState({ language: value }, () => this.refresh());
  };

  handleUpdate = () => {
    const { token } = store.getState().userReducer;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Accept-Language": this.state.language
    };
    this.setState({ spinning: true });
    axios
      .patch(
        `${url}api/v1/category/${this.state.id}`,
        { name: this.state.name_update },
        {
          headers
        }
      )
      .then(res => {
        this.setState({ visibleUpdate: false });
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      }
    };

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "Фото",
        dataIndex: "avatar",
        key: "avatar",
        render: avatar => (
          <img
            style={{ width: 80 }}
            src={
              avatar
                ? `http://91.201.214.201:8443/images/${avatar.imageName}`
                : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            }
            alt=""
          />
        )
      },
      {
        title: "Название",
        dataIndex: "categoryName",
        key: "categoryName"
      },
      {
        title: "Специализации по нему",
        dataIndex: "specializations",
        key: "specializations",
        render: specializations => <span>{specializations.length}</span>
      },
      {
        title: "Создан",
        dataIndex: "created",
        key: "created",
        render: created => (
          <span>
            {created[2]}/{created[1]}/{created[0]}
          </span>
        )
      },
      {
        title: "Действия",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.setState({
                  name_update: record.categoryName,
                  id: record.id,
                  visibleUpdate: true
                });
              }}
            >
              Изменить
            </a>
          </span>
        )
      }
    ];

    console.log(this.state.categories);

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список категории</h2>
        <Drawer
          title="Изменить категорию"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false
            })
          }
          onOk={this.handleUpdate}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название на ${this.state.language}`}>
                  <Input
                    value={this.state.name_update}
                    onChange={e =>
                      this.setState({ name_update: e.target.value })
                    }
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Прикрепить Новую фотографию">
                  <img
                    style={{ width: 100, margin: "30px" }}
                    src={
                      this.state.image_old
                        ? `http://91.201.214.201:8443/images/${this.state.image_old.imageName}`
                        : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    }
                    alt=""
                  />
                  <input
                    type="file"
                    onChange={e => {
                      this.setState({ image_update: e.target.files });
                    }}
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
              textAlign: "right"
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
          title="Создать категорию"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createCategory()}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Название на KZ">
              <Input
                onChange={e => this.setState({ nameKz: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Название на RU">
              <Input
                onChange={e => this.setState({ nameRu: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Фото">
              <Upload fileList={[]} {...props} onChange={this.onChangeLogo}>
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
              <p>{this.state.image === "" || this.state.image.name}</p>
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
            Добавить категорию
          </Button>
        </Button.Group>
        <Row style={{margin: '20px 0px'}}>
          <Select value={this.state.language} onSelect={this.onSelect}>
            <Select.Option value="RU">Русский</Select.Option>
            <Select.Option value="KK">Казахский</Select.Option>
          </Select>
        </Row>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.categories} />
        </Spin>
      </Content>
    );
  }
}
