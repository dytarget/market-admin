import React, { Component, useEffect } from "react";
import {
  Spin,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  message,
} from "antd";
import Axios from "axios";
import config from "../../../config/config";
import { useState } from "react";
import createLogs from "../../../utils/createLogs";

export default class Price extends Component {
  state = {
    prices: [],
    spinning: false,
    updatingPrice: null,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    Axios.get(`${config.url}api/v1/price`).then(({ data }) => {
      this.setState({ prices: data.sort((a, b) => b.id - a.id) });
    });
  };

  update = (name, price, percentage, unit) => {
    console.log(name, price, percentage);

    const body = { name };

    console.log(price, percentage);

    if (unit.indexOf("%") === -1) {
      body.price = price;
      body.percentage = null;
    } else {
      body.percentage = percentage;
      body.price = null;
    }

    console.log(body);

    Axios.patch(
      `${config.url}api/v1/price/${this.state.updatingPrice.id}`,
      body
    )
      .then((res) => {
        createLogs(`Обновил Цену на ${name}`);

        message.success("Успешно изменён");
        this.setState({ updateModal: false });
        this.refresh();
      })
      .catch((err) => {
        message.error("Ошибка");
        console.log(err);

        this.setState({ updateModal: false });
      });
  };

  render() {
    const columns = [
      {
        title: "Название",
        key: "name",
        dataIndex: "name",
      },
      {
        title: "Значение",
        key: "price",
        dataIndex: "price",
        render: (price, data) => (
          <span>{Number.isInteger(price) ? price : data.percentage}</span>
        ),
      },
      {
        title: "Ед. измерение",
        key: "unit",
        dataIndex: "unit",
      },
      {
        title: "Действия",
        render: (data) => (
          <Button
            onClick={() =>
              this.setState({ updatingPrice: data, updateModal: true })
            }
            icon="edit"
            type="primary"
          />
        ),
      },
    ];
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>Настройка цен</h2>
        <Spin spinning={this.state.spinning}>
          <Table
            columns={columns}
            dataSource={this.state.prices}
            bordered
            scroll={{ y: 500 }}
            pagination={false}
          />
          <UpdateModal
            updateModal={this.state.updateModal}
            updatingPrice={this.state.updatingPrice}
            closeModal={() => this.setState({ updateModal: false })}
            handleOk={this.update}
          />
        </Spin>
      </div>
    );
  }
}

const UpdateModal = ({ updateModal, updatingPrice, closeModal, handleOk }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [percentage, setPercentage] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    console.log(updatingPrice);
    if (updatingPrice) {
      setName(updatingPrice.name);
      setPrice(updatingPrice.price);
      setPercentage(updatingPrice.percentage);
      setUnit(updatingPrice.unit);
      return () => {
        setName("");
        setPercentage("");
        setPrice("");
        setUnit("");
      };
    }
  }, [updateModal, updatingPrice]);

  return (
    <Modal
      visible={updateModal}
      onCancel={closeModal}
      onOk={() => handleOk(name, price, percentage, unit)}
    >
      {updatingPrice && (
        <Form layout="vertical" hideRequiredMark>
          <Form.Item label={`Название`}>
            <Input value={name} type="text" />
          </Form.Item>

          {unit.indexOf("%") === -1 ? (
            <Form.Item label={`Значение ${unit}`}>
              <Input
                value={parseInt(price)}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                type="number"
              />
            </Form.Item>
          ) : (
            <Form.Item label={`Значение ${unit}`}>
              <Input
                value={parseInt(percentage)}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                type="number"
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
};
