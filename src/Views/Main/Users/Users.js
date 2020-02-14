import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import ClientsTable from "./ClientsTable";
import { Link, Route } from "react-router-dom";
import MastersTable from "./MastersTable";
import MasterProfile from "./MasterProfile";
import ClientsProfile from "./ClientsProfile";
import MarketTable from "./MarketList";

const { Content, Sider } = Layout;

export class Users extends Component {
  componentDidMount() {
    if (window.location.pathname === "/users") {
      this.props.history.push("/users/clients");
    }
  }

  render() {
    return (
      <div>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Пользователи</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="1">
                  <Link to="/users/clients">Заказчики</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/users/masters">Мастеры</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/users/markets">Маркеты</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/users/clients" exact component={ClientsTable} />
              <Route
                path="/users/clients/:username"
                exact
                component={ClientsProfile}
              />
              <Route path="/users/masters" exact component={MastersTable} />
              <Route
                path="/users/masters/:username"
                exact
                component={MasterProfile}
              />
              <Route path="/users/markets" exact component={MarketTable} />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Users);
