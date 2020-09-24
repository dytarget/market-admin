import React, { Component } from "react";
import { Table, Button, Spin, ConfigProvider, DatePicker, Tag } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";
import locale from "antd/es/locale/ru_RU";
import "moment/locale/ru";
import config from "../../../config/config";
import getOrderStatus from "../../../utils/getOrderStatus";
import getOrderPrice from "../../../utils/getOrderPrice";
import getOrderDate from "../../../utils/getOrderDate";
import getCancelReason from "../../../utils/getCancelReason";
import generateCitiesId from "../../../utils/generateCitiesId";

const { url, lastDefault, urlNode } = config;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    fixed: "left",
  },
  {
    title: "Дата создания",
    dataIndex: "created",
    key: "created",
    render: (created) => (
      <span>
        {created[2]}/{created[1]}/{created[0]}
      </span>
    ),
  },
  {
    title: "Описание заказа",
    dataIndex: "description",
    key: "description",
    render: (text, data) => <span>{text.substring(0, 20)}</span>,
  },
  {
    title: "ФИО Заказчика",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "ФИО Мастера",
    dataIndex: "masterName",
    key: "masterName",
  },
  {
    title: "Статус заказа",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={getOrderStatus(status).color}>
        {getOrderStatus(status).text}
      </Tag>
    ),
  },
  {
    title: "Специализация",
    dataIndex: "specialization",
    key: "specialization",
    render: (specialization) => <span>{specialization.specName}</span>,
  },
  //   {
  //     title: "Цена",
  //     dataIndex: "price",
  //     key: "price",
  //     render: (price, data) => (
  //       <span>{getOrderPrice(data.orderPriceType, price)}</span>
  //     ),
  //   },
  //   {
  //     title: "Когда приступить",
  //     dataIndex: "urgency",
  //     key: "urgency",
  //     render: (urgency, data) => (
  //       <span>{getOrderDate(urgency, data.urgencyDate)}</span>
  //     ),
  //   },
  {
    title: "Отклик",
    dataIndex: "respondedMastersCount",
    key: "respondedMastersCount",
  },
  {
    title: "Причина отмены",
    dataIndex: "cancellationReason",
    key: "cancellationReason",
    render: (cancellationReason) => (
      <span>{getCancelReason(cancellationReason)}</span>
    ),
  },
];

export class OrderStatistics extends Component {
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
      }api/v1/admin/report/order?from=${from}&to=${to}${generateCitiesId(
        false
      )}`
    ).then((res) => {
      console.log(res.data);

      this.setState({
        transactionStatistics: res.data.elements.sort((a, b) => b.id - a.id),
        spinning: false,
      });
    });
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/orders?from=${this.state.from}&to=${
        this.state.to
      }&citiesQuery=${encodeURIComponent(generateCitiesId(false))}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Заказы</h3>
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
)(OrderStatistics);
