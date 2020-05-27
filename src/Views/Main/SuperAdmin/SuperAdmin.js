import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import AdminSlidingTabs from "./AdminCategory";

const { Content, Sider } = Layout;

export class SuperAdmin extends Component {
  render() {
    return (
      <div>
        <Content>
          <Breadcrumb style={{ margin: "16px 50px" }}>
            <Breadcrumb.Item>Super Админ</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <AdminSlidingTabs />
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(SuperAdmin);
