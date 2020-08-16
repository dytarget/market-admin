import {
  Table,
  Popconfirm,
  message,
  Modal,
  Button,
  Input,
  Select,
  Icon,
  BackTop,
  Tag,
  Form,
  Row,
  Col,
  Card,
} from "antd";
import { Link } from "react-router-dom";
import React, { Component, useEffect } from "react";
import axios from "axios";
import NewUser from "./NewUser";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import UsersCategory from "./UsersCategory";
import { store } from "../../../../store";
import { UserOperations } from "./UserOperations";
import { useState } from "react";

const url = "http://91.201.214.201:8443/";

const Option = Select.Option;
const ButtonGroup = Button.Group;
const { Meta } = Card;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_res: [],
      update_data: [{ id: "", login: "", email: "", group: "" }],
      editingKey: "",
      chModal: false,
      avatar:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      fstName: "",
      lstName: "",
      user_id: "",
      group_list: [],
      phone: "",
      paper_address: "",
      real_address: "",
      cities: [],
    };

    this.columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => b.id - a.id,
        sortDirections: ["descend"],
        sortOrder: true,
      },
      {
        title: "Логин",
        dataIndex: "username",
        key: "login",
      },
      {
        title: "Имя",
        dataIndex: "firstName",
        key: "firstName",
      },
      {
        title: "Фамилия",
        dataIndex: "lastName",
        key: "lastName",
      },
      {
        title: "Группа пользователя",
        dataIndex: "group_name",
        key: "group_name",
        render: (text, record) => {
          const isSuperAdmin =
            record.roles.filter((e) => e.roleName === "ROLE_SUPER_ADMIN")
              .length > 0;
          return (
            <span>
              {isSuperAdmin ? (
                <Tag color={"#9c0d08"}>Super-Админ</Tag>
              ) : (
                <Tag color={"#08979c"} key={record.id}>
                  Менеджер
                </Tag>
              )}
              <Icon type="user" />
            </span>
          );
        },
      },
      {
        title: "Действия",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.data_res.length >= 1 ? (
            <UserOperations
              record={record}
              refresh={this.refresh}
              cities={this.state.cities}
            />
          ) : null,
      },
    ];
  }

  refresh = () => {
    this.setState({ loading: true });

    axios
      .get(`${url}api/v1/city/all`)
      .then((res) => this.setState({ cities: res.data.cities }));

    axios
      .get(`${url}api/v1/super/user/admins`)
      .then((res) => {
        console.log(res.data);

        this.setState({ loading: false, data_res: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    return (
      <div>
        <div>
          <NewUser
            refreshClientComponent={this.refresh}
            login={this.props.login}
          />
        </div>

        <Row>
          <Col span={24}>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.state.data_res}
              loading={this.state.loading}
              scroll={{ y: 500 }}
            />
            <BackTop />
            <strong style={{ color: "rgba(64, 64, 64, 0.6)" }} />
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    login: state.login,
    b_url: state.b_url,
    token: state.token,
  };
};
export default connect(mapStateToProps)(Admin);
