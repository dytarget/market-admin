import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon, Spin } from "antd";
import { connect } from "react-redux";
import ClientsTable from "./ClientsTable";
import { Link, Route, Switch } from "react-router-dom";
import MastersTable from "./MastersTable";
import MasterProfile from "./MasterProfile";
import ClientsProfile from "./ClientsProfile";
import MarketTable from "./MarketList";
import MarketProfile from "./MarketProfile";
import Axios from "axios";
import config from "../../../config/config";
import moment from "moment";

const { Content, Sider } = Layout;

class Users extends Component {
  state = {
    statisticsInfo: {},
  };
  componentDidMount() {
    if (window.location.pathname === "/users") {
      this.props.history.push("/users/clients");
    }
    const today = moment().format("YYYY-MM-DD");
    console.log(
      `${config.url}api/v1/admin/report/users?from=${config.lastDefault}&to=${today}`
    );
    const user = this.props.userReducer.user;

    if (user && user.userRights && user.userRights.canLookUser === true) {
      Axios.get(
        `${config.url}api/v1/admin/report/users?from=${config.lastDefault}&to=${today}`
      ).then((res) => this.setState({ statisticsInfo: res.data }));
    }
  }

  render() {
    const { statisticsInfo } = this.state;
    const user = this.props.userReducer.user;
    const canLookUser =
      user && user.userRights && user.userRights.canLookUser === true;
    const canEditUser =
      user && user.userRights && user.userRights.canEditUser === true;
    const canDeleteUser =
      user && user.userRights && user.userRights.canDeleteUser === true;

    return (
      <div>
        <Content className="content">
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Пользователи</Breadcrumb.Item>
          </Breadcrumb>
          <Layout
            style={{ padding: "24px 0", background: "#fff" }}
            className="layout"
          >
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[`${window.location.pathname}`]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="/users/clients">
                  <Link to="/users/clients">
                    Заказчики
                    {/* {statisticsInfo.customerCount} */}
                  </Link>
                </Menu.Item>
                <Menu.Item key="/users/masters">
                  <Link to="/users/masters">
                    Мастера{" "}
                    {/* {Number.isNaN(
                      statisticsInfo.individualMasterCount +
                        statisticsInfo.companyMasterCount
                    )
                      ? ""
                      : statisticsInfo.individualMasterCount +
                        statisticsInfo.companyMasterCount} */}
                  </Link>
                </Menu.Item>
                <Menu.Item key="/users/markets">
                  <Link to="/users/markets">
                    Продавцы
                    {/* {statisticsInfo.marketCount} */}
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            {canLookUser && (
              <Switch>
                <Route
                  path="/users/clients"
                  exact
                  component={(props) => (
                    <ClientsTable
                      {...props}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
                <Route
                  path="/users/clients/:username"
                  exact
                  component={(props) => (
                    <ClientsProfile
                      {...props}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
                <Route
                  path="/users/masters"
                  exact
                  component={(props) => (
                    <MastersTable
                      {...props}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
                <Route
                  path="/users/masters/:username"
                  exact
                  component={(props) => (
                    <MasterProfile
                      {...props}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
                <Route
                  path="/users/markets"
                  exact
                  component={(props) => (
                    <MarketTable
                      {...props}
                      managerId={user.id}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
                <Route
                  path="/users/markets/:id"
                  exact
                  component={(props) => (
                    <MarketProfile
                      {...props}
                      canEditUser={canEditUser}
                      canDeleteUser={canDeleteUser}
                    />
                  )}
                />
              </Switch>
            )}
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Users);
