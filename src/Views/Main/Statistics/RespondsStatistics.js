import React, { Component } from "react";
import { Table, Button, Spin } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";

import config from "../../../config/config";

const { url, lastDefault, urlNode } = config;

const columns = [
  {
    title: "Специализация",
    key: "specialization",
    dataIndex: "specialization",
  },
  {
    title: "Написали",
    key: "messageCount",
    dataIndex: "messageCount",
  },
  {
    title: "Позвонили",
    key: "callCount",
    dataIndex: "callCount",
  },
];

export class RespondsStatistics extends Component {
  state = {
    respondsStatistics: [],
    spinning: true,
  };
  componentDidMount() {
    const today = moment().format("YYYY-MM-DD");
    this.refresh(lastDefault, today);
  }

  refresh = (from, to) => {
    this.setState({ spinning: true });
    Axios.get(
      `${url}api/v1/admin/report/communication?from=${from}&to=${to}`
    ).then((res) =>
      this.setState({
        respondsStatistics: res.data.reportElements,
        spinning: false,
      })
    );
  };

  generateExcel = () => {
    window.open(`${urlNode}statistic_excel_file/responds_file`);
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Отклики</h3>
          <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button>
          <Table
            columns={columns}
            dataSource={this.state.respondsStatistics}
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
)(RespondsStatistics);
