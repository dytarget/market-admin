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
  Select,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

export default class PromosTable extends React.Component {
  state = {
    promos: [],
    markets: [],
    spinning: false,
    editModal: false,
    editModal2: false,
    image: "",
    link: "",
    promoMasterImage: "",
    marketLink: "",
    visibleUpdate: false,
    displayType: "",
    editModalMarket: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/promo`, {
        headers,
      })
      .then((res) => {
        const result = res.data.filter(
          (pr) => pr.type === "ORDER" || pr.type === "MARKET"
        );
        this.setState({ spinning: false, promos: result });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${url}api/v1/market`)
      .then((res) => this.setState({ markets: res.data.markets }));
  };

  onChangeLogo = (info) => {
    this.setState({ image: info.file.originFileObj });
  };

  onChangeLogoMarket = (info) => {
    this.setState({ promoMasterImage: info.file.originFileObj });
  };

  createPromo = (value) => {
    this.setState({
      editModal: false,
      editModal2: false,
      spinning: true,
    });
    const { token } = store.getState().userReducer;
    const headers = {};

    axios
      .post(
        `${url}api/v1/promo?link=${this.state.link}&type=ORDER&displayType=${this.state.displayType}`,
        {},
        {
          headers,
        }
      )
      .then((res) => {
        const file = new FormData();
        console.log(this.state.image);

        file.append("file", this.state.image);

        const authOptions2 = {
          method: "POST",
          url: `${url}api/v1/image/promo/${res.data.id}`,
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
      });
  };

  createMarketPromo = () => {
    this.setState({ spinning: true, editModalMarket: false });

    axios
      .post(
        `${url}api/v1/promo?link=${this.state.marketLink}&type=MARKET&marketId=${this.state.promoMarketId}&displayType=${this.state.displayTypeMarket}`,
        {},
        {
          headers: {},
        }
      )
      .then((res) => {
        console.log(res.data);
        const files = new FormData();
        files.append("file", this.state.promoMasterImage);
        axios
          .post(`${url}api/v1/image/promo/${res.data.id}`, files, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.refresh();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deletePromos = (id) => {
    const { token } = store.getState().userReducer;
    const headers = {
      // Authorization: `Bearer ${token}`
    };

    axios
      .delete(`${url}api/v1/promo/${id}`, {
        headers,
      })
      .then(() => {
        this.refresh();
        message.success("Успешно!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Баннер",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img
            width={230}
            height={150}
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
        title: "Для кого",
        dataIndex: "displayType",
        key: "displayType",
        render: (displayType) => {
          const data = {
            CUSTOMER: "Заказчик",
            MASTER: "Мастер",
          };
          return <span>{data[displayType]}</span>;
        },
      },
      {
        title: "Тип",
        dataIndex: "type",
        key: "type",
        render: (type) => {
          const data = {
            MARKET: "Маркет",
            ORDER: "Лента",
          };
          return <span>{data[type]}</span>;
        },
      },
      {
        title: "ID Маркета",
        dataIndex: "marketId",
        key: "marketId",
      },
      {
        title: "Просмотры",
        dataIndex: "viewCount",
        key: "viewCount",
      },
      {
        title: "Ссылка",
        dataIndex: "link",
        key: "link",
        render: (link) => (
          <Link style={{ width: 300 }} onClick={() => window.open(link)}>
            <span>{link && link.substring(0, 10)}...</span>
          </Link>
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
            {/* <a
              onClick={() => {
                this.setState({
                  visibleUpdate: true,
                  link_update: record.link,
                  image_update: record.image,
                  id: record.id
                });
              }}
            >
              Изменить
            </a>
            <Divider type="vertical" /> */}
            <Popconfirm
              title="Вы уверены что хотите удалить?"
              onConfirm={() => this.deletePromos(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <a>Удалить</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
    };
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список реклам в ленте заказов</h2>
        {/* <Drawer
          title="Изменить рекламу"
          width={720}
          onClose={() =>
            this.setState({
              visibleUpdate: false
            })
          }
          visible={this.state.visibleUpdate}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Изменить переходную ссылку">
                  <Input
                    value={this.state.link_update}
                    onChange={e =>
                      this.setState({ link_update: e.target.value })
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
                    src={
                      this.state.image_update
                        ? `http://91.201.214.201:8443/images/${this.state.image_update.imageName}`
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
        </Drawer> */}
        <Modal
          title="Создать рекламу"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createPromo("ORDER")}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Переходная ссылка(http://... или https://...)">
              <Input
                onChange={(e) => this.setState({ link: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Баннер">
              <Upload fileList={[]} {...props} onChange={this.onChangeLogo}>
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
              <p>{this.state.image === "" || this.state.image.name}</p>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Создать рекламу с привязкой Маркета"
          visible={this.state.editModalMarket}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createMarketPromo}
          onCancel={() => this.setState({ editModalMarket: false })}
        >
          <Form>
            <Form.Item label="Маркет">
              <Select
                onChange={(e) => {
                  this.setState({ promoMarketId: e });
                }}
                type="text"
              >
                {this.state.markets.map((market) => {
                  return (
                    <Select.Option value={market.id}>
                      {market.marketName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="Переходная ссылка(http://... или https://...)">
              <Input
                onChange={(e) => this.setState({ marketLink: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Баннер">
              <Upload
                fileList={[]}
                {...props}
                onChange={this.onChangeLogoMarket}
              >
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
              <p>
                {this.state.promoMasterImage === "" ||
                  this.state.promoMasterImage.name}
              </p>
            </Form.Item>
          </Form>
        </Modal>

        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
          <Button
            onClick={() =>
              this.setState({
                editModal: true,
                displayType: "CUSTOMER",
              })
            }
            type="primary"
          >
            <Icon type="plus" />
            Добавить рекламу в заказах для Заказчика
          </Button>
          <Button
            onClick={() =>
              this.setState({
                editModal: true,
                displayType: "MASTER",
              })
            }
            type="primary"
          >
            <Icon type="plus" />
            Добавить рекламу в заказах для Мастера
          </Button>
          {/* <Button
            onClick={() => this.setState({ editModal2: true })}
            type="primary"
          >
            <Icon type="plus" />
            Добавить боковую рекламу
          </Button> */}
        </Button.Group>

        <Button.Group style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            onClick={() =>
              this.setState({
                editModalMarket: true,
                displayTypeMarket: "MASTER",
              })
            }
            type="primary"
          >
            <Icon type="plus" />
            Добавить рекламу для Мастера с привязкой к Маркету
          </Button>
          <Button
            onClick={() =>
              this.setState({
                editModalMarket: true,
                displayTypeMarket: "CUSTOMER",
              })
            }
            type="primary"
          >
            <Icon type="plus" />
            Добавить рекламу для Заказчика с привязкой к Маркету
          </Button>
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.promos}
            scroll={{ x: true }}
          />
        </Spin>
      </Content>
    );
  }
}
