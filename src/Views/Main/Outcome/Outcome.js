import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import PromosTable from "./PromosTable";
import NewsTable from "./NewsTable";
import Notifications from "./Notifications";

const { Content, Sider } = Layout;

export class Outcome extends Component {
  componentDidMount() {
    if (window.location.pathname === "/outcome") {
      this.props.history.push("/outcome/promos");
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
                  <Link to="/outcome/promos">Реклама</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/outcome/news">Новости</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/outcome/notification">Отправить уведомления</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/outcome/promos" exact component={PromosTable} />
              <Route path="/outcome/news" exact component={NewsTable} />
              <Route path="/outcome/notification" exact component={Notifications} />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Outcome);
