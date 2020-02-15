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
    visibleUpdate: false,
    categoryId: ""
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios
      .get(`${url}api/v1/spec`, {
        headers
      })
      .then(res => {
        this.setState({ specs: res.data.specializations });
        axios
          .get(`${url}api/v1/category`, {
            headers
          })
          .then(res => {
            this.setState({ spinning: false, categories: res.data.categories });
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  createSpec = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true, editModal: false });
    const authOptions = {
      method: "POST",
      url: `${url}api/v1/admin/spec`,
      data: {
        categoryId: this.state.categoryId,
        masterName: this.state.masterRu,
        masterNameKz: this.state.masterKz,
        specName: this.state.nameRu,
        specNameKz: this.state.nameKz
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: true
    };

    axios(authOptions)
      .then(res => {
        this.refresh();
        message.success("Успешно!");
      })
      .catch(err => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  handleUpdate = () => {
    const { token } = store.getState().userReducer;
    const authOptions = {
      method: "PATCH",
      url: `${url}api/v1/admin/spec/${this.state.id}`,
      data: {
        categoryId: this.state.categoryId,
        masterName: this.state.masterRu,
        masterNameKz: this.state.masterKz,
        specName: this.state.nameRu,
        specNameKz: this.state.nameKz
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: true
    };

    this.setState({ spinning: true });
    axios(authOptions)
      .then(res => {
        this.refresh();
        message.success("Успешно!");
        this.setState({ visibleUpdate: false });
      })
      .catch(err => {
        console.log(err);
        message.error("Ошибка!");
      });
  };

  render() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "Название Ru",
        dataIndex: "specName",
        key: "specName"
      },
      {
        title: "Название kz",
        dataIndex: "specNameKz",
        key: "specNameKz"
      },
      {
        title: "Название мастера Ru",
        dataIndex: "masterName",
        key: "masterName"
      },
      {
        title: "Название мастера Kz",
        dataIndex: "masterNameKz",
        key: "masterNameKz"
      },
      {
        title: "Категория",
        dataIndex: "categoryId",
        key: "categoryId",
        render: categoryId => {
          const category = this.state.categories.find(
            cat => cat.id === categoryId
          );
          return <span>{category.name}</span>;
        }
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
                  visibleUpdate: true,
                  name_update: record.specName,
                  masterName_update: record.masterName,
                  id: record.id
                });
              }}
            >
              Изменить
            </a>
          </span>
        )
      }
    ];

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список специализацию</h2>
        <Drawer
          title="Изменить специализацию"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false
            })
          }
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Form.Item label="Категория">
              <Row gutter={16}>
                <Col span={24}>
                  <Select
                    onChange={categoryId => this.setState({ categoryId })}
                    value={this.state.categoryId}
                  >
                    {this.state.categories.map(cat => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={`Название на Ru`}>
                  <Input
                    value={this.state.nameRu}
                    onChange={e => this.setState({ nameRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={`Название на Kz`}>
                  <Input
                    value={this.state.nameKz}
                    onChange={e => this.setState({ nameKz: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={`Название мастера на Ru`}>
                  <Input
                    value={this.state.masterRu}
                    onChange={e => this.setState({ masterRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={`Название мастера на Kz`}>
                  <Input
                    value={this.state.masterKz}
                    onChange={e => this.setState({ masterKz: e.target.value })}
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
          title="Создать специализацию"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createSpec()}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form layout="vertical" hideRequiredMark>
            <Form.Item label="Категория">
              <Row gutter={16}>
                <Col span={24}>
                  <Select
                    onChange={categoryId => this.setState({ categoryId })}
                  >
                    {this.state.categories.map(cat => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Название на KZ">
                  <Input
                    value={this.state.nameKz}
                    onChange={e => this.setState({ nameKz: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Название на RU">
                  <Input
                    value={this.state.nameRu}
                    onChange={e => this.setState({ nameRu: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Название мастера на KZ">
                  <Input
                    value={this.state.masterKz}
                    onChange={e => this.setState({ masterKz: e.target.value })}
                    type="text"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Название мастера на RU">
                  <Input
                    value={this.state.masterRu}
                    onChange={e => this.setState({ masterRu: e.target.value })}
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
       
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.specs} />
        </Spin>
      </Content>
    );
  }
}
