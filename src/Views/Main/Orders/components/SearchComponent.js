import React, { useState } from "react";
import { Select, Input, Icon, Button } from "antd";

export const SearchComponent = ({ search }) => {
  const [searchType, changeSearchType] = useState("DESCRIPTION");
  const [searchText, changeSearchText] = useState("");

  const handleSearch = () => search(searchType, searchText);

  return (
    <div style={{ display: "inline-block" }} className="search-component">
      <Select
        defaultValue={searchType}
        style={{ width: 300, marginLeft: 15 }}
        onChange={changeSearchType}
      >
        <Select.Option value="DESCRIPTION">Поиск по описаниям</Select.Option>
        <Select.Option value="NAME">Поиск по именам Заказчика</Select.Option>
      </Select>

      <Input
        style={{ width: 300, marginLeft: 15 }}
        placeholder="Текст поиска"
        value={searchText}
        onChange={(e) => changeSearchText(e.target.value)}
        prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
      />
      <Button onClick={handleSearch} style={{ marginLeft: 10 }} type="primary">
        <Icon type="search" />
        Поиск
      </Button>
    </div>
  );
};
