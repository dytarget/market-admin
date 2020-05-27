import React from "react";
import { Table } from "antd";

export const PromosTable = ({ promos = [] }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Создано",
      dataIndex: "created",
      key: "created",
      render: (created) => (
        <span>
          {created[2]}-{created[1]}-{created[0]}
        </span>
      ),
    },
    {
      title: "Баннер",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          width={230}
          height={150}
          src={
            image
              ? `http://91.201.214.201:8443/images/${image.imageName}`
              : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Для кого",
      dataIndex: "displayType",
      key: "displayType",
      render: (displayType) => {
        const data = {
          CUSTOMER: "Заказчик",
          MASTER: "Мастер",
        };
        return <span>{data[displayType]}</span>;
      },
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const data = {
          MARKET: "Маркет",
          ORDER: "Лента",
        };
        return <span>{data[type]}</span>;
      },
    },
    {
      title: "Просмотры",
      dataIndex: "viewCount",
      key: "viewCount",
    },
    {
      title: "Расход за рекламу",
      dataIndex: "gg",
      key: "gg",
    },
  ];

  return (
    <div>
      <Table
        bordered
        columns={columns}
        dataSource={promos}
        scroll={{ x: true }}
      />
    </div>
  );
};
