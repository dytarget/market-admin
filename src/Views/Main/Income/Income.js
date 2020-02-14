import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import UserReview from "./UserReviews";

const { Content, Sider } = Layout;

export class Income extends Component {
  componentDidMount() {
    if (window.location.pathname === "/income") {
      this.props.history.push("/income/promos");
    }
  }

  render() {
    return (
      <div>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Входящие</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="1">
                  <Link to="/incom/promos">Обращения</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/income/promos" exact component={UserReview} />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Income);
