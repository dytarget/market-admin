import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { Link, Route } from "react-router-dom";
import UserStatistics from "./UserStatistics";
import { RespondsStatistics } from "./RespondsStatistics";
import { UserActivityStatistics } from "./UserActivityStatistics";
import { FinanceStatistics } from "./FinanceStatistics";
import { DailyStatistics } from "./DailyStatistics";
import { AboutServiceStatistics } from "./AboutServiceStatistics";
import { SupportStatistics } from "./SupportStatistics";
import { ManagerStatistics } from "./ManagerStatistics";
import { OrderStatistics } from "./OrderStatistics";
import SpecStatistics from "./SpecStatistics";

const { Content, Sider } = Layout;

class Statistics extends Component {
  state = {
    userReportElements: "",
    orderReportElements: "",
    communicationReportElements: [],
    activityReportElements: "",
  };

  componentDidMount() {
    if (window.location.pathname === "/statistics") {
      this.props.history.push("/statistics/daily");
    }
  }

  render() {
    const user = this.props.userReducer.user;
    const canLookStatistics =
      user && user.userRights && user.userRights.canLookStatistics === true;

    return (
      <div>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Статистика</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[`${window.location.pathname}`]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="/statistics/daily">
                  <Link to="/statistics/daily">Текущий день</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/users">
                  <Link to="/statistics/users">Пользователи</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/orders">
                  <Link to="/statistics/orders">Заказы</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/responds">
                  <Link to="/statistics/responds">Отклики</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/activity">
                  <Link to="/statistics/activity">Активность</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/finance">
                  <Link to="/statistics/finance">Финансы</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/support">
                  <Link to="/statistics/support">Обращения</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/from-where">
                  <Link to="/statistics/from-where">Откуда Вы узнали</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/manager">
                  <Link to="/statistics/manager">Менеджеры</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/spec">
                  <Link to="/statistics/spec">Специализация</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              {canLookStatistics && (
                <>
                  <Route
                    exact
                    path="/statistics/daily"
                    component={DailyStatistics}
                  />
                  <Route path="/statistics/users" component={UserStatistics} />
                  <Route
                    path="/statistics/responds"
                    component={RespondsStatistics}
                  />
                  <Route
                    path="/statistics/activity"
                    component={UserActivityStatistics}
                  />
                  <Route
                    path="/statistics/finance"
                    component={FinanceStatistics}
                  />
                  <Route
                    path="/statistics/from-where"
                    component={AboutServiceStatistics}
                  />
                  <Route
                    path="/statistics/support"
                    component={SupportStatistics}
                  />
                  <Route
                    path="/statistics/manager"
                    component={ManagerStatistics}
                  />
                  <Route
                    path="/statistics/orders"
                    component={OrderStatistics}
                  />
                  <Route path="/statistics/spec" component={SpecStatistics} />
                </>
              )}
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Statistics);
