import React, { Component } from "react";
import { Table, Button, Spin, Row, Col } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";

import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

const { url, lastDefault, urlNode } = config;

const columns = [
  {
    title: "Вид",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Количество",
    key: "count",
    dataIndex: "count",
  },
];

const cashColumns = [
  {
    title: "за подписку Продавца",
    key: "subscriptionSum",
    dataIndex: "subscriptionSum",
  },
  {
    title: "за размещения баннера",
    key: "bannerSum",
    dataIndex: "bannerSum",
  },
  {
    title: "Итого",
    key: "sum",
    dataIndex: "sum",
  },
];

export class DailyStatistics extends Component {
  state = {
    activeReport: [],
    incomeReport: [],
    orderReport: [],
    createdReport: [],
    spinning: false,
    from: lastDefault,
    to: moment().format("YYYY-MM-DD"),
  };
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    Axios.get(
      `${url}api/v1/admin/report/daily/income${generateCitiesId(true)}`
    ).then((res) => {
      this.setState({
        incomeReport: [res.data],
      });
    });
    Axios.get(
      `${url}api/v1/admin/report/daily/order${generateCitiesId(true)}`
    ).then((res) => {
      this.setState({
        orderReport: [
          {
            name: "все",
            count: res.data.allCount,
          },
          {
            name: "открытые",
            count: res.data.openCount,
          },
          {
            name: "в работе",
            count: res.data.inProgressCount,
          },
          {
            name: "закрытые",
            count: res.data.cancelledCount,
          },
          {
            name: "отменены",
            count: res.data.completedCount,
          },
        ],
      });
    });
    Axios.get(
      `${url}api/v1/admin/report/daily/user/active${generateCitiesId(true)}`
    ).then((res) => {
      this.setState({
        activeReport: [
          {
            name: "Заказчики",
            count: res.data.customerCount,
          },
          {
            name: "Мастера",
            count: res.data.masterCount,
          },
          {
            name: "Продавцы",
            count: res.data.marketCount,
          },
        ],
      });
    });
    Axios.get(
      `${url}api/v1/admin/report/daily/user/created${generateCitiesId(true)}`
    ).then((res) => {
      this.setState({
        createdReport: [
          {
            name: "Заказчики",
            count: res.data.customerCount,
          },
          {
            name: "Мастера",
            count: res.data.masterCount,
          },
          {
            name: "Продавцы",
            count: res.data.marketCount,
          },
        ],
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
          {/* <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button> */}
          <h2 style={{ textAlign: "center" }}>Информер на текущий день</h2>
          <Row gutter={16} style={{ marginTop: 40 }}>
            <Col span={8}>
              <h3 style={{ textAlign: "center" }}>Новые пользователи</h3>
              <Table
                columns={columns}
                dataSource={this.state.createdReport}
                size="small"
              />
            </Col>{" "}
            <Col span={8}>
              <h3 style={{ textAlign: "center" }}>Активные пользователи</h3>
              <Table
                columns={columns}
                dataSource={this.state.activeReport}
                size="small"
              />
            </Col>
            <Col span={8}>
              <h3 style={{ textAlign: "center" }}>Заказы</h3>
              <Table
                columns={columns}
                dataSource={this.state.orderReport}
                size="small"
              />
            </Col>
          </Row>

          <h3 style={{ textAlign: "center" }}>Пополнение средств</h3>
          <Table
            columns={cashColumns}
            dataSource={this.state.incomeReport}
            size="small"
          />
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(DailyStatistics);
