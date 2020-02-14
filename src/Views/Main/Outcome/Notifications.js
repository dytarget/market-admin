import React, { Component } from "react";
import { Form, Input, message, Button } from "antd";
import sendPushNotification from "../../../utils/sendPushNotification";
import TextArea from "antd/lib/input/TextArea";

export class Notifications extends Component {
  state = {
    title: "",
    body: ""
  };

  pushNotification = () => {
    const { title, body } = this.state;
    if (title.length < 1 || body.length < 1) {
      message.error("Заполните поля");
    } else {
      sendPushNotification(body, title, 15);
      this.setState({ editModal: false });
    }
  };

  render() {
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>
          Отправить уведомления для всех пользователей
        </h2>
        <Form style={{ width: 500, margin: "20px auto" }}>
          <Form.Item label="Заголовок">
            <Input
              value={this.state.title}
              onChange={text => this.setState({ title: text.target.value })}
            />
          </Form.Item>
          <Form.Item label="Содержимое">
            <TextArea
              rows={5}
              value={this.state.body}
              onChange={text => this.setState({ body: text.target.value })}
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

export default Notifications;
