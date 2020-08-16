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
  Drawer,
  Divider,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import { store } from "../../../store";
import createLogs from "../../../utils/createLogs";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class FAQTheme extends React.Component {
  state = {
    faqCats: [],
    spinning: false,
    editModal: false,
    visibleUpdate: false,
    name: "",
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.cleanUp();
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/faq-category`, {
        headers,
      })
      .then((res) => {
        console.log(res.data);

        this.setState({ spinning: false, faqCats: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cleanUp = () => {
    this.setState({
      name: this.state.name,
      nameKz: this.state.nameKz,
    });
  };

  createFAQTheme = () => {
    this.setState({ editModal: false });
    const { token } = store.getState().userReducer;
    const headers = {};

    axios
      .post(
        `${url}api/v1/super/faq/category`,
        {
          name: this.state.name,
          nameKz: this.state.nameKz,
        },
        {
          headers,
        }
      )
      .then((res) => {
        createLogs(`Создал Тему часто задаваемых вопросов ID=${res.data?.id}`);

        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteNews = (id) => {
    axios
      .delete(`${url}api/v1/super/faq/category/${id}`)
      .then(() => {
        this.refresh();
        createLogs(`Удалил Тему Вопросов ID = ${id}`);
        message.success("Успешно!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateFAQTheme = () => {
    const { token } = store.getState().userReducer;
    const headers = {};

    this.setState({ visibleUpdate: false });

    axios
      .patch(
        `${url}api/v1/super/faq/category/${this.state.id}`,
        {
          name: this.state.name,
          nameKz: this.state.nameKz,
        },
        {
          headers,
        }
      )
      .then((res) => {
        createLogs(`Обновил Тему часто задаваемых вопросов ID=${res.data?.id}`);

        this.refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
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
        title: "Название ",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Название на казахском",
        dataIndex: "nameKz",
        key: "nameKz",
      },
      {
        title: "Сколько вопросов по этой теме",
        dataIndex: "faqs",
        key: "faqs",
        render: (faqs) => <span>{faqs ? faqs.length : 0}</span>,
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
            {this.props.canEditOutcome && (
              <a
                onClick={() => {
                  this.setState({
                    visibleUpdate: true,
                    name: record.name,
                    nameKz: record.nameKz,
                    id: record.id,
                  });
                }}
              >
                Изменить
              </a>
            )}
            <Divider type="vertical" />
            {this.props.canDeleteOutcome && (
              <Popconfirm
                title="Вы уверены что хотите удалить?"
                onConfirm={() => this.deleteNews(record.id)}
                okText="Да"
                cancelText="Нет"
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
        <h2 style={{ textAlign: "center" }}>Часто задаваемые вопросы</h2>
        <Drawer
          title="Изменить тему"
          width={720}
          onClose={() => {
            this.setState({
              visibleUpdate: false,
            });
            this.cleanUp();
          }}
          onOk={this.updateFAQTheme}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить название">
                  <Input
                    value={this.state.name}
                    onChange={(e) => {
                      this.setState({ name: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
                <Form.Item label="Изменить название на казахском">
                  <Input
                    value={this.state.nameKz}
                    onChange={(e) => {
                      this.setState({ nameKz: e.target.value });
                    }}
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
            <Button onClick={this.updateFAQTheme} type="primary">
              Изменить
            </Button>
          </div>
        </Drawer>
        <Modal
          title="Создать тему"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createFAQTheme}
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
        >
          <Form>
            <Form.Item label="Название">
              <Input
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Название Kz">
              <Input
                onChange={(e) => this.setState({ nameKz: e.target.value })}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
          {this.props.canEditOutcome && (
            <Button
              onClick={() => this.setState({ editModal: true })}
              type="primary"
            >
              <Icon type="plus" />
              Добавить
            </Button>
          )}
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.faqCats}
            scroll={{ x: "calc(700px + 50%)", y: 480 }}
          />
        </Spin>
      </Content>
    );
  }
}
