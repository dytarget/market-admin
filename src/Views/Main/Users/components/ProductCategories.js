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
  Popconfirm,
} from "antd";
import axios from "axios";
import createLogs from "../../../../utils/createLogs";

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
    this.setState({ spinning: true });
    axios
      .get(`${url}api/v1/product-category/market/${this.props.marketId}`)
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
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/super/product-category`,
      json: true,
      data: {
        name: this.state.name,
        marketId: this.props.marketId,
      },
    };
    this.setState({ spinning: true, editModal: false });
    axios(authOptions)
      .then((res) => {
        createLogs(
          `Создал Категорию товаров (${this.state.name}) Продавца с id ${this.props.marketId}`
        );
        if (this.state.image !== "") {
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
            createLogs(
              `Создал фотографию категорию товаров (${this.state.name}) Продавца с id ${this.props.marketId}`
            );
            this.refresh();

            setTimeout(() => window.location.reload(), 1000);
            message.success("Успешно!");
          });
        } else {
          this.refresh();
          setTimeout(() => window.location.reload(), 1000);

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
      url: `${url}api/v1/super/product-category`,
      data: {
        name: this.state.name,
        productCategoryId: this.state.id,
      },
      json: true,
    };
    this.setState({ spinning: true, editModal: false });
    this.setState({ visibleUpdate: false });
    axios(authOptions)
      .then((res) => {
        createLogs(
          `Обновил категорию товаров (${this.state.name}) Продавца с id ${this.props.marketId}`
        );
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
            setTimeout(() => window.location.reload(), 1000);

            message.success("Успешно!");
          });
        } else {
          this.setState({ visibleUpdate: false });
          this.refresh();
          setTimeout(() => window.location.reload(), 1000);
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
      url: `${url}api/v1/super/product-category/${id}`,
    };

    axios(authOptions)
      .then(() => {
        createLogs(
          `Удалил категорию товаров (${name}) Продавца с id ${this.props.marketId}`
        );
        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(() => {
        message.error("Вы не можете удалить, есть товары в этой категории");
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
            {this.props.canEditUser && (
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
              </a>
            )}{" "}
            |{" "}
            {this.props.canDeleteUser && (
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
            )}
          </span>
        ),
      },
    ];

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список категорий товаров</h2>
        <Drawer
          title="Изменить категорию товаров"
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
          title="Создать категорию товаров"
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
          {this.props.canEditUser && (
            <Button
              onClick={() => this.setState({ editModal: true })}
              type="primary"
            >
              <Icon type="plus" />
              Добавить категорию товаров
            </Button>
          )}
        </Button.Group>

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.categories}
            scroll={{ x: "calc(700px + 50%)", y: 500 }}
          />
        </Spin>
      </Content>
    );
  }
}
