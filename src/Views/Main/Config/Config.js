import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import Categories from "./Categories";
import Specs from "./Specs";
import Cities from "./Cities";
import Price from "./Price";
import ProductCategories from "./ProductCategories";
import AboutService from "./AboutService";

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
                <Menu.Item key="/config/categories">
                  <Link to="/config/categories">Категории</Link>
                </Menu.Item>
                <Menu.Item key="/config/specs">
                  <Link to="/config/specs">Специализации</Link>
                </Menu.Item>
                <Menu.Item key="/config/cities">
                  <Link to="/config/cities">Города</Link>
                </Menu.Item>
                <Menu.Item key="/config/price">
                  <Link to="/config/price">Цены</Link>
                </Menu.Item>
                <Menu.Item key="/config/product-categories">
                  <Link to="/config/product-categories">
                    Категории Продуктов
                  </Link>
                </Menu.Item>
                <Menu.Item key="/config/about-service">
                  <Link to="/config/about-service">
                    Откуда вы узнали о нашем сервисе
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/config/categories" exact component={Categories} />
              <Route path="/config/specs" exact component={Specs} />
              <Route path="/config/cities" exact component={Cities} />
              <Route path="/config/price" exact component={Price} />
              <Route
                path="/config/product-categories"
                exact
                component={ProductCategories}
              />
              <Route
                path="/config/about-service"
                exact
                component={AboutService}
              />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Config);
