import { Avatar, Button, Icon, Input, Layout, Spin, Table } from "antd";
import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import config from "../../../config/config";
import getLastOnline from "../../../utils/getLastOnline";
import getMasterStatus from "../../../utils/getMasterStatus";

const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 50,
    fixed: "left",
  },
  {
    title: "Аватар",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => (
      <Avatar
        src={
          avatar
            ? `${config.images}${avatar.imageName}`
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
    title: "Дата регистрации",
    dataIndex: "created",
    key: "created",
    render: (created) => (
      <span>
        {created[2]}/{created[1]}/{created[0]}
      </span>
    ),
  },
  {
    title: "Завершенные заказы",
    dataIndex: "masterOrderCount",
    key: "masterOrderCount",
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
  // {
  //   title: "Город",
  //   dataIndex: "city",
  //   key: "city",
  //   render: (city) => <span>{city.cityName}</span>,
  // },

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
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status) => <span>{getMasterStatus(status)}</span>,
  },
  {
    title: "Рейтинг",
    dataIndex: "rating",
    key: "rating",
  },
  {
    title: "Тип мастера",
    dataIndex: "masterType",
    key: "masterType",
    render: (masterType, data) => (
      <span>{masterType === "COMPANY" ? data.orgName : "Частный "}</span>
    ),
  },
  {
    title: "Пол",
    dataIndex: "sex",
    key: "sex",
    render: (sex) => <span>{sex === "M" ? "Мужской" : "Женский"}</span>,
  },
  {
    title: "Последня активность",
    dataIndex: "lastRequest",
    key: "lastRequest",
    render: (lastRequest) => <span>{getLastOnline(lastRequest)}</span>,
  },
  {
    title: "Менеджер",
    dataIndex: "manager",
    key: "manager",
    render: (manager) => {
      return (
        <span>
          {manager?.firstName} {manager?.lastName}
        </span>
      );
    },
  },
];

class MastersTable extends React.Component {
  state = {
    masters: [],
    data: [],
    search: "",
    searchPhone: "",
    spinning: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    axios
      .get(`${config.url}api/v1/user/masters`)
      .then((res) => {
        console.log(res.data);
        const { cities, isSuperAdmin } = this.props.userReducer.user;

        if (!isSuperAdmin && cities) {
          this.setState({
            spinning: false,
            masters: res.data.users.filter((user) =>
              cities.includes(user.city.id)
            ),
            data: res.data.users.filter((user) =>
              cities.includes(user.city.id)
            ),
          });
        } else {
          this.setState({
            spinning: false,
            masters: res.data.users,
            data: res.data.users,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  change = (value) => {
    const { searchPhone } = this.state;
    this.setState({ search: value.target.value });
    if (value.target.value === "" && searchPhone === "") {
      this.setState({ data: this.state.masters });
    } else {
      const data = this.state.masters.filter((data) => {
        if (searchPhone === "") {
          return (
            `${data.firstName} ${data.lastName}`
              .toLowerCase()
              .indexOf(value.target.value.toLowerCase()) !== -1
          );
        } else {
          return (
            `${data.firstName} ${data.lastName}`
              .toLowerCase()
              .indexOf(value.target.value.toLowerCase()) !== -1 &&
            `${data.username}`.indexOf(searchPhone) !== -1
          );
        }
      });
      this.setState({ data });
    }
  };

  changePhone = (value) => {
    const { search } = this.state;
    this.setState({ searchPhone: value.target.value });
    if (value.target.value === "" && search === "") {
      this.setState({ data: this.state.masters });
    } else {
      const data = this.state.masters.filter((data) => {
        if (search === "") {
          return `${data.username}`.indexOf(value.target.value) !== -1;
        } else {
          return (
            `${data.firstName} ${data.lastName}`
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1 &&
            `${data.username}`.indexOf(value.target.value) !== -1
          );
        }
      });
      this.setState({ data });
    }
  };

  render() {
    return (
      <Content style={{ minHeight: 280 }}>
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

        <Input
          style={{ width: 300, marginLeft: 30 }}
          placeholder="Поиск по номеру тел.(7776665544)"
          value={this.state.searchPhone}
          onChange={this.changePhone}
          prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        <span style={{ marginLeft: 10 }}>
          Количество: {this.state.data.length}
        </span>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            pagination={{ pageSize: 7 }}
            dataSource={this.state.data}
            scroll={{ x: true }}
          />
        </Spin>
      </Content>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(MastersTable);
