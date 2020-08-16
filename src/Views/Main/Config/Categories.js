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

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class Categories extends React.Component {
  state = {
    categories: [],
    spinning: false,
    editModal: false,
    nameKz: "",
    nameRu: "",
    priority: "",
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
    this.cleanUp();
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/category`, {
        headers,
      })
      .then((res) => {
        this.setState({ spinning: false, categories: res.data.categories });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  cleanUp = () => {
    this.setState({
      categoryName: "",
      categoryNameKz: "",
      priority: "",
      id: "",
      image: "",
      name_update: "",
      image_old: "",
      image_update: "",
    });
  };

  createCategory = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/category`,
      headers: {},
      data: {
        categoryName: this.state.nameRu,
        categoryNameKz: this.state.nameKz,
        priority: this.state.priority,
      },
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        createLogs(`Создал категорию ID=${res.data.id}`);

        if (this.state.image !== "") {
          const file = new FormData();
          file.append("file", this.state.image);

          const authOptions2 = {
            method: "POST",
            url: `${url}api/v1/image/category/${res.data.id}`,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: file,
          };
          axios(authOptions2).then(() => {
            this.refresh();
            this.cleanUp();
            setTimeout(() => window.location.reload(), 1000);

            message.success("Успешно!");
          });
        } else {
          this.refresh();
          message.success("Успешно!");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  handleUpdate = () => {
    const authOptions = {
      method: "PATCH",
      url: `${url}api/v1/category/${this.state.id}`,
      headers: {},
      data: {
        categoryName: this.state.nameRu,
        categoryNameKz: this.state.nameKz,
        priority: this.state.priority,
      },
      json: true,
    };
    this.setState({ spinning: true, visibleUpdate: false });
    axios(authOptions)
      .then((res) => {
        createLogs(`Обновил категорию ID=${res.data.id}`);

        if (this.state.image_update !== "") {
          const file = new FormData();
          console.log(this.state.image_update);

          file.append("file", this.state.image_update[0]);

          const authOptions2 = {
            method: "POST",
            url: `${url}api/v1/image/category/${this.state.id}`,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: file,
          };
          axios(authOptions2).then(() => {
            this.refresh();
            this.cleanUp();
            setTimeout(() => window.location.reload(), 1000);

            message.success("Успешно!");
          });
        } else {
          this.refresh();
          this.cleanUp();

          message.success("Успешно!");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  deleteCategory = (id, name) => {
    this.setState({ spinning: true });
    const authOptions = {
      method: "DELETE",
      url: `${url}api/v1/super/category/${id}`,
      headers: {},
    };

    axios(authOptions)
      .then((res) => {
        createLogs(`Удалил категорию ID=${res.data.id}`);

        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(() => {
        message.error(
          "Вы не можете удалить, есть специализации в этой категории"
        );
        this.setState({ spinning: false });
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
        title: "Фото",
        dataIndex: "avatar",
        key: "avatar",
        fixed: "left",
        render: (avatar) => (
          <img
            style={{ width: 80 }}
            src={
              avatar
                ? `http://91.201.214.201:8443/images/${avatar.imageName}`
                : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            }
            alt=""
          />
        ),
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Название Ru",
        dataIndex: "categoryName",
        key: "categoryName",
      },
      {
        title: "Название Kz",
        dataIndex: "categoryNameKz",
        key: "categoryNameKz",
      },
      {
        title: "Специализации по нему",
        dataIndex: "specializations",
        key: "specializations",
        render: (specializations) => (
          <span>{specializations ? specializations.length : 0}</span>
        ),
      },
      {
        title: "Приоритет",
        dataIndex: "priority",
        key: "priority",
      },
      {
        title: "Создан",
        dataIndex: "created",
        key: "created",
        render: (created) => (
          <span>
            {created[2]}/{created[1]}/{created[0]}
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
                  nameRu: record.categoryName,
                  nameKz: record.categoryNameKz,
                  id: record.id,
                  priority: record.priority,
                  image_old: record.avatar,
                  visibleUpdate: true,
                });
              }}
            >
              Изменить
            </a>{" "}
            |{" "}
            <Popconfirm
              placement="top"
              onConfirm={() =>
                this.deleteCategory(record.id, record.categoryName)
              }
              title={"Удалить ?"}
              okText="Yes"
              cancelText="No"
            >
              <a>Удалить</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список категорий</h2>
        <Drawer
          title="Изменить категорию"
          width={720}
          onClose={() => {
            this.setState({
              visibleUpdate: false,
            });
            this.cleanUp();
          }}
          onOk={this.handleUpdate}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название на KZ`}>
                  <Input
                    value={this.state.nameKz}
                    onChange={(e) => this.setState({ nameKz: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={`Название на RU`}>
                  <Input
                    value={this.state.nameRu}
                    onChange={(e) => this.setState({ nameRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={`Приоритет`}>
              <Input
                value={this.state.priority}
                onChange={(e) => this.setState({ priority: e.target.value })}
                type="numeric"
              />
            </Form.Item>
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
                    onChange={(e) => {
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
          title="Создать категорию"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => {
            this.createCategory();
          }}
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
        >
          <Form>
            <Form.Item label="Название на KZ">
              <Input
                value={this.state.nameKz}
                onChange={(e) => this.setState({ nameKz: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Название на RU">
              <Input
                value={this.state.nameRu}
                onChange={(e) => this.setState({ nameRu: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Приоритет">
              <Input
                value={this.state.priority}
                onChange={(e) => this.setState({ priority: e.target.value })}
                type="numeric"
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

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.categories}
            scroll={{ x: "calc(600px + 70%)", y: 500 }}
          />
        </Spin>
      </Content>
    );
  }
}
