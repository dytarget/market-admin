import React, { Component } from "react";
import { Table, Button, Spin, Select } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";

import config from "../../../config/config";

const { Option } = Select;

const { url, lastDefault, urlNode, images } = config;

const columns = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "Аватар",
    key: "avatar",
    dataIndex: "avatar",
    render: (avatar) => (
      <img
        style={{ width: 96, height: 96 }}
        src={avatar ? `${images}${avatar.imageName}` : config.defaultAvatar}
        alt="avatar"
      />
    ),
  },
  {
    title: "ФИО",
    key: "fullName",
    dataIndex: "fullName",
  },
  {
    title: "Количество активных дней",
    key: "activityDays",
    dataIndex: "activityDays",
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
];

export class UserActivityStatistics extends Component {
  state = {
    activityStatistics: [],
    spinning: true,
    type: "CUSTOMER",
    from: lastDefault,
    to: moment().format("YYYY-MM-DD"),
  };
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    const { from, to, type } = this.state;
    Axios.get(
      `${url}api/v1/admin/report/activity/days?from=${from}&to=${to}&type=${type}`
    ).then((res) => {
      console.log(res.data);

      this.setState({
        activityStatistics: res.data.elements,
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(`${urlNode}statistic_excel_file/responds_file`);
  };

  handleChange = (value) => {
    this.setState({ type: value }, () => this.refresh());
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Активность</h3>
          <Select
            value={this.state.type}
            style={{ width: 250, marginBottom: 20, marginRight: 10 }}
            onChange={this.handleChange}
          >
            <Option value="CUSTOMER">Заказчики</Option>
            <Option value="MASTER">Мастера</Option>
          </Select>
          <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button>
          <Table
            columns={columns}
            dataSource={this.state.activityStatistics}
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
)(UserActivityStatistics);
