import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import Categories from "./Categories";
import Specs from "./Specs";
import Cities from "./Cities";
import Price from "./Price";

const { Content, Sider } = Layout;

export class Config extends Component {
  componentDidMount() {
    if (window.location.pathname === "/config") {
      this.props.history.push("/config/categories");
    }
  }

  render() {
    return (
      <div>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Конфигурации</Breadcrumb.Item>
          </Breadcrumb>
          <Layout style={{ padding: "24px 0", background: "#fff" }}>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="1">
                  <Link to="/config/categories">Категории</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/config/specs">Специализации</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/config/cities">Города</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/config/price">Цены</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/config/categories" exact component={Categories} />
              <Route path="/config/specs" exact component={Specs} />
              <Route path="/config/cities" exact component={Cities} />
              <Route path="/config/price" exact component={Price} />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Config);
