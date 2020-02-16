import React, { useState } from "react";
import { Icon, Table, Tag, Button, Layout, Pagination } from "antd";
import getOrderStatus from "../../../utils/getOrderStatus";
import getOrderPrice from "../../../utils/getOrderPrice";
import getOrderDate from "../../../utils/getOrderDate";
import { Link } from "react-router-dom";

const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Описание заказа",
    dataIndex: "description",
    key: "description",
    render: (text, data) => (
      <Link to={`/orders/orderlist/${data.id}`}>
        <span>{text.substring(0, 20)}</span>
      </Link>
    )
  },
  {
    title: "Заказчик",
    dataIndex: "customer",
    key: "customer",
    render: user => (
      <span>
        {user.firstName} {user.lastName}, {user.city}
      </span>
    )
  },
  {
    title: "Статус заказа",
    dataIndex: "status",
    key: "status",
    render: status => (
      <Tag color={getOrderStatus(status).color}>
        {getOrderStatus(status).text}
      </Tag>
    )
  },
  {
    title: "Специализация",
    dataIndex: "specialization",
    key: "specialization",
    render: specialization => <span>{specialization.specName}</span>
  },
  {
    title: "Адрес",
    dataIndex: "address",
    key: "address",
    render: address => (
      <span>{address.indexOf("latitude") === -1 ? address : "На карте"}</span>
    )
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    render: (price, data) => (
      <span>{getOrderPrice(data.orderPriceType, price)}</span>
    )
  },
  {
    title: "Дата",
    dataIndex: "urgency",
    key: "urgency",
    render: (urgency, data) => (
      <span>{getOrderDate(urgency, data.urgencyDate)}</span>
    )
  },
  {
    title: "Заказ создан",
    dataIndex: "created",
    key: "created",
    render: created  => <span>{created[2]}/{created[1]}/{created[0]}</span>
  }
];

export const OrderTable = ({ dataSource, refresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Content style={{ padding: "0 24px", minHeight: 280 }}>
      <h2 style={{ textAlign: "center" }}>Список заказов</h2>
      <Button.Group>
        <Button onClick={refresh} type="primary">
          <Icon type="reload" />
          Обновить
        </Button>
      </Button.Group>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={
          <Pagination
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            total={dataSource.length}
          />
        }
      />
    </Content>
  );
};
