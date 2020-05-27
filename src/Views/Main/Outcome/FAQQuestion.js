/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  Icon,
  Table,
  Button,
  Layout,
  Spin,
  Avatar,
  Input,
  Form,
  Modal,
  Col,
  Row,
  Upload,
  Select,
  message,
  Drawer,
  Divider,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class FAQQuestion extends React.Component {
  state = {
    faqCats: [],
    spinning: false,
    editModal: false,
    visibleUpdate: false,
    themes: [],
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    axios
      .get(`${url}api/v1/faq-category`, {
        headers,
      })
      .then((res) => {
        let arr = [];
        console.log(res.data);

        res.data.forEach((item) => {
          const { faqs } = item;
          faqs.map((faq) => {
            faq.categoryName = item.name;
            faq.categoryId = item.id;
            return faq;
          });
          arr = arr.concat(faqs);
        });
        this.setState({ spinning: false, faqCats: arr, themes: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createFAQQuestion = () => {
    this.setState({ editModal: false });
    const { token } = store.getState().userReducer;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        `${url}api/v1/super/faq`,
        {
          categoryId: this.state.categoryId,
          text: this.state.text,
          textKz: this.state.textKz,
          title: this.state.title,
          titleKz: this.state.titleKz,
        },
        {
          headers,
        }
      )
      .then((res) => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateFAQQuestion = () => {
    const { token } = store.getState().userReducer;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.setState({ visibleUpdate: false });

    axios
      .patch(
        `${url}api/v1/super/faq/${this.state.id}`,
        {
          categoryId: this.state.categoryId,
          text: this.state.text,
          textKz: this.state.textKz,
          title: this.state.title,
          titleKz: this.state.titleKz,
        },
        {
          headers,
        }
      )
      .then((res) => {
        this.refresh();
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
        title: "Тема вопроса",
        dataIndex: "categoryName",
        key: "categoryName",
      },
      {
        title: "Заголовок ",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Текст",
        dataIndex: "text",
        key: "text",
      },
      {
        title: "Заголовок на казахском",
        dataIndex: "titleKz",
        key: "titleKz",
      },
      {
        title: "Текст",
        dataIndex: "textKz",
        key: "textKz",
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
                  title: record.title,
                  text: record.text,
                  titleKz: record.titleKz,
                  textKz: record.textKz,
                  categoryId: record.categoryId,
                  id: record.id,
                });
              }}
            >
              Изменить
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="Вы уверены что хотите удалить?"
              onConfirm={() => this.deleteNews(record.id)}
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
        <h2 style={{ textAlign: "center" }}>Часто задаваемые вопросы</h2>
        <Drawer
          title="Изменить вопрос"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false,
            })
          }
          onOk={this.updateFAQQuestion}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить тему вопроса">
                  <Select
                    value={this.state.categoryId}
                    onChange={(e) => {
                      this.setState({ categoryId: e });
                    }}
                    type="text"
                  >
                    {this.state.themes.map((theme) => {
                      return (
                        <Select.Option value={theme.id}>
                          {theme.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить заголовок">
                  <Input
                    value={this.state.title}
                    onChange={(e) => {
                      this.setState({ title: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить заголовок Kz">
                  <Input
                    value={this.state.titleKz}
                    onChange={(e) => {
                      this.setState({ titleKz: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить текст">
                  <TextArea
                    value={this.state.text}
                    onChange={(e) => {
                      this.setState({ text: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить текст Kz">
                  <TextArea
                    value={this.state.textKz}
                    onChange={(e) => {
                      this.setState({ textKz: e.target.value });
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
            <Button onClick={this.updateFAQQuestion} type="primary">
              Изменить
            </Button>
          </div>
        </Drawer>
        <Modal
          title="Создать вопрос"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createFAQQuestion}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Тема вопроса">
              <Select
                onChange={(e) => {
                  this.setState({ categoryId: e });
                }}
                type="text"
              >
                {this.state.themes.map((theme) => {
                  return (
                    <Select.Option value={theme.id}>{theme.name}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="Заголовок">
              <Input
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Заголовок Kz">
              <Input
                onChange={(e) => this.setState({ titleKz: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Текст">
              <TextArea
                onChange={(e) => this.setState({ text: e.target.value })}
                rows={4}
              />
            </Form.Item>
            <Form.Item label="Текст Kz">
              <TextArea
                onChange={(e) => this.setState({ textKz: e.target.value })}
                rows={4}
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
          <Table columns={columns} dataSource={this.state.faqCats} />
        </Spin>
      </Content>
    );
  }
}
