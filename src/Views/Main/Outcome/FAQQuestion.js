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
import createLogs from "../../../utils/createLogs";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class FAQQuestion extends React.Component {
  state = {
    faqCats: [],
    spinning: false,
    editModal: false,
    visibleUpdate: false,
    themes: [],
    image: "",
    image_old: "",
    image_update: "",
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.cleanUp();
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
        this.setState({
          spinning: false,
          faqCats: arr,
          themes: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cleanUp = () => {
    this.setState({
      categoryId: "",
      text: "",
      textKz: "",
      title: "",
      titleKz: "",
      image: "",
      image_update: "",
    });
  };

  createFAQQuestion = () => {
    this.setState({ editModal: false, spinning: true });
    axios
      .post(`${url}api/v1/super/faq`, {
        categoryId: this.state.categoryId,
        text: this.state.text,
        textKz: this.state.textKz,
        title: this.state.title,
        titleKz: this.state.titleKz,
      })
      .then((res) => {
        createLogs(`Создал часто задаваемый вопрос ID=${res.data?.id}`);

        if (this.state.image !== "") {
          const file = new FormData();
          file.append("file", this.state.image);

          const authOptions = {
            method: "POST",
            url: `${url}api/v1/image/faq/${res.data.id}`,
            data: file,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          };

          axios(authOptions).then((res) => {
            this.refresh();
            setTimeout(() => window.location.reload(), 1000);
          });
        } else {
          this.refresh();
          setTimeout(() => window.location.reload(), 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateFAQQuestion = () => {
    this.setState({ visibleUpdate: false, spinning: true });

    axios
      .patch(`${url}api/v1/super/faq/${this.state.id}`, {
        categoryId: this.state.categoryId,
        text: this.state.text,
        textKz: this.state.textKz,
        title: this.state.title,
        titleKz: this.state.titleKz,
      })
      .then((res) => {
        createLogs(`Обновил часто задаваемый вопрос ID=${res.data?.id}`);

        if (this.state.image_update !== "") {
          const file = new FormData();
          file.append("file", this.state.image_update);

          const authOptions = {
            method: "POST",
            url: `${url}api/v1/image/faq/${this.state.id}`,
            data: file,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          };

          axios(authOptions).then((res) => {
            this.refresh();
            setTimeout(() => window.location.reload(), 1000);
          });
        } else {
          this.refresh();
          setTimeout(() => window.location.reload(), 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  deleteNews = (id) => {
    axios
      .delete(`${url}api/v1/super/faq/${id}`)
      .then(() => {
        this.refresh();
        createLogs(`Удалил Часты задаваемые вопросы ID = ${id}`);
        message.success("Успешно!");
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
        width: 100,
        fixed: "left",
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
        render: (title) => (
          <span
            style={{
              maxWidth: 110,
              display: "inline-block",
              wordBreak: "break-all",
            }}
          >
            {title}
          </span>
        ),
      },
      {
        title: "Текст",
        dataIndex: "text",
        key: "text",
        render: (text) => <TextArea value={text} rows={4} />,
      },
      {
        title: "Заголовок на казахском",
        dataIndex: "titleKz",
        key: "titleKz",
        render: (titleKz) => (
          <span
            style={{
              maxWidth: 110,
              display: "inline-block",
              wordBreak: "break-all",
            }}
          >
            {titleKz}
          </span>
        ),
      },
      {
        title: "Текст",
        dataIndex: "textKz",
        key: "textKz",
        render: (textKz) => <TextArea value={textKz} rows={4} />,
      },
      {
        title: "Фото",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img
            style={{ width: 70 }}
            src={
              image
                ? `http://91.201.214.201:8443/images/${image.imageName}`
                : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
            }
            alt=""
          />
        ),
      },
      {
        title: "Полезно",
        dataIndex: "useful",
        key: "useful",
      },
      {
        title: "Бесполезно",
        dataIndex: "notUseful",
        key: "notUseful",
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
                    title: record.title,
                    text: record.text,
                    titleKz: record.titleKz,
                    textKz: record.textKz,
                    image_old: record.image,
                    categoryId: record.categoryId,
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
          title="Изменить вопрос"
          width={720}
          onClose={() => {
            this.setState({
              visibleUpdate: false,
            });
            this.cleanUp();
          }}
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
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Прикрепить Новую фотографию">
                  <input
                    type="file"
                    onChange={(e) => {
                      this.setState({
                        image_update: e.target.files[0],
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
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
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
            scroll={{ x: "calc(900px + 50%)", y: 480 }}
            columns={columns}
            dataSource={this.state.faqCats}
          />
        </Spin>
      </Content>
    );
  }
}
