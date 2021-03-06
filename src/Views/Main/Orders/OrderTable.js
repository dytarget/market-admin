import React, { useState } from "react";
import { Icon, Table, Button, Layout, Pagination } from "antd";

import { SearchComponent } from "./components/SearchComponent";
import columns from "./columns";

const { Content } = Layout;

export const OrderTable = ({
  dataSource,
  refresh,
  changePage,
  refreshSearch,
}) => {
  const [currentPage, setCurrentPage] = useState(dataSource.number + 1);
  const [data, setData] = useState(
    dataSource.content ? dataSource.content : dataSource
  );

  const paginationChange = (page) => {
    console.log(page);
    changePage(page);
  };

  return (
    <Content style={{ minHeight: 280, maxWidth: "95%" }}>
      <div style={{ paddingLeft: 24 }} className="order-table-top">
        <Button.Group>
          <Button onClick={refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
        </Button.Group>

        <SearchComponent search={refreshSearch} />

        <h2 style={{ textAlign: "center" }}>Список заказов</h2>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: true }}
      />
      <Pagination
        style={{ marginLeft: "55%", marginTop: 20 }}
        current={currentPage}
        onChange={paginationChange}
        total={dataSource.totalElements}
      />
    </Content>
  );
};
