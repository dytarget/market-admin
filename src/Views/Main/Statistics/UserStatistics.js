import React, { Component } from "react";
import { Table, Select, Button, Avatar, Spin } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";
import getUserDuration from "../../../utils/getUserDuration";
import { Link } from "react-router-dom";
import getMasterStatus from "../../../utils/getMasterStatus";
import config from "../../../config/config";

const { Option } = Select;

export class UserStatistics extends Component {
  state = {
    userReportElements: "",
    orderReportElements: "",
    communicationReportElements: [],
    activityReportElements: "",
    selectedValue: "customers",
    customers: [],
    masters: [],
    markets: [],
  };
  componentDidMount() {
    const today = moment().format("YYYY-MM-DD");
    const last = config.lastDefault;
    this.refresh(last, today);
  }

  refresh = (from, to) => {
    Axios.get(`${config.url}api/v1/admin/report/users?from=${from}&to=${to}`, {
      headers: {},
    }).then((res) =>
      this.setState({
        userReportElements: res.data,
      })
    );

    Axios.get(`${config.url}api/v1/user`).then((res) => {
      const result = res.data.users.filter(
        (user) => user.username.length === 10
      );

      this.setState({ spinning: false, customers: result });
    });

    Axios.get(`${config.url}api/v1/user/masters`).then((res) => {
      this.setState({
        masters: res.data.users,
      });
    });

    Axios.get(`${config.url}api/v1/market`).then((res) => {
      this.setState({ markets: res.data.markets });
    });
  };

  handleChange = (selectedValue) => {
    console.log(selectedValue);
    this.setState({ selectedValue });
  };

  generateExcel = () => {
    window.open(
      `${config.urlNode}statistic_excel_file/${this.state.selectedValue}`
    );
  };

  render() {
    const { userReportElements } = this.state;

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

    const columns = {
      customers: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Аватар",
          dataIndex: "avatar",
          key: "avatar",
          render: (avatar) => (
            <Avatar
              src={
                avatar
                  ? `${config.images}${avatar.imageName}`
                  : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              }
            />
          ),
        },
        {
          title: "ФИО",
          dataIndex: "firstName",
          key: "firstName",
          render: (firstName, data) => (
            <Link to={`/users/clients/${data.username}`}>
              <span>
                {firstName} {data.lastName}
              </span>
            </Link>
          ),
        },
        {
          title: "Заказы",
          dataIndex: "userOrderCount",
          key: "userOrderCount",
        },
        {
          title: "Номер телефона",
          dataIndex: "username",
          key: "username",
          render: (username) => {
            const usernameMatch = username.match(
              /^(\d{3})(\d{3})(\d{2})(\d{2})$/
            );
            const phoneNumber =
              "(" +
              usernameMatch[1] +
              ") " +
              usernameMatch[2] +
              "-" +
              usernameMatch[3] +
              "-" +
              usernameMatch[4];

            return <span>8-{phoneNumber}</span>;
          },
        },
        {
          title: "Пол",
          dataIndex: "sex",
          key: "sex",
          render: (sex) => <span>{sex === "M" ? "Мужской" : "Женский"}</span>,
        },
        {
          title: "На портале",
          dataIndex: "created",
          key: "created",
          render: (created) => <span>{getUserDuration(created)}</span>,
        },
      ],
      masters: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Аватар",
          dataIndex: "avatar",
          key: "avatar",
          render: (avatar) => (
            <Avatar
              src={
                avatar
                  ? `${config.images}${avatar.imageName}`
                  : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              }
            />
          ),
        },
        {
          title: "ФИО",
          dataIndex: "firstName",
          key: "firstName",
          render: (firstName, data) => (
            <Link to={`/users/masters/${data.username}`}>
              <span>
                {firstName} {data.lastName}
              </span>
            </Link>
          ),
        },
        {
          title: "Город",
          dataIndex: "city",
          key: "city",
          render: (city) => <span>{city.cityName}</span>,
        },
        {
          title: "Завершенные заказы",
          dataIndex: "masterOrderCount",
          key: "masterOrderCount",
          width: 130,
        },
        {
          title: "Специализации",
          dataIndex: "specializations",
          key: "specializations",
          render: (specializations) => (
            <div>
              {
                specializations && specializations.length
                // map(({ specName }) => (
                // <p style={{ margin: 0 }}>{specName}</p>
                // ))
              }
            </div>
          ),
        },
        {
          title: "Номер телефона",
          dataIndex: "username",
          key: "username",
          render: (username) => {
            const usernameMatch = username.match(
              /^(\d{3})(\d{3})(\d{2})(\d{2})$/
            );
            const phoneNumber =
              "(" +
              usernameMatch[1] +
              ") " +
              usernameMatch[2] +
              "-" +
              usernameMatch[3] +
              "-" +
              usernameMatch[4];

            return <span>8-{phoneNumber}</span>;
          },
        },
        {
          title: "Пол",
          dataIndex: "sex",
          key: "sex",
          render: (sex) => <span>{sex === "M" ? "Мужской" : "Женский"}</span>,
        },
        {
          title: "Статус",
          dataIndex: "status",
          key: "status",
          render: (status) => <span>{getMasterStatus(status)}</span>,
        },
        {
          title: "Рейтинг",
          dataIndex: "rating",
          key: "rating",
        },
      ],
      markets: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Логотип",
          dataIndex: "logo",
          key: "logo",
          render: (logo) => (
            <Avatar
              src={
                logo
                  ? `${config.images}${logo.imageName}`
                  : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              }
            />
          ),
        },
        {
          title: "Название",
          dataIndex: "marketName",
          key: "marketName",
          render: (marketName, data) => (
            <Link to={`/users/markets/${data.id}`}>
              <span>{marketName}</span>
            </Link>
          ),
        },
        {
          title: "Специализация",
          dataIndex: "specializations",
          key: "specializations",
          render: (specializations) => (
            <span>{specializations.map((elem) => `${elem.specName} \n`)}</span>
          ),
          width: 200,
        },

        {
          title: "Отрасль",
          dataIndex: "industry",
          key: "industry",
        },
        {
          title: "Номер телефона",
          dataIndex: "phone",
          key: "phone",
          render: (phone) => {
            return <span>8-{phone}</span>;
          },
        },
        {
          title: "Адрес",
          dataIndex: "address",
          key: "address",
        },
        {
          title: "Тарифный план",
          dataIndex: "subscriptionType",
          key: "subscriptionType",
          render: (subscriptionType) => (
            <span>{subscriptionType === "FULL" ? "FULL" : "Ограниченный"}</span>
          ),
        },
      ],
    };

    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Все пользователи</h3>
          <Table
            size="small"
            columns={[
              {
                title: "Название",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Количество",
                dataIndex: "count",
                key: "count",
              },
            ]}
            dataSource={userData}
            pagination={false}
          />
          <div style={{ height: 50 }} />

          <Select
            defaultValue="customers"
            style={{ width: 250, marginBottom: 20, marginRight: 10 }}
            onChange={this.handleChange}
          >
            <Option value="customers">Заказчики</Option>
            <Option value="masters">Мастера</Option>
            <Option value="markets">Продавцы</Option>
          </Select>
          <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button>
          <Table
            columns={columns[this.state.selectedValue]}
            dataSource={this.state[this.state.selectedValue]}
            scroll={{ x: true }}
            bordered
          />
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(UserStatistics);
