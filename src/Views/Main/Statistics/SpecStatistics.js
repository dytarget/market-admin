import React, { Component } from "react";
import {
  Table,
  Button,
  Spin,
  ConfigProvider,
  DatePicker,
  Tag,
  Input,
  Icon,
} from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";
import "moment/locale/ru";
import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

const { url, lastDefault, urlNode } = config;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Название",
    dataIndex: "specName",
    key: "specName",
  },
  {
    title: "Категория",
    dataIndex: "category",
    key: "category",
    render: (category) => {
      return <span>{category && category.categoryName}</span>;
    },
  },
  {
    title: "Количество Мастеров",
    dataIndex: "masterCount",
    key: "masterCount",
  },
  {
    title: "Количество Продавцов",
    dataIndex: "marketCount",
    key: "marketCount",
  },
];

export class SpecStatistics extends Component {
  state = {
    specs: [],
    data: [],
    search: "",
    spinning: true,
    from: lastDefault,
    to: moment().format("YYYY-MM-DD"),
  };
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    Axios.get(`${config.url}api/v1/spec${generateCitiesId(true)}`).then(
      (res) => {
        this.setState({
          specs: res.data.specializations.sort((a, b) => b.id - a.id),
          data: res.data.specializations.sort((a, b) => b.id - a.id),
          spinning: false,
        });
      }
    );
  };

  change = (value) => {
    this.setState({ search: value.target.value });
    if (value.target.value === "") {
      this.setState({ data: this.state.specs });
    } else {
      const data = this.state.specs.filter(
        (data) =>
          `${data.specName}`
            .toLowerCase()
            .indexOf(value.target.value.toLowerCase()) !== -1 ||
          `${data.specNameKz}`
            .toLowerCase()
            .indexOf(value.target.value.toLowerCase()) !== -1
      );
      this.setState({ data });
    }
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/specs?citiesQuery=${encodeURIComponent(
        generateCitiesId(true)
      )}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Список специализаций</h3>
          <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button>
          <Input
            style={{ width: 200, marginLeft: 15 }}
            placeholder="Поиск по Названию"
            value={this.state.search}
            onChange={this.change}
            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
          <Table columns={columns} dataSource={this.state.data} size="small" />
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(SpecStatistics);
