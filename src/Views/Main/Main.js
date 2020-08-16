import React, { Component } from "react";
import { Layout, Menu, Button, Icon } from "antd";
import { Route, Switch } from "react-router";
import Orders from "./Orders/Orders";
import Users from "./Users/Users";
import { Link } from "react-router-dom";
import { Income } from "./Income/Income";
import Outcome from "./Outcome/Outcome";
import Statistics from "./Statistics/Statistics";
import Config from "./Config/Config";
import { SuperAdmin } from "./SuperAdmin/SuperAdmin";
import { connect } from "react-redux";
import { userSetAction } from "../../actions/userAction";
import Axios from "axios";
import config from "../../config/config";

const { Header, Footer } = Layout;

class Main extends Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    console.log("CHECK", this.props.userReducer.token);
    this.fetchAndUpdateUser();

    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/orders"
    ) {
      this.props.history.push("/orders/orderlist");
    } else if (window.location.pathname === "/income") {
      this.props.history.push("/income/messages");
    } else if (window.location.pathname === "/income") {
      this.props.history.push("/income/messages");
    }
  }

  fetchAndUpdateUser = () => {
    Axios.get(
      `${config.url}api/v1/user/${this.props.userReducer.user.username}`
    )
      .then((user) => {
        const resultUser = user.data;

        Axios.get(`${config.url}api/v1/super/permission/${resultUser.id}`)
          .then(({ data }) => {
            const cities = [];
            data.forEach((permission) => cities.push(permission.city.id));
            resultUser.cities = cities;
          })
          .then(() => {
            if (
              resultUser.roles.filter((e) => e.roleName === "ROLE_SUPER_ADMIN")
                .length > 0
            ) {
              resultUser.userRights = {
                canDeleteIncome: true,
                canDeleteOrder: true,
                canDeleteOutcome: true,
                canDeleteStatistics: true,
                canDeleteUser: true,
                canEditIncome: true,
                canEditOrder: true,
                canEditOutcome: true,
                canEditStatistics: true,
                canEditUser: true,
                canLookIncome: true,
                canLookOrder: true,
                canLookOutcome: true,
                canLookStatistics: true,
                canLookUser: true,
              };
              resultUser.isSuperAdmin = true;
            }
            this.setState({ loading: false });
            this.props.userSetAction(
              true,
              this.props.userReducer.token,
              resultUser
            );
          });
      })
      .catch((err) => {
        this.props.history.push("/login");
      });
  };

  logout = () => {
    localStorage.clear();
    window.location.reload();
    this.props.history.push("/login");
  };

  render() {
    return (
      this.state.loading || (
        <div>
          <Layout>
            <Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="header"
            >
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[
                  `${window.location.pathname.substring(
                    0,
                    window.location.pathname.lastIndexOf("/")
                  )}`,
                ]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item key="/orders">
                  <Link to="/orders/orderlist">Заказы</Link>
                </Menu.Item>
                <Menu.Item key="/income">
                  <Link to="/income/messages">Входящие</Link>
                </Menu.Item>
                <Menu.Item key="/outcome">
                  <Link to="/outcome/promos">Исходящие</Link>
                </Menu.Item>
                <Menu.Item key="/users">
                  <Link to="/users/clients">Пользователи</Link>
                </Menu.Item>
                <Menu.Item key="/statistics">
                  <Link to="/statistics/daily">Статистика</Link>
                </Menu.Item>
                {this.props.userReducer.user.isSuperAdmin && (
                  <Menu.Item key="/config">
                    <Link to="/config/categories">Конфигурации</Link>
                  </Menu.Item>
                )}
                {this.props.userReducer.user.isSuperAdmin && (
                  <Menu.Item key="/root">
                    <Link to="/root/main">Super Админ</Link>
                  </Menu.Item>
                )}
              </Menu>
              <Button
                onClick={this.logout}
                icon="logout"
                type="primary"
                size="large"
              >
                Выйти
              </Button>
            </Header>
            <Switch>
              <Route path="/orders/orderlist" component={Orders} />
              <Route path="/users" component={Users} />
              <Route path="/income" component={Income} />
              <Route path="/outcome" component={Outcome} />
              <Route path="/statistics" component={Statistics} />
              {this.props.userReducer.user.isSuperAdmin && (
                <>
                  <Route path="/config" component={Config} />
                  <Route path="/root" component={SuperAdmin} />
                </>
              )}
            </Switch>
            <Footer style={{ textAlign: "center" }}>
              Master24.kz ©2020 Created by DY Target
            </Footer>
          </Layout>
        </div>
      )
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {
  userSetAction,
})(Main);
