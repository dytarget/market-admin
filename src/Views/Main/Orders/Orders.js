import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon, Spin } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { Switch, Route, Link } from "react-router-dom";
import { OrderTable } from "./OrderTable";
import OrderSingle from "./OrderSingle";
import config from "../../../config/config";

const { Content, Sider } = Layout;
const allStatus = [
  "MODERATION",
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "WAITING_FOR_CUSTOMER_RESPONSE",
  "CANCELLED",
];

class Orders extends Component {
  constructor(props) {
    super(props);
    console.log("PROPS", props);

    this.state = {
      orders: [],
      spinning: false,
      page: 0,
      status: allStatus,
      searchText: "",
      searchType: "DESCRIPTION",
      key: "1",
    };
  }

  componentDidMount() {
    this.refresh(allStatus);
  }

  refresh = (status) => {
    const user = this.props.userReducer.user;

    if (user && user.userRights && user.userRights.canLookOrder === true) {
      this.setState({ spinning: true });

      let cities = "";

      if (
        !this.props.userReducer.user.isSuperAdmin &&
        this.props.userReducer.user.cities
      ) {
        this.props.userReducer.user.cities.forEach((city) => {
          cities += `city=${city}&`;
        });

        cities = "&" + cities.substring(0, cities.lastIndexOf("&"));
      }

      let statuses = "";
      status.map((item) => (statuses += `status=${item}&`));
      axios
        .get(
          `${config.url}api/v1/order?mode=ALL&${statuses.substring(
            0,
            statuses.lastIndexOf("&")
          )}&orderBy=CREATED&direction=DESC&page=${this.state.page}${cities}`
        )
        .then((res) => {
          this.setState({ spinning: false, orders: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  refreshSearch = (type, text) => {
    const user = this.props.userReducer.user;
    if (user && user.userRights && user.userRights.canLookOrder === true) {
      this.setState({ spinning: true, key: "1", status: allStatus });
      axios
        .get(`${config.url}api/v1/order/search?param=${type}&q=${text}`)
        .then((res) => {
          console.log(
            `${config.url}api/v1/order/search?param=${type}&q=${text}`,
            res.data
          );
          this.setState({ spinning: false, orders: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onKeyChange = ({ key }) => {
    console.log(key);

    this.props.history.push("/orders/orderlist");
    this.setState({ page: 0, key });

    if (key === "1") {
      this.refresh(allStatus);
      this.setState({ status: allStatus });
    } else if (key === "2") {
      this.refresh(["MODERATION"]);
      this.setState({ status: ["MODERATION"] });
    } else if (key === "3") {
      this.refresh(["OPEN"]);
      this.setState({ status: ["OPEN"] });
    } else if (key === "4") {
      this.refresh(["IN_PROGRESS", "WAITING_FOR_CUSTOMER_RESPONSE"]);
      this.setState({
        status: ["IN_PROGRESS", "WAITING_FOR_CUSTOMER_RESPONSE"],
      });
    } else if (key === "5") {
      this.refresh(["CANCELLED", "COMPLETED"]);
      this.setState({ status: ["CANCELLED", "COMPLETED"] });
    }
  };

  changePage = (page) => {
    this.setState({ page: page - 1 }, () => {
      this.refresh(this.state.status);
    });
  };

  render() {
    console.log("USSEERR", this.props);

    return (
      <Content style={{ padding: "0 50px", boxSizing: "border-box" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Заказы</Breadcrumb.Item>
          <Breadcrumb.Item>Все Заказы</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{ padding: "24px 0", background: "#fff" }}
          className="layout"
        >
          <Sider className="sider" style={{ background: "#fff" }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              selectedKeys={[this.state.key]}
              defaultOpenKeys={["sub1"]}
              onSelect={this.onKeyChange}
              style={{ height: "100%" }}
            >
              <Menu.Item key="1">
                <Link to="/orders/orderlist">Все заказы</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/orders/orderlist">На модерации</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/orders/orderlist">Открытые</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/orders/orderlist">В работе</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/orders/orderlist">Завершенные</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Spin spinning={this.state.spinning} tip="Подождите...">
            <Switch>
              <Route
                path="/orders/orderlist"
                exact
                component={() => (
                  <OrderTable
                    dataSource={this.state.orders}
                    refresh={() => this.refresh(this.state.status)}
                    refreshSearch={this.refreshSearch}
                    changePage={this.changePage}
                  />
                )}
              />
              <Route
                path="/orders/orderlist/:id"
                exact
                component={(props) => {
                  return <OrderSingle {...props} />;
                }}
              />
            </Switch>
          </Spin>
        </Layout>
      </Content>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Orders);
