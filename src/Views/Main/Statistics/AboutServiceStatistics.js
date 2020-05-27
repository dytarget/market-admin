import React, { Component } from "react";
import { Table, Button, Spin } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";

import config from "../../../config/config";

const { url, lastDefault, urlNode } = config;

const columns = [
  {
    title: "Дата поступления",
    key: "dateTime",
    dataIndex: "dateTime",
  },
  {
    title: "Название Продавца",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Менеджер",
    key: "manager",
    dataIndex: "manager",
    render: (manager) => (
      <span>
        {manager?.firstName} {manager?.lastName}
      </span>
    ),
  },
  {
    title: "Пополнение за подписку",
    key: "subscription",
    dataIndex: "subscription",
  },
  {
    title: "Пополнение за баннера",
    key: "banner",
    dataIndex: "banner",
  },
  {
    title: "Итого",
    key: "sum",
    dataIndex: "sum",
  },
];

export class FinanceStatistics extends Component {
  state = {
    transactionStatistics: [],
    spinning: true,
    from: lastDefault,
    to: moment().format("YYYY-MM-DD"),
  };
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    const { from, to } = this.state;
    Axios.get(
      `${url}api/v1/admin/report/transaction?from=${from}&to=${to}`
    ).then((res) => {
      console.log(res.data);

      this.setState({
        transactionStatistics: res.data.elements,
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(`${urlNode}statistic_excel_file/responds_file`);
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Финансы</h3>
          <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button>
          <Table
            columns={columns}
            dataSource={this.state.transactionStatistics}
            scroll={{ x: true }}
          />
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(FinanceStatistics);
