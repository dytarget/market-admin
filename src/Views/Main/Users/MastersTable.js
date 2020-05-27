import React from "react";
import { Icon, Table, Button, Layout, Spin, Avatar, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import getMasterStatus from "../../../utils/getMasterStatus";

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
      <Link to={`/users/masters/${data.username}`}>
        <span>
          {firstName} {data.lastName}
        </span>
      </Link>
    ),
  },
  {
    title: "Город",
    dataIndex: "city",
    key: "city",
    render: (city) => <span>{city.cityName}</span>,
  },
  {
    title: "Завершенные заказы",
    dataIndex: "masterOrderCount",
    key: "masterOrderCount",
  },
  {
    title: "Специализации",
    dataIndex: "specializations",
    key: "specializations",
    render: (specializations) => (
      <div>
        {
          specializations && specializations.length
          // map(({ specName }) => (
          // <p style={{ margin: 0 }}>{specName}</p>
          // ))
        }
      </div>
    ),
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
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status) => <span>{getMasterStatus(status)}</span>,
  },
];

export default class MastersTable extends React.Component {
  state = {
    masters: [],
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
      .get(`${url}api/v1/user/masters`, {
        headers,
      })
      .then((res) => {
        console.log(res.data);

        this.setState({
          spinning: false,
          masters: res.data.users,
          data: res.data.users,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  change = (value) => {
    this.setState({ search: value.target.value });
    if (value.target.value === "") {
      this.setState({ data: this.state.masters });
    } else {
      const data = this.state.masters.filter(
        (data) =>
          `${data.firstName}${data.lastName}`
            .toLowerCase()
            .indexOf(value.target.value.toLowerCase()) !== -1
      );
      this.setState({ data });
    }
  };

  render() {
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список мастеров</h2>
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
