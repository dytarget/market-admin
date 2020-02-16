import React from "react";
import { Form, Icon, Input, Button, message } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { userSetAction } from "../../actions/userAction";

const url = "http://91.201.214.201:8443/";

class LoginPage extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        axios({
          method: "POST",
          url: `${url}api/v1/auth/admin-login`,
          data: values,
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then(res => {
            this.props.userSetAction(true, res.data.accessToken,{});
            this.props.history.push("/");
          })
          .catch(err => {
            message.error("Неправильный логин или пароль");
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-container">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "Введите логин!" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Логин"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "Введите пароль!" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Пароль"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const LoginPageForm = Form.create({ name: "normal_login" })(LoginPage);

export default connect(({ userReducer }) => ({ userReducer }), {
  userSetAction
})(LoginPageForm);
