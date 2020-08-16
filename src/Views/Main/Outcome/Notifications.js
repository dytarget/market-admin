import React, { Component } from "react";
import { Form, Input, message, Button, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import sendPushNotificationToAll from "../../../utils/sendPushNotificationToAll";
import createLogs from "../../../utils/createLogs";
import sendPushNotificationToMasters from "../../../utils/sendPushNotificationToMasters";
import Axios from "axios";
import config from "../../../config/config";
import { connect } from "react-redux";
import generateCitiesId from "../../../utils/generateCitiesId";

class Notifications extends Component {
  state = {
    title: "",
    body: "",
    titleKz: "",
    bodyKz: "",
    forWhom: "customers",
  };

  sendPushNotification = () => {
    const { title, body, titleKz, bodyKz, forWhom } = this.state;
    if (
      title.length < 1 ||
      body.length < 1 ||
      titleKz.length < 1 ||
      bodyKz.length < 1
    ) {
      message.error("Заполните поля");
    } else {
      message.warn("Подождите");
      if (forWhom === "customers") {
        createLogs(`Отправил уведомления Заказчикам`);
        this.sendNotsToCustomers();
      } else if (forWhom === "masters") {
        createLogs(`Отправил уведомления Мастерам`);
        this.sendNotsToMaster();
      }

      this.setState({ title: "", body: "", titleKz: "", bodyKz: "" });
    }
  };

  sendNotsToMaster = () => {
    const { title, body, titleKz, bodyKz } = this.state;
    Axios.get(`${config.url}api/v1/user/masters`).then((res) => {
      let arr = [];

      if (this.props.userReducer.user.isSuperAdmin) {
        res.data.users.forEach((user) => {
          arr.push(user.id);
        });
      } else {
        res.data.users.forEach((user) => {
          if (
            user.city &&
            this.props.userReducer.user.cities.includes(user.city.id)
          ) {
            arr.push(user.id);
          }
        });
      }

      console.log(arr);
      message.success("Отправлено");
      if (arr.length > 0) {
        sendPushNotificationToMasters(
          body,
          bodyKz,
          title,
          titleKz,
          arr,
          "",
          "",
          "master",
          "bells"
        );
      }
    });
  };

  sendNotsToCustomers = () => {
    const { title, body, titleKz, bodyKz } = this.state;
    Axios.get(`${config.url}api/v1/user`).then((res) => {
      let arr = [];

      if (this.props.userReducer.user.isSuperAdmin) {
        arr = res.data.users.map((user) => user.id);
      } else {
        res.data.users.forEach((user) => {
          if (
            user.city &&
            this.props.userReducer.user.cities.includes(user.city.id)
          ) {
            arr.push(user.id);
          }
        });
      }
      message.success("Отправлено");

      if (arr.length > 0) {
        sendPushNotificationToMasters(
          body,
          bodyKz,
          title,
          titleKz,
          arr,
          "",
          "",
          "client",
          "bells"
        );
      }
    });
  };

  render() {
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>Отправить уведомления</h2>
        <Form style={{ width: 500, margin: "20px auto" }}>
          <Form.Item label="Кому">
            <Select
              value={this.state.forWhom}
              onChange={(forWhom) => this.setState({ forWhom })}
            >
              <Select.Option value="customers">Заказчикам</Select.Option>
              <Select.Option value="masters">Мастерам</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Заголовок">
            <Input
              value={this.state.title}
              onChange={(text) => this.setState({ title: text.target.value })}
            />
          </Form.Item>
          <Form.Item label="Заголовок Kz">
            <Input
              value={this.state.titleKz}
              onChange={(text) => this.setState({ titleKz: text.target.value })}
            />
          </Form.Item>
          <Form.Item label="Содержимое">
            <TextArea
              rows={5}
              value={this.state.body}
              onChange={(text) => this.setState({ body: text.target.value })}
            />
          </Form.Item>
          <Form.Item label="Содержимое Kz">
            <TextArea
              rows={5}
              value={this.state.bodyKz}
              onChange={(text) => this.setState({ bodyKz: text.target.value })}
            />
          </Form.Item>
          <Button block type="primary" onClick={this.sendPushNotification}>
            Отправить всем пользователям
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(Notifications);
