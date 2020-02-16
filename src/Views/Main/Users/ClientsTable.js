import React from "react";
import { Icon, Table, Button, Layout, Pagination, Spin, Avatar } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Аватар",
    dataIndex: "avatar",
    key: "avatar",
    render: avatar => (
      <Avatar
        src={
          avatar
            ? `http://91.201.214.201:8443/images/${avatar.imageName}`
            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      />
    )
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
    )
  },
  {
    title: "Город",
    dataIndex: "city",
    key: "city"
  },
  {
    title: "Номер телефона",
    dataIndex: "username",
    key: "username",
    render: username => {
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
    }
  },
  {
    title: "Пол",
    dataIndex: "sex",
    key: "sex",
    render: sex => <span>{sex === "M" ? "Мужской" : "Женский"}</span>
  }
];

export default class ClientsTable extends React.Component {
  state = {
    clients: [],
    spinning: false
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
      .get(`${url}api/v1/user`, {
        headers
      })
      .then(res => {
        console.log(res.data);

        const result = res.data.users.filter(
          user => user.username.length === 10
        );

        this.setState({ spinning: false, clients: result });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список клиентов</h2>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.clients} />
        </Spin>
      </Content>
    );
  }
}
