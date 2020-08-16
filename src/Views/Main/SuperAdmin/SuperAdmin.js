import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import AdminSlidingTabs from "./AdminCategory";

const { Content, Sider } = Layout;

export class SuperAdmin extends Component {
  componentDidMount() {
    if (window.location.pathname === "/root") {
      this.props.history.push("/root/main");
    }
  }
  render() {
    return (
      <div>
        <Content>
          <Breadcrumb style={{ margin: "16px 50px" }}>
            <Breadcrumb.Item>Super Админ</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Route path="/root/main" exact component={AdminSlidingTabs} />
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(SuperAdmin);
