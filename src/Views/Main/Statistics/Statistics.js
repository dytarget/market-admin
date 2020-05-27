import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { Link, Route } from "react-router-dom";
import { UserStatistics } from "./UserStatistics";
import { RespondsStatistics } from "./RespondsStatistics";
import { UserActivityStatistics } from "./UserActivityStatistics";
import { FinanceStatistics } from "./FinanceStatistics";

const { Content, Sider } = Layout;

export class Statistics extends Component {
  state = {
    userReportElements: "",
    orderReportElements: "",
    communicationReportElements: [],
    activityReportElements: "",
  };
  componentDidMount() {
    const today = moment().format("YYYY-MM-DD");
    const last = "2020-01-01";
    console.log(today);

    this.refresh(last, today);
  }

  refresh = (from, to) => {
    // Axios.get(`${url}api/v1/admin/report/activity?from=${from}&to=${to}`, {
    //   headers: {},
    // }).then((res) => {
    //   const data = res.data.activityReportElements.filter(
    //     (item) => item.fullName !== "nullnull"
    //   );
    //   this.setState({
    //     activityReportElements: data,
    //   });
    // });
    // Axios.get(`${url}api/v1/admin/report/communication?from=${from}&to=${to}`, {
    //   headers: {},
    // }).then((res) =>
    //   this.setState({
    //     communicationReportElements: res.data,
    //   })
    // );
    // Axios.get(`${url}api/v1/admin/report/orders?from=${from}&to=${to}`, {
    //   headers: {},
    // }).then((res) =>
    //   this.setState({
    //     orderReportElements: res.data,
    //   })
    // );
    // Axios.get(`${url}api/v1/admin/report/users?from=${from}&to=${to}`, {
    //   headers: {},
    // }).then((res) =>
    //   this.setState({
    //     userReportElements: res.data,
    //   })
    // );
  };

  render() {
    const {
      userReportElements,
      orderReportElements,
      communicationReportElements,
      activityReportElements,
    } = this.state;

    console.log(userReportElements);
    console.log(orderReportElements);
    console.log(communicationReportElements);
    console.log(activityReportElements);

    const userData = [];

    if (userReportElements !== "") {
      userData.push({
        name: "Количество Заказчиков",
        count: userReportElements.customerCount,
      });
      userData.push({
        name: "Количество Индивидуальных Мастеров",
        count: userReportElements.individualMasterCount,
      });
      userData.push({
        name: "Количество Мастеров Компания",
        count: userReportElements.companyMasterCount,
      });
      userData.push({
        name: "Количество Маркетов",
        count: userReportElements.marketCount,
      });
      userData.push({
        name: "Количество Юзеров",
        count: userReportElements.userCount,
      });
    }

    const orderData = [];

    if (orderReportElements !== "") {
      orderData.push({
        name: "Количество Отмененных Заказов",
        count: orderReportElements.cancelledOrderCount,
      });
      orderData.push({
        name: "Количество Завершенных Заказов",
        count: orderReportElements.completedOrdersCount,
      });
      orderData.push({
        name: "Количество Заказов в Работе",
        count: orderReportElements.inProgressOrderCount,
      });
      orderData.push({
        name: "Количество Открытых Заказов",
        count: orderReportElements.openOrderCount,
      });
      orderData.push({
        name: "Количество Заказов",
        count: orderReportElements.orderCount,
      });
    }

    const commData = [];

    if (communicationReportElements !== "") {
      commData.push({
        name: "Количество Звонков",
        count: communicationReportElements.callCount,
      });
      commData.push({
        name: "Количество Сообщении",
        count: communicationReportElements.messageCount,
      });
    }

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
                <Menu.Item key="/statistics/faq-question">
                  <Link to="/statistics/faq-question">Обращения</Link>
                </Menu.Item>
                <Menu.Item key="/statistics/from-where">
                  <Link to="/statistics/from-where">Откуда Вы узнали</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link>Менеджеры</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Route path="/statistics/users" component={UserStatistics} />
              <Route
                path="/statistics/responds"
                component={RespondsStatistics}
              />
              <Route
                path="/statistics/activity"
                component={UserActivityStatistics}
              />
              <Route path="/statistics/finance" component={FinanceStatistics} />
            </Content>
          </Layout>
        </Content>
      </div>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(Statistics);
