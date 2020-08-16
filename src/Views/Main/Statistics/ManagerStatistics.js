import React, { Component } from "react";
import { Table, Button, Spin, ConfigProvider, DatePicker } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";
import locale from "antd/es/locale/ru_RU";
import "moment/locale/ru";

import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

export class ManagerStatistics extends Component {
  state = {
    cashElements: [],
    from: config.lastDefault,
    to: moment().format("YYYY-MM-DD"),
    spinning: true,
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
      }api/v1/admin/report/cash?from=${from}&to=${to}${generateCitiesId(
        false
      )}`,
      {
        headers: {},
      }
    ).then((res) => {
      const result = res.data.elements.map((elem) => {
        const { income } = elem;
        return {
          ...elem,
          ...income,
        };
      });
      this.setState({
        cashElements: result,
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(
      `${config.urlNode}statistic_excel_file/managers?from=${
        this.state.from
      }&to=${this.state.to}&citiesQuery=${encodeURIComponent(
        generateCitiesId(false)
      )}`
    );
  };

  render() {
    const columns = [
      {
        title: "Менеджер",
        dataIndex: "manager",
        key: "manager",
      },
      {
        title: "Привлечение Мастера с документом",
        dataIndex: "Привлечение Мастера с документом",
        key: "Привлечение Мастера с документом",
      },
      {
        title: "Привлечение Мастера без документа",
        dataIndex: "Привлечение Мастера без документа",
        key: "Привлечение Мастера без документа",
      },
      // {
      //   title: "ед. за привлечение Заказчика",
      //   dataIndex: "ед. за привлечение Заказчика",
      //   key: "ед. за привлечение Заказчика",
      // },
      {
        title: "Активность Мастера ед/день",
        dataIndex: "Активность Мастера ед/день",
        key: "Активность Мастера ед/день",
      },
      {
        title: "Вознаграждение за подписку Продавца ",
        dataIndex: "Вознаграждение за подписку Продавца ",
        key: "Вознаграждение за подписку Продавца ",
      },
      {
        title: "Вознаграждение за размещение баннера",
        dataIndex: "Вознаграждение за размещение баннера",
        key: "Вознаграждение за размещение баннера",
      },
      {
        title: "Итого",
        dataIndex: "sum",
        key: "sum",
      },
    ];

    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Менеджеры</h3>
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
            dataSource={this.state.cashElements}
            // scroll={{ x: true }}
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
)(ManagerStatistics);
