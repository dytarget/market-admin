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

export default class Specs extends React.Component {
  state = {
    specs: [],
    categories: [],
    spinning: false,
    editModal: false,
    nameKz: "",
    nameRu: "",
    masterKz: "",
    masterRu: "",
    id: "",
    priority: "",
    visibleUpdate: false,
    categoryId: "",
    data: [],
    categoryName: "",
    filteredValues: "",
  };

  componentDidMount() {
    this.refresh();
  }

  deleteCategory = (id) => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const authOptions = {
      method: "DELETE",
      url: `${config.url}api/v1/super/spec/${id}`,
      headers: {},
    };

    axios(authOptions)
      .then(() => {
        this.refresh();
        createLogs(`Удалил Специализацию ID=${id}`);
      })
      .catch(() => {
        message.error(
          "Вы не можете удалить, есть зависимости в этой специализации"
        );
        this.setState({ spinning: false });
      });
  };

  change = (value) => {
    this.setState({ search: value.target.value });
    if (value.target.value === "") {
      this.setupCategoryChange();
    } else {
      if (this.state.categoryName === "") {
        const data = this.state.specs.filter(
          (data) =>
            `${data.specName}`
              .toLowerCase()
              .indexOf(value.target.value.toLowerCase()) !== -1 ||
            `${data.specNameKz}`
              .toLowerCase()
              .indexOf(value.target.value.toLowerCase()) !== -1
        );
        this.setState({ data });
      } else {
        const data = this.state.specs
          .filter(
            (data) => data.category.categoryName === this.state.categoryName
          )
          .filter(
            (data) =>
              `${data.specName}`
                .toLowerCase()
                .indexOf(value.target.value.toLowerCase()) !== -1 ||
              `${data.specNameKz}`
                .toLowerCase()
                .indexOf(value.target.value.toLowerCase()) !== -1
          );
        this.setState({ data });
      }
    }
  };

  changeCategory = (categoryName) => {
    this.setState({ categoryName }, () => this.setupCategoryChange());
  };

  setupCategoryChange = () => {
    const { categoryName } = this.state;
    if (categoryName === "") {
      this.setState({ data: this.state.specs, search: "" });
    } else {
      const data = this.state.specs.filter(
        (data) => data.category.categoryName === categoryName
      );
      this.setState({ data });
    }
  };

  refresh = () => {
    this.cleanUp();
    this.setState({ spinning: true });
    axios
      .get(`${config.url}api/v1/spec`)
      .then((res) => {
        this.setState({
          specs: res.data.specializations.sort(
            (a, b) => a.priority - b.priority
          ),
          data: res.data.specializations.sort(
            (a, b) => a.priority - b.priority
          ),
        });
        axios.get(`${config.url}api/v1/category`).then((res) => {
          this.setState({
            spinning: false,
            categories: res.data.categories,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cleanUp = () => {
    this.setState({
      categoryId: "",
      masterName: "",
      masterNameKz: "",
      specName: "",
      specNameKz: "",
      priority: "",
    });
  };

  createSpec = () => {
    this.setState({ spinning: true, editModal: false });
    const authOptions = {
      method: "POST",
      url: `${config.url}api/v1/super/spec`,
      data: {
        categoryId: this.state.categoryId,
        specName: this.state.nameRu,
        specNameKz: this.state.nameKz,
        priority: this.state.priority,
      },
      headers: {},
      json: true,
    };

    axios(authOptions)
      .then((res) => {
        createLogs(`Создал Специализацию ID=${res.data.id}`);
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
      url: `${config.url}api/v1/super/spec/${this.state.id}`,
      data: {
        categoryId: this.state.categoryId,
        specName: this.state.nameRu,
        specNameKz: this.state.nameKz,
        priority: this.state.priority,
      },
      headers: {},
      json: true,
    };

    this.setState({ spinning: true });
    axios(authOptions)
      .then((res) => {
        createLogs(`Обновил Специализацию ID=${res.data.id}`);
        setTimeout(() => window.location.reload(), 1000);

        this.refresh();
        message.success("Успешно!");
        this.setState({ visibleUpdate: false });
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  render() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 100,
        fixed: "left",
      },
      {
        title: "Название Ru",
        dataIndex: "specName",
        key: "specName",
      },
      {
        title: "Название kz",
        dataIndex: "specNameKz",
        key: "specNameKz",
      },
      {
        title: "Приоритет",
        dataIndex: "priority",
        key: "priority",
      },
      {
        title: "Категория",
        dataIndex: "category",
        key: "category",
        render: (category) => {
          return <span>{category && category.categoryName}</span>;
        },
      },
      {
        title: "Количество Мастеров",
        dataIndex: "masterCount",
        key: "masterCount",
      },
      {
        title: "Количество Продавцов",
        dataIndex: "marketCount",
        key: "marketCount",
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
                  visibleUpdate: true,
                  nameRu: record.specName,
                  nameKz: record.specNameKz,
                  categoryId: record.category.id,
                  id: record.id,
                  priority: record.priority,
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
        <h2 style={{ textAlign: "center" }}>Список специализаций</h2>
        <Drawer
          title="Изменить специализацию"
          width={720}
          onClose={() => {
            this.cleanUp();
            this.setState({
              visibleUpdate: false,
            });
          }}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Категория">
                  <Select
                    onChange={(categoryId) => this.setState({ categoryId })}
                    defaultValue={this.state.categoryId}
                  >
                    {this.state.categories.map((cat) => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Приоритет">
                  <Input
                    value={this.state.priority}
                    onChange={(e) =>
                      this.setState({ priority: e.target.value })
                    }
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={`Название на Ru`}>
                  <Input
                    value={this.state.nameRu}
                    onChange={(e) => this.setState({ nameRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={`Название на Kz`}>
                  <Input
                    value={this.state.nameKz}
                    onChange={(e) => this.setState({ nameKz: e.target.value })}
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
          title="Создать специализацию"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createSpec()}
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Категория">
                  <Select
                    value={this.state.categoryId}
                    onChange={(categoryId) => this.setState({ categoryId })}
                  >
                    {this.state.categories.map((cat) => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Приоритет">
                  <Input
                    value={this.state.priority}
                    onChange={(e) =>
                      this.setState({ priority: e.target.value })
                    }
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Название на KZ">
                  <Input
                    value={this.state.nameKz}
                    onChange={(e) => this.setState({ nameKz: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Название на RU">
                  <Input
                    values={this.state.nameRu}
                    onChange={(e) => this.setState({ nameRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
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
            Добавить специализацию
          </Button>
        </Button.Group>
        <Input
          style={{ width: 200, marginLeft: 15 }}
          placeholder="Поиск по Названию"
          value={this.state.search}
          onChange={this.change}
          prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        <Select
          style={{ width: 200, marginLeft: 15 }}
          value={this.state.categoryName}
          onChange={this.changeCategory}
        >
          <Select.Option value={""}>Все</Select.Option>
          {this.state.categories.map((cat) => (
            <Select.Option value={cat.categoryName}>
              {cat.categoryName}
            </Select.Option>
          ))}
        </Select>

        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.data}
            style={{ marginRight: 20 }}
            scroll={{ x: "calc(600px + 70%)", y: 500 }}
          />
        </Spin>
      </Content>
    );
  }
}
