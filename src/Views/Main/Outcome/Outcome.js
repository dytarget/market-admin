import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import PromosTable from "./PromosTable";
import NewsTable from "./NewsTable";
import Notifications from "./Notifications";
import FAQTheme from "./FAQTheme";
import FAQQuestion from "./FAQQuestion";

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
                defaultSelectedKeys={[`${window.location.pathname}`]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="/outcome/promos">
                  <Link to="/outcome/promos">Реклама</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/news">
                  <Link to="/outcome/news">Новости</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/notification">
                  <Link to="/outcome/notification">Отправить уведомления</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/faq-category">
                  <Link to="/outcome/faq-category">
                    Темы
                  </Link>
                </Menu.Item>
                <Menu.Item key="/outcome/faq-question">
                  <Link to="/outcome/faq-question">Часто задаваемые</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/outcome/promos" exact component={PromosTable} />
              <Route path="/outcome/news" exact component={NewsTable} />
              <Route
                path="/outcome/notification"
                exact
                component={Notifications}
              />
              <Route path="/outcome/faq-category" exact component={FAQTheme} />
              <Route
                path="/outcome/faq-question"
                exact
                component={FAQQuestion}
              />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Outcome);
