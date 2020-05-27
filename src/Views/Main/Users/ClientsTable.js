import React from "react";
import {
  Icon,
  Table,
  Button,
  Layout,
  Pagination,
  Spin,
  Avatar,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import getUserDuration from "../../../utils/getUserDuration";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Аватар",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => (
      <Avatar
        src={
          avatar
            ? `http://91.201.214.201:8443/images/${avatar.imageName}`
            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      />
    ),
  },
  {
    title: "ФИО",
    dataIndex: "firstName",
    key: "firstName",
    render: (firstName, data) => (
      <Link to={`/users/clients/${data.username}`}>
        <span>
          {firstName} {data.lastName}
        </span>
      </Link>
    ),
  },
  {
    title: "Заказы",
    dataIndex: "userOrderCount",
    key: "userOrderCount",
  },
  {
    title: "Город",
    dataIndex: "city",
    key: "city",
    render: (city) => <span>{city.cityName}</span>,
  },
  {
    title: "Номер телефона",
    dataIndex: "username",
    key: "username",
    render: (username) => {
      const usernameMatch = username.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
      const phoneNumber =
        "(" +
        usernameMatch[1] +
        ") " +
        usernameMatch[2] +
        "-" +
        usernameMatch[3] +
        "-" +
        usernameMatch[4];

      return <span>8-{phoneNumber}</span>;
    },
  },
  {
    title: "Пол",
    dataIndex: "sex",
    key: "sex",
    render: (sex) => <span>{sex === "M" ? "Мужской" : "Женский"}</span>,
  },
  {
    title: "На портале",
    dataIndex: "created",
    key: "created",
    render: (created) => <span>{getUserDuration(created)}</span>,
  },
];

export default class ClientsTable extends React.Component {
  state = {
    clients: [],
    data: [],
    search: "",
    spinning: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/user`, {
        headers,
      })
      .then((res) => {
        console.log(res.data);

        const result = res.data.users.filter(
          (user) => user.username.length === 10
        );

        this.setState({ spinning: false, clients: result, data: result });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  change = (value) => {
    this.setState({ search: value.target.value });
    if (value.target.value === "") {
      this.setState({ data: this.state.clients });
    } else {
      const data = this.state.clients.filter(
        (data) =>
          `${data.firstName} ${data.lastName}`
            .toLowerCase()
            .indexOf(value.target.value.toLowerCase()) !== -1
      );
      this.setState({ data });
    }
  };

  render() {
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список Заказчиков</h2>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
        </Button.Group>

        <Input
          style={{ width: 300, marginLeft: 30 }}
          placeholder="Поиск по ФИО"
          value={this.state.search}
          onChange={this.change}
          prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.data} />
        </Spin>
      </Content>
    );
  }
}
