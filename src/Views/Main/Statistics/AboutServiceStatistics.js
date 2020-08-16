import React, { Component } from "react";
import { Table, Button, Spin, DatePicker, ConfigProvider } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";
import locale from "antd/es/locale/ru_RU";
import "moment/locale/ru";
import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

const { url, lastDefault, urlNode } = config;

const columns = [
  {
    title: "Названия",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Количество",
    key: "count",
    dataIndex: "count",
  },
];

export class AboutServiceStatistics extends Component {
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
      `${url}api/v1/admin/report/about-service?from=${from}&to=${to}${generateCitiesId(
        false
      )}`
    ).then((res) => {
      console.log("refreshed");

      const result = [];
      Object.keys(res.data).forEach((obj) => {
        result.push({ name: obj, count: res.data[obj] });
      });
      this.setState({
        transactionStatistics: result,
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/from_where?from=${this.state.from}&to=${
        this.state.to
      }&citiesQuery=${encodeURIComponent(generateCitiesId(false))}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Откуда Вы узнали</h3>
          <ConfigProvider locale={locale}>
            <DatePicker.RangePicker
              style={{ marginRight: 10 }}
              locale={locale}
              defaultValue={[
                moment(this.state.from, "YYYY-MM-DD"),
                moment(this.state.to, "YYYY-MM-DD"),
              ]}
              onChange={(value) => {
                this.setState(
                  {
                    from: value[0].format("YYYY-MM-DD"),
                    to: value[1].format("YYYY-MM-DD"),
                  },
                  () => this.refresh()
                );
              }}
            />
          </ConfigProvider>
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
)(AboutServiceStatistics);
