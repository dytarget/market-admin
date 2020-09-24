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

const groupBy = (arr) => {
  const helper = {};
  const result = arr.reduce(function (r, o) {
    var key = `${o.dateTime[2]}/${o.dateTime[1]}/${o.dateTime[0]}-${o.name}-${
      o.manager?.firstName + " " + o.manager?.lastName
    }`;

    if (!helper[key]) {
      helper[key] = Object.assign({}, o); // create a copy of o
      r.push(helper[key]);
    } else {
      helper[key].subscription += o.subscription;
      helper[key].banner += o.banner;
    }

    return r;
  }, []);
  return result;
};

const columns = [
  {
    title: "Дата поступления",
    key: "dateTime",
    dataIndex: "dateTime",
    render: (created) =>
      created && (
        <span>
          <span>{`${created[2]}/${created[1]}/${created[0]}`}</span>
        </span>
      ),
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
    render: (sum, data) => <span>{data.subscription + data.banner}</span>,
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
      `${
        config.url
      }api/v1/admin/report/transaction?from=${from}&to=${to}${generateCitiesId(
        false
      )}`
    ).then((res) => {
      console.log(res.data);

      this.setState({
        transactionStatistics: groupBy(res.data.elements),
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/finance?from=${this.state.from}&to=${
        this.state.to
      }&citiesQuery=${encodeURIComponent(generateCitiesId(false))}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Финансы</h3>
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
            dataSource={this.state.transactionStatistics?.reverse()}
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
