import React, { Component } from "react";
import { Table, Button, Spin, ConfigProvider, DatePicker } from "antd";
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
    from: lastDefault,
    to: moment().format("YYYY-MM-DD"),
  };
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { from, to } = this.state;
    this.setState({ spinning: true });
    Axios.get(
      `${
        config.url
      }api/v1/admin/report/communication?from=${from}&to=${to}${generateCitiesId(
        false
      )}`
    ).then((res) =>
      this.setState({
        respondsStatistics: res.data.reportElements,
        spinning: false,
      })
    );
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/responds?from=${this.state.from}&to=${
        this.state.to
      }&citiesQuery=${encodeURIComponent(generateCitiesId(false))}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Отклики</h3>
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
