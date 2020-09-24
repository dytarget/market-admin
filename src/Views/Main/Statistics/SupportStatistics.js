import React, { Component } from "react";
import { Table, Button, Spin } from "antd";
import { connect } from "react-redux";
import Axios from "axios";
import moment from "moment";

import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

const { url, lastDefault, urlNode } = config;

const columns = [
  {
    title: "Вопрос",
    key: "question",
    dataIndex: "question",
  },
  {
    title: "Жалоба",
    key: "complaint",
    dataIndex: "complaint",
  },
  {
    title: "Предложения",
    key: "suggestion",
    dataIndex: "suggestion",
  },
];

export class SupportStatistics extends Component {
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
    Axios.get(`${config.url}api/v1/support${generateCitiesId(true)}`).then(
      (res) => {
        let question = 0;
        let complaint = 0;
        let suggestion = 0;
        const result = res.data.supportMessages;
        result.forEach((element) => {
          if (element.type === "QUESTION") {
            question++;
          } else if (element.type === "COMPLAINT") {
            complaint++;
          } else if (element.type === "SUGGESTION") {
            suggestion++;
          }
        });
        this.setState({
          transactionStatistics: [
            {
              complaint,
              question,
              suggestion,
            },
          ],
          spinning: false,
        });
      }
    );
  };

  generateExcel = () => {
    window.open(
      `${urlNode}statistic_excel_file/responds_file?citiesQuery=${encodeURIComponent(
        generateCitiesId(true)
      )}`
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinning}>
          <h3 style={{ textAlign: "center" }}>Откуда Вы узнали</h3>
          {/* <Button onClick={this.generateExcel} type="primary">
            Выгрузить в excel
          </Button> */}
          <Table
            columns={columns}
            dataSource={this.state.transactionStatistics}
          />
        </Spin>
      </div>
    );
  }
}

export default connect(
  ({ userReducer }) => ({ userReducer }),
  {}
)(SupportStatistics);
