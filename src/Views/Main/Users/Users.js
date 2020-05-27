import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import ClientsTable from "./ClientsTable";
import { Link, Route } from "react-router-dom";
import MastersTable from "./MastersTable";
import MasterProfile from "./MasterProfile";
import ClientsProfile from "./ClientsProfile";
import MarketTable from "./MarketList";
import MarketProfile from "./MarketProfile";
import Axios from "axios";
import config from "../../../config/config";
import moment from "moment";

const { Content, Sider } = Layout;

export class Users extends Component {
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

    Axios.get(
      `${config.url}api/v1/admin/report/users?from=${config.lastDefault}&to=${today}`
    ).then((res) => this.setState({ statisticsInfo: res.data }));
  }

  render() {
    const { statisticsInfo } = this.state;
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
                <Menu.Item key="/users/clients">
                  <Link to="/users/clients">
                    Заказчики {statisticsInfo.customerCount}
                  </Link>
                </Menu.Item>
                <Menu.Item key="/users/masters">
                  <Link to="/users/masters">
                    Мастеры{" "}
                    {statisticsInfo.individualMasterCount +
                      statisticsInfo.companyMasterCount}
                  </Link>
                </Menu.Item>
                <Menu.Item key="/users/markets">
                  <Link to="/users/markets">
                    Маркеты {statisticsInfo.marketCount}
                  </Link>
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
              <Route
                path="/users/markets/:id"
                exact
                component={MarketProfile}
              />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Users);
