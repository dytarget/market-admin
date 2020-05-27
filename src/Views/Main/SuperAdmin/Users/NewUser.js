import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  message,
  Icon
} from "antd";
import React from "react";
import axios from "axios";
import { store } from "../../../../store";
const url = "http://91.201.214.201:8443/";

const Option = Select.Option;
const ButtonGroup = Button.Group;
class NewUser extends React.Component {
  state = {
    visible: false,
    normal_acc: false,
    group_list: [
      { id: 1, value: "Админ" },
      { id: 2, value: "Маркет" }
    ],
    group_val: ""
  };
  compName = (state, lic) => {
    let result = lic;
    {
      state.map(comp => (lic === comp.id ? (result = comp.name) : comp.id));
    }
    return result;
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onCreate = () => {
    axios({
      method: "POST",
      url: `${url}api/v1/super/register`,
      data: {
        code: this.password.state.value,
        username: this.login.state.value
      },
      headers: {
        Authorization: "Bearer " + store.getState().userReducer.token
      }
    }).then(res => {
      message.success("Успешно");
      // this.props.refresh();
    });
  };

  render() {
    return (
      <div>
        <ButtonGroup>
          <Button type="primary" onClick={this.showDrawer}>
            <Icon type="google" /> Создать пользователя
          </Button>
          <Button onClick={() => this.props.refreshClientComponent()}>
            <Icon type="reload" />
          </Button>
        </ButtonGroup>
        <Drawer
          title={"Создание нового пользователя"}
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="vertical" hideRequiredMark>
            {this.state.normal_acc && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Имя пользователя">
                    <Input
                      placeholder="Введите имя пользователя"
                      onChange={value => {
                        console.log(value);

                        this.setState({});
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Фамилия пользователя">
                    <Input
                      placeholder="Введите фамилию пользователя"
                      ref={Input => {
                        this.surname = Input;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Логин пользователя">
                  <Input
                    placeholder="Введите логин пользователя"
                    ref={Input => {
                      this.login = Input;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Почта">
                  <Input
                    placeholder="Введите почту"
                    ref={Input => {
                      this.email = Input;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Группа пользователя">
                  <Select
                    defaultValue=""
                    onChange={val => this.setState({ group_val: val })}
                  >
                    {this.state.group_list.map(gr => (
                      <Option key={gr.id} value={gr.id}>
                        {gr.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Пароль">
                  <Input
                    placeholder="Введите пароль"
                    type="password"
                    ref={Input => {
                      this.password = Input;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Отменить
            </Button>
            <Button onClick={() => this.onCreate()} type="primary">
              Создать
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(NewUser);
