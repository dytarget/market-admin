import React from "react";
import { Icon, Table, Button, Layout, Pagination, Spin, Avatar } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

const types = {
  QUESTION: "Вопрос",
  COMPLAINT: "Жалоба",
  SUGGESTION: "Предложения",
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Кто отправил",
    dataIndex: "user",
    key: "user",
    render: (user) => (
      <Link to={`/users/clients/${user.username}`}>
        {user.firstName} {user.lastName}
      </Link>
    ),
  },
  {
    title: "Номер телефона",
    dataIndex: "user",
    key: "user",
    render: (user) => {
      const usernameMatch = user.username.match(
        /^(\d{3})(\d{3})(\d{2})(\d{2})$/
      );
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
    title: "Тип обращения",
    dataIndex: "type",
    key: "type",
    render: (type) => <span>{types[type]}</span>,
  },
  {
    title: "Текст",
    dataIndex: "text",
    key: "text",
    render: (text) => <TextArea value={text} rows={1} />,
  },
  {
    title: "Дата",
    dataIndex: "created",
    key: "created",
    render: (created) => (
      <span>
        {created[2]}/{created[1]}/{created[0]}
      </span>
    ),
  },
];

export default class UserReview extends React.Component {
  state = {
    reviews: [],
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
      .get(`${url}api/v1/support`, {
        headers,
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ spinning: false, reviews: res.data.supportMessages });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список обращении</h2>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.reviews} />
        </Spin>
      </Content>
    );
  }
}
