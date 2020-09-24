import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  message,
  Icon,
} from "antd";
import React from "react";
import axios from "axios";
import { store } from "../../../../store";
import createLogs from "../../../../utils/createLogs";
import config from "../../../../config/config";

const Option = Select.Option;
const ButtonGroup = Button.Group;
class NewUser extends React.Component {
  state = {
    visible: false,
    canLookOrder: false,
    canEditOrder: false,
    canDeleteOrder: false,
    canLookIncome: false,
    canEditIncome: false,
    canLookOutcome: false,
    canEditOutcome: false,
    canDeleteOutcome: false,
    canLookUser: false,
    canEditUser: false,
    canDeleteUser: false,
    canLookStatistics: false,
    cities: [],
    cityIds: [],
  };

  componentDidMount() {
    axios
      .get(`${config.url}api/v1/city/all`)
      .then((res) => this.setState({ cities: res.data.cities }));
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onCreate = () => {
    console.log(this.state);
    this.setState({ visible: false });
    console.log({
      code: this.password.state.value,
      username: this.login.state.value,
      firstName: this.firstName.state.value,
      lastName: this.lastName.state.value,
    });

    axios({
      method: "POST",
      url: `${config.url}api/v1/super/register`,
      data: {
        code: this.password.state.value,
        username: this.login.state.value,
        firstName: this.firstName.state.value,
        lastName: this.lastName.state.value,
      },
    }).then((res) => {
      axios({
        method: "PUT",
        url: `${config.url}api/v1/user/${res.data.username}`,
        data: {
          firstName: this.firstName.state.value,
          lastName: this.lastName.state.value,
        },
      });
      axios({
        method: "PATCH",
        url: `${config.url}api/v1/user/rights/${res.data.id}`,
        data: this.state,
      })
        .then(async () => {
          createLogs(
            `Создал Менеджерa ${this.firstName.state.value} ${this.lastName.state.value} ${this.login.state.value}`
          );

          await this.state.cityIds.forEach(async (cityId) => {
            await axios({
              method: "PATCH",
              url: `${config.url}api/v1/super/permission/${res.data.id}/city/${cityId}`,
            });
          });
          message.success("Успешно");
          setTimeout(() => window.location.reload(), 1000);

          this.props.refreshClientComponent();
        })
        .catch(() => {
          this.props.refreshClientComponent();
        });
    });
  };

  updatePermissions = (inputValues, defaultValues) => {
    defaultValues.forEach((value) => {
      if (inputValues.includes(value)) {
        this.setState({ [value]: true });
      } else {
        this.setState({ [value]: false });
      }
    });
  };

  handleOrderChange = (value) => {
    console.log(value);
    const values = ["canLookOrder", "canDeleteOrder", "canEditOrder"];
    this.updatePermissions(value, values);
  };

  handleIncomeChange = (value) => {
    console.log(value);
    const values = ["canLookIncome", "canEditIncome"];
    this.updatePermissions(value, values);
  };

  handleOutcomeChange = (value) => {
    console.log(value);
    const values = ["canLookOutcome", "canEditOutcome", "canDeleteOutcome"];
    this.updatePermissions(value, values);
  };

  handleUserChange = (value) => {
    console.log(value);
    const values = ["canLookUser", "canEditUser", "canDeleteUser"];
    this.updatePermissions(value, values);
  };

  handleStatisticChange = (value) => {
    console.log(value);
    const values = ["canLookStatistics"];
    this.updatePermissions(value, values);
  };

  render() {
    return (
      <div>
        <ButtonGroup>
          <Button type="primary" onClick={this.showDrawer}>
            <Icon type="google" /> Создать пользователя
          </Button>
          <Button
            type="primary"
            onClick={() => window.open(`${config.urlNode}logs`)}
          >
            <Icon type="file" /> Логи
          </Button>
          <Button onClick={() => this.props.refreshClientComponent()}>
            <Icon type="reload" />
          </Button>
        </ButtonGroup>
        <Drawer
          title={"Создание нового пользователя"}
          width={500}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Логин пользователя">
                  <Input
                    placeholder="Введите логин пользователя"
                    ref={(Input) => {
                      this.login = Input;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Пароль">
                  <Input
                    placeholder="Введите пароль"
                    type="password"
                    ref={(Input) => {
                      this.password = Input;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Имя">
                  <Input
                    placeholder="Введите имя пользователя"
                    ref={(Input) => {
                      this.firstName = Input;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Фамилия">
                  <Input
                    placeholder="Введите фамилию пользователя"
                    ref={(Input) => {
                      this.lastName = Input;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Права на Заказы">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    onChange={this.handleOrderChange}
                    optionLabelProp="label"
                  >
                    <Option value="canLookOrder" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditOrder" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteOrder" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Права на Входящие">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    onChange={this.handleIncomeChange}
                    optionLabelProp="label"
                  >
                    <Option value="canLookIncome" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditIncome" label="Действия">
                      Действия
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Права на Исходящие">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    onChange={this.handleOutcomeChange}
                    optionLabelProp="label"
                  >
                    <Option value="canLookOutcome" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditOutcome" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteOutcome" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Права на Пользователи">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    onChange={this.handleUserChange}
                    optionLabelProp="label"
                  >
                    <Option value="canLookUser" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditUser" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteUser" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Город">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права на Город"
                    onChange={(cityIds) => this.setState({ cityIds })}
                    optionLabelProp="label"
                  >
                    {this.state.cities.map((city) => (
                      <Option value={city.id} label={city.cityName}>
                        {city.cityName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Права на Статистику">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    onChange={this.handleStatisticChange}
                    optionLabelProp="label"
                  >
                    <Option value="canLookStatistics" label="Просмотр">
                      Просмотр
                    </Option>
                  </Select>
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
              textAlign: "right",
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
