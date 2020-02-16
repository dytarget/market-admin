import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon, Spin } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { store } from "../../../store";
import { Switch, Route } from "react-router-dom";
import { OrderTable } from "./OrderTable";
import OrderSingle from "./OrderSingle";

const { Content, Sider } = Layout;
const allStatus = [
  "MODERATION",
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "WAITING_FOR_CUSTOMER_RESPONSE",
  "CANCELLED"
];

const url = "http://91.201.214.201:8443/";

export class Orders extends Component {
  constructor(props) {
    super(props);
    console.log("PROPS", props);

    this.state = {
      orders: [],
      spinning: false
    };
  }

  componentDidMount() {
    this.refresh(allStatus);
  }

  refresh = status => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    let search = "";
    status.map(item => (search += `status=${item}&`));
    axios
      .get(
        `${url}api/v1/order?mode=ALL&${search.substring(
          0,
          search.lastIndexOf("&")
        )}&orderBy=CREATED&direction=DESC`,
        {
          headers
        }
      )
      .then(res => {
        this.setState({ spinning: false, orders: res.data.orders });
      })
      .catch(err => {
        console.log(err);
      });
  };

  onKeyChange = ({ key }) => {
    console.log(key);

    this.props.history.push("/orders/orderlist");

    if (key === "1") {
      this.refresh(allStatus);
    } else if (key === "2") {
      this.refresh(["MODERATION"]);
    } else if (key === "3") {
      this.refresh(["OPEN"]);
    } else if (key === "4") {
      this.refresh(["IN_PROGRESS", "WAITING_FOR_CUSTOMER_RESPONSE"]);
    } else if (key === "5") {
      this.refresh(["CANCELLED", "COMPLETED"]);
    }
  };

  render() {
    return (
      <div>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Заказы</Breadcrumb.Item>
            <Breadcrumb.Item>Все Заказы</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                onSelect={this.onKeyChange}
                style={{ height: "100%" }}
              >
                <Menu.Item key="1">Все заказы</Menu.Item>
                <Menu.Item key="2">На модерации</Menu.Item>
                <Menu.Item key="3">Открытые</Menu.Item>
                <Menu.Item key="4">В работе</Menu.Item>
                <Menu.Item key="5">Завершенные</Menu.Item>
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
                      refresh={() => this.refresh(allStatus)}
                    />
                  )}
                />
                <Route
                  path="/orders/orderlist/:id"
                  exact
                  component={props => {
                    const order = this.state.orders.find(
                      order => order.id + "" === props.match.params.id
                    );
                    console.log(order);
                    console.log(props.match.params.id);

                    return <OrderSingle {...props} order={order} />;
                  }}
                />
              </Switch>
            </Spin>
          </Layout>
        </Content>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    loggedIn: userReducer.loggedIn,
    token: userReducer.token,
    user: userReducer.user
  };
};

export default connect(mapStateToProps)(Orders);
