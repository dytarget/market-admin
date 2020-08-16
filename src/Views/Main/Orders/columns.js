import React from "react";
import getOrderStatus from "../../../utils/getOrderStatus";
import getOrderPrice from "../../../utils/getOrderPrice";
import getOrderDate from "../../../utils/getOrderDate";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import getCancelReason from "../../../utils/getCancelReason";

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
    render: (text, data) => (
      <Link to={`/orders/orderlist/${data.id}`}>
        <span>{text.substring(0, 20)}</span>
      </Link>
    ),
  },
  {
    title: "Заказчик",
    dataIndex: "customer",
    key: "customer",
    render: (user) => (
      <span>
        {user.firstName} {user.lastName}
      </span>
    ),
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
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    render: (price, data) => (
      <span>{getOrderPrice(data.orderPriceType, price)}</span>
    ),
  },
  {
    title: "Когда приступить",
    dataIndex: "urgency",
    key: "urgency",
    render: (urgency, data) => (
      <span>{getOrderDate(urgency, data.urgencyDate)}</span>
    ),
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

export default columns;
