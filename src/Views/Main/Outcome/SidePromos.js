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
import createLogs from "../../../utils/createLogs";
import { connect } from "react-redux";
import generateCitiesId from "../../../utils/generateCitiesId";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

class SidePromos extends React.Component {
  state = {
    promos: [],
    spinning: false,
    editModal: false,
    editModal2: false,
    master: [],
    customer: [],
    markets: [],
    image: "",
    link: "",
    forWhom: "",
    promoMarketId: "",
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
      .get(`${url}api/v1/promo${generateCitiesId(true)}`, {
        headers,
      })
      .then((res) => {
        const result = res.data.filter(
          (pr) => pr.type === "SIDE" && pr.displayType === "MASTER"
        );
        const result2 = res.data.filter(
          (pr) => pr.type === "SIDE" && pr.displayType === "CUSTOMER"
        );
        this.setState({
          spinning: false,
          master: result,
          customer: result2,
        });
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

  cleanUp = () => {
    this.setState({
      image: "",
      link: "",
      forWhom: "",
      promoMarketId: "",
    });
  };

  createPromo = (value) => {
    this.setState({
      editModal: false,
      editModal2: false,
      spinning: true,
    });
    const { token } = store.getState().userReducer;

    axios
      .post(
        `${url}api/v1/promo?link=${this.state.link}&type=SIDE&marketId=${this.state.promoMarketId}&displayType=${this.state.forWhom}`,
        {}
      )
      .then((res) => {
        createLogs(`Создал Боковой Баннер ID=${res.data.id}`);

        const file = new FormData();
        console.log(this.state.image);

        file.append("file", this.state.image);

        const authOptions2 = {
          method: "POST",
          url: `${url}api/v1/image/promo/${res.data.id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: file,
        };
        axios(authOptions2).then(() => {
          this.refresh();
          setTimeout(() => window.location.reload(), 1000);

          message.success("Успешно!");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deletePromos = (id) => {
    const { token } = store.getState().userReducer;

    axios
      .delete(`${url}api/v1/promo/${id}`)
      .then((res) => {
        createLogs(`Удалил Боковой Баннер ID=${id}`);
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
            width={300}
            height={200}
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
        title: "ID Продавца",
        dataIndex: "marketId",
        key: "marketId",
        render: (marketId) => (
          <Link to={`/users/markets/${marketId}`}>{marketId}</Link>
        ),
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
        title: "Просмотры",
        dataIndex: "viewCount",
        key: "viewCount",
      },
      {
        title: "Обновлён",
        dataIndex: "lastUpdated",
        key: "lastUpdated",
        render: (lastUpdated) =>
          lastUpdated && (
            <span>
              {lastUpdated[2]}/{lastUpdated[1]}/{lastUpdated[0]}
            </span>
          ),
      },
      {
        title: "Действия",
        key: "action",
        render: (text, record) =>
          this.props.canDeleteOutcome && (
            <span>
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
        <h2 style={{ textAlign: "center" }}>Боковые баннеры для Мастеров</h2>
        <Modal
          title="Создать боковой баннер"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={() => this.createPromo("side")}
          onCancel={() => {
            this.setState({ editModal: false });
            this.cleanUp();
          }}
        >
          <Form>
            <Form.Item label="Продавец">
              <Select
                onChange={(e) => {
                  this.setState({ promoMarketId: e });
                }}
                type="text"
              >
                {this.state.markets.map((market) => {
                  if (
                    this.props.userReducer.user.isSuperAdmin ||
                    this.props.userReducer.user.cities.includes(market.city.id)
                  ) {
                    console.log("SHOW UP");

                    return (
                      <Select.Option value={market.id}>
                        {market.marketName}
                      </Select.Option>
                    );
                  }
                })}
              </Select>
            </Form.Item>
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
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
          {this.props.canEditOutcome && (
            <>
              <Button
                onClick={() =>
                  this.setState({
                    editModal: true,
                    forWhom: "MASTER",
                  })
                }
                type="primary"
              >
                <Icon type="plus" />
                Добавить баннер для Мастера
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    editModal: true,
                    forWhom: "CUSTOMER",
                  })
                }
                type="primary"
              >
                <Icon type="plus" />
                Добавить баннер для Заказчика
              </Button>
            </>
          )}
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.master} />
          <h2 style={{ textAlign: "center" }}>
            Боковые баннеры для Заказчиков
          </h2>
          <Table columns={columns} dataSource={this.state.customer} />
        </Spin>
      </Content>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(SidePromos);
