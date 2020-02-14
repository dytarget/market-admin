import React from "react";
import { Icon, Table, Button, Layout, Spin, Avatar } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import getMasterStatus from "../../../utils/getMasterStatus";

const url = "https://cors-anywhere.herokuapp.com/http://91.201.214.201:8443/";
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
      <Link to={`/users/masters/${data.username}`}>
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
    title: "Специализации",
    dataIndex: "specializations",
    key: "specializations",
    render: specializations => (
      <div>
        {specializations.map(({ specName }) => (
          <p style={{ margin: 0 }}>{specName}</p>
        ))}
      </div>
    )
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
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: status => <span>{getMasterStatus(status)}</span>
  }
];

export default class MastersTable extends React.Component {
  state = {
    masters: [],
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
      .get(`${url}api/v1/user/masters`, {
        headers
      })
      .then(res => {
        console.log(res.data);

        this.setState({ spinning: false, masters: res.data.users });
      })
      .catch(err => {
        console.log(err);
      });
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
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.masters} />
        </Spin>
      </Content>
    );
  }
}
