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
  message,
  Drawer,
  Divider,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";
import sendPushNotificationToAll from "../../../utils/sendPushNotificationToAll";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class NewsTable extends React.Component {
  state = {
    news: [],
    spinning: false,
    editModal: false,
    visibleUpdate: false,
    image: "",
    title: "",
    text: "",
    image_old: "",
    image_update: "",
    youtubeVideo: "",
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });

    axios
      .get(`${url}api/v1/news/all`)
      .then((res) => {
        console.log(res.data);

        this.setState({ spinning: false, news: res.data.news });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createNews = () => {
    const { image, text, title } = this.state;
    const obj = {
      image,
      text,
      title,
    };
    const { token } = store.getState().userReducer;
    const headers = {};

    axios
      .post(`${url}api/v1/news`, {
        header: this.state.title,
        text: this.state.text,
        headerKz: this.state.titleKz,
        textKz: this.state.textKz,
        youtubeVideo: this.state.youtubeVideo,
      })
      .then((res) => {
        console.log(res.data);
        sendPushNotificationToAll(
          ``,
          `Новая запись в новостях`,
          null,
          "News",
          0,
          "client",
          "bells"
        );
        const file = new FormData();
        file.append("file", this.state.image);

        const authOptions = {
          method: "POST",
          url: `${url}api/v1/image/news/${res.data.id}`,
          data: file,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };

        axios(authOptions).then((res) => {
          this.refresh();
          this.setState({ editModal: false });
        });
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(obj);
  };

  updateNews = () => {
    const { token } = store.getState().userReducer;
    const headers = {};

    this.setState({ visibleUpdate: false, spinning: true });

    axios
      .patch(`${url}api/v1/news/${this.state.id}`, {
        header: this.state.title_update,
        text: this.state.text_update,
        headerKz: this.state.title_updateKz,
        textKz: this.state.text_updateKz,
        youtubeVideo: this.state.youtubeVideo,
      })
      .then((res) => {
        console.log(res.data);
        if (this.state.image_update !== "") {
          const file = new FormData();
          file.append("file", this.state.image_update);

          const authOptions = {
            method: "POST",
            url: `${url}api/v1/image/news/${this.state.id}`,
            data: file,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          };

          axios(authOptions).then((res) => {
            this.refresh();
            this.setState({ visibleUpdate: false });
          });
        } else {
          this.refresh();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  onChangeUpdate = (info) => {
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
        title: "Фото",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img
            style={{ width: 70 }}
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
        title: "Заголовок",
        dataIndex: "header",
        key: "header",
      },
      {
        title: "Заголовок Kz",
        dataIndex: "headerKz",
        key: "headerKz",
      },
      {
        title: "Текст",
        dataIndex: "text",
        key: "text",
        render: (text) => <TextArea value={text} rows={4} />,
      },
      {
        title: "Текст Kz",
        dataIndex: "textKz",
        key: "textKz",
        render: (textKz) => <TextArea value={textKz} rows={4} />,
      },
      {
        title: "Youtube Video",
        dataIndex: "youtubeVideo",
        key: "youtubeVideo",
        render: (youtubeVideo) => (
          <Link onClick={() => window.open(youtubeVideo)}>{youtubeVideo}</Link>
        ),
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
                  title_update: record.header,
                  text_update: record.text,
                  title_updateKz: record.headerKz,
                  text_updateKz: record.textKz,
                  image_old: record.image,
                  youtubeVideo: record.youtubeVideo,
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
        <h2 style={{ textAlign: "center" }}>Список новостей</h2>
        <Drawer
          title="Изменить новость"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false,
            })
          }
          onOk={this.updateNews}
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить Заголовок">
                  <Input
                    value={this.state.title_update}
                    onChange={(e) => {
                      this.setState({ title_update: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить Текст">
                  <Input.TextArea
                    rows={12}
                    value={this.state.text_update}
                    onChange={(e) => {
                      this.setState({ text_update: e.target.value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить Заголовок Kz">
                  <Input
                    value={this.state.title_updateKz}
                    onChange={(e) => {
                      this.setState({ title_updateKz: e.target.value });
                    }}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить Текст Kz">
                  <Input.TextArea
                    rows={12}
                    value={this.state.text_updateKz}
                    onChange={(e) => {
                      this.setState({ text_updateKz: e.target.value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить ссылку Youtube Видео (Пример: https://youtu.be/5-4TgpDYPwg)">
                  <Input
                    value={this.state.youtubeVideo}
                    onChange={(e) => {
                      this.setState({ youtubeVideo: e.target.value });
                    }}
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
                      this.setState({ image_update: e.target.files[0] });
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
            <Button onClick={this.updateNews} type="primary">
              Изменить
            </Button>
          </div>
        </Drawer>
        <Modal
          title="Создать новость"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createNews}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Заголовок">
              <Input
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Текст">
              <TextArea
                rows={5}
                onChange={(e) => this.setState({ text: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Заголовок Kz">
              <Input
                onChange={(e) => this.setState({ titleKz: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Текст Kz">
              <TextArea
                rows={5}
                onChange={(e) => this.setState({ textKz: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Ссылка на Youtube видео (Пример: https://youtu.be/5-4TgpDYPwg)">
              <Input
                onChange={(e) =>
                  this.setState({ youtubeVideo: e.target.value })
                }
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
            Добавить
          </Button>
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.news} />
        </Spin>
      </Content>
    );
  }
}
