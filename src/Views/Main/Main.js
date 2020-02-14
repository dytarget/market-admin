import React, { Component } from "react";
import { Layout, Menu } from "antd";
import { Route, Switch } from "react-router";
import { Orders } from "./Orders/Orders";
import { Users } from "./Users/Users";
import { Link } from "react-router-dom";
import { Income } from "./Income/Income";
import { Outcome } from "./Outcome/Outcome";
import { Statistics } from "./Statistics/Statistics";
import Config from "./Config/Config";

const { Header, Footer } = Layout;

export class Main extends Component {
  componentDidMount() {
    if (window.location.pathname === "/") {
      this.props.history.push("/orders");
    }
  }
  render() {
    return (
      <div>
        <Layout>
          <Header className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key="1">
                <Link to="/orders">Заказы</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/income">Входящие</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/outcome">Исходящие</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/users">Пользователи</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/statistics">Статистика</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/config">Конфигураций</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/root">Супер-Админ</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Switch>
            <Route path="/orders" component={Orders} />
            <Route path="/users" component={Users} />
            <Route path="/income" component={Income} />
            <Route path="/outcome" component={Outcome} />
            <Route path="/statistics" component={Statistics} />
            <Route path="/config" component={Config} />
            <Route path="/root" component={Config} />
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
