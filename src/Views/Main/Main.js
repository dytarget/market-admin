import React, { Component } from "react";
import { Layout, Menu, Button, Icon } from "antd";
import { Route, Switch } from "react-router";
import { Orders } from "./Orders/Orders";
import { Users } from "./Users/Users";
import { Link } from "react-router-dom";
import { Income } from "./Income/Income";
import { Outcome } from "./Outcome/Outcome";
import { Statistics } from "./Statistics/Statistics";
import Config from "./Config/Config";
import { SuperAdmin } from "./SuperAdmin/SuperAdmin";

const { Header, Footer } = Layout;

export class Main extends Component {
  componentDidMount() {
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

  logout = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  render() {
    return (
      <div>
        <Layout>
          <Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
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
                )}`
              ]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="/orders">
                <Link to="/orders/orderlist">Заказы</Link>
              </Menu.Item>
              <Menu.Item key="/income">
                <Link to="/income">Входящие</Link>
              </Menu.Item>
              <Menu.Item key="/outcome">
                <Link to="/outcome">Исходящие</Link>
              </Menu.Item>
              <Menu.Item key="/users">
                <Link to="/users">Пользователи</Link>
              </Menu.Item>
              <Menu.Item key="/statistics">
                <Link to="/statistics">Статистика</Link>
              </Menu.Item>
              <Menu.Item key="/config">
                <Link to="/config">Конфигурации</Link>
              </Menu.Item>
              <Menu.Item key="/root">
                <Link to="/root">Super Админ</Link>
              </Menu.Item>
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
            <Route path="/config" component={Config} />
            <Route path="/root" component={SuperAdmin} />
          </Switch>
          <Footer style={{ textAlign: "center" }}>
            I-master.kz ©2020 Created by DY Target
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default Main;
