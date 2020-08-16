import React, { Component, Fragment } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import PromosTable from "./PromosTable";
import AllPromosTable from "./AllPromosTable";
import NewsTable from "./NewsTable";
import Notifications from "./Notifications";
import FAQTheme from "./FAQTheme";
import FAQQuestion from "./FAQQuestion";
import SidePromos from "./SidePromos";

const { Content, Sider } = Layout;

class Outcome extends Component {
  componentDidMount() {
    if (window.location.pathname === "/outcome") {
      this.props.history.push("/outcome/promos");
    }
  }

  render() {
    const user = this.props.userReducer.user;
    const canLookOutcome =
      user && user.userRights && user.userRights.canLookOutcome === true;
    const canEditOutcome =
      user && user.userRights && user.userRights.canEditOutcome === true;
    const canDeleteOutcome =
      user && user.userRights && user.userRights.canDeleteOutcome === true;

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
                <Menu.Item key="/outcome/all-promos">
                  <Link to="/outcome/all-promos">Все Баннеры</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/promos">
                  <Link to="/outcome/promos">Баннеры в заказах</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/side-promos">
                  <Link to="/outcome/side-promos">Боковой Баннер</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/news">
                  <Link to="/outcome/news">Новости</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/notification">
                  <Link to="/outcome/notification">Отправить уведомления</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/faq-category">
                  <Link to="/outcome/faq-category">Темы вопросов</Link>
                </Menu.Item>
                <Menu.Item key="/outcome/faq-question">
                  <Link to="/outcome/faq-question">
                    Часто задаваемые вопросы
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              {canLookOutcome && (
                <>
                  <Route
                    path="/outcome/promos"
                    exact
                    component={() => (
                      <PromosTable
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                  <Route
                    path="/outcome/side-promos"
                    exact
                    component={() => (
                      <SidePromos
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                  <Route
                    path="/outcome/news"
                    exact
                    component={() => (
                      <NewsTable
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                  {canEditOutcome && (
                    <Route
                      path="/outcome/notification"
                      exact
                      component={() => (
                        <Notifications
                          canEditOutcome={canEditOutcome}
                          canDeleteOutcome={canDeleteOutcome}
                        />
                      )}
                    />
                  )}
                  <Route
                    path="/outcome/faq-category"
                    exact
                    component={() => (
                      <FAQTheme
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                  <Route
                    path="/outcome/faq-question"
                    exact
                    component={() => (
                      <FAQQuestion
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                  <Route
                    path="/outcome/all-promos"
                    exact
                    component={() => (
                      <AllPromosTable
                        canEditOutcome={canEditOutcome}
                        canDeleteOutcome={canDeleteOutcome}
                      />
                    )}
                  />
                </>
              )}
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Outcome);
