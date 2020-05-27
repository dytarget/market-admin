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

export default class ProductCategories extends React.Component {
  state = {
    categories: [],
    spinning: false,
    editModal: false,
    name: "",
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
      .get(`${url}api/v1/product-category`, {
        headers,
      })
      .then((res) => {
        this.setState({
          spinning: false,
          categories: res.data.productCategories,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  createCategory = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/super/product-category?name=${this.state.name}`,
      headers: {},
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        const file = new FormData();
        file.append("file", this.state.image);

        const authOptions2 = {
          method: "POST",
          url: `${url}api/v1/image/product-category/${res.data.id}`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: file,
        };
        axios(authOptions2).then(() => {
          this.refresh();
          message.success("Успешно!");
        });
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
      url: `${url}api/v1/super/product-category/${this.state.id}?name=${this.state.name}`,
      headers: {},
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    this.setState({ visibleUpdate: false });
    axios(authOptions)
      .then((res) => {
        if (this.state.image_update) {
          const file = new FormData();
          console.log(this.state.image_update);

          file.append("file", this.state.image_update[0]);

          const authOptions2 = {
            method: "POST",
            url: `${url}api/v1/image/product-category/${this.state.id}`,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: file,
          };
          axios(authOptions2).then(() => {
            this.refresh();
            message.success("Успешно!");
          });
        } else {
          this.setState({ visibleUpdate: false });
          this.refresh();
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  deleteCategory = (id) => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const authOptions = {
      method: "DELETE",
      url: `${url}api/v1/super/product-category/${id}`,
      headers: {},
    };

    axios(authOptions)
      .then(() => this.refresh())
      .catch(() => {
        message.error("Вы не можете удалить, есть продукты в этой категории");
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
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Фото",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img
            style={{ width: 80 }}
            src={
              image
                ? `http://91.201.214.201:8443/images/${image.imageName}`
                : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            }
            alt=""
          />
        ),
      },
      {
        title: "Название",
        dataIndex: "categoryName",
        key: "categoryName",
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
                  name: record.categoryName,
                  id: record.id,
                  image_old: record.image,
                  visibleUpdate: true,
                });
              }}
            >
              Изменить
            </a>{" "}
            |{" "}
            <Popconfirm
              placement="top"
              onConfirm={() => this.deleteCategory(record.id)}
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
        <h2 style={{ textAlign: "center" }}>Список категории продуктов</h2>
        <Drawer
          title="Изменить категорию продуктов"
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
                <Form.Item label={`Название`}>
                  <Input
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
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
                    onChange={(e) => {
                      this.setState({
                        image_update: e.target.files,
                      });
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
          title="Создать категорию продуктов"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createCategory()}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Названиe">
              <Input
                onChange={(e) => this.setState({ name: e.target.value })}
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
            Добавить категорию продуктов
          </Button>
        </Button.Group>

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.categories} />
        </Spin>
      </Content>
    );
  }
}
