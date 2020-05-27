import React from "react";
import { Modal, Spin, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import config from "../../../../config/config";
import moment from "moment";

export const ActivateMarket = ({ id, activateModal, modalValue, refresh }) => {
  const [priceId, setPriceId] = useState(null);
  const [prices, setPrices] = useState([]);
  const [managerPrice, setManagerPrice] = useState({});
  const [spinning, setSpinning] = useState(false);

  const activateMarket = () => {
    if (priceId) {
      let price = 0;
      let duration = 0;
      if (priceId === 1) {
        price = prices[1].price;
        duration = 6;
      } else if (priceId === 4) {
        price = prices[0].price;
        duration = 3;
      } else if (priceId === 7) {
        price = prices[2].price;
        duration = 12;
      }

      const body = {
        amount: price,
        marketId: id,
        priceId: managerPrice.id,
        type: "SUBSCRIPTION",
      };

      Axios.post(`${config.url}api/v1/transaction`, body)
        .then((res) => {
          const date = moment().format("YYYY-MM-DD");
          const endDate = moment(date).add(duration, "M").format("YYYY-MM-DD");
          const body = {
            subscriptionBalance: price,
            subscriptionType: "FULL",
            subscriptionStart: date,
            subscriptionEnd: endDate,
          };
          Axios.patch(`${config.url}api/v1/market/${id}`, body)
            .then(() => {
              message.success("Успешно");
              refresh();
              modalValue(false);
            })
            .catch((err) => {
              message.error("Ошибка");
            });
        })
        .catch((err) => {
          message.error("Ошибка");
        });
    } else {
      message.error("Выберите тип");
    }
  };

  useEffect(() => {
    loadPrices();
    return () => {
      setPriceId("");
    };
  }, [id]);

  const loadPrices = async () => {
    setSpinning(true);
    const for6Month = await Axios.get(`${config.url}api/v1/price/1`);
    const for3Month = await Axios.get(`${config.url}api/v1/price/4`);
    const for12Month = await Axios.get(`${config.url}api/v1/price/7`);
    const priceForManagerPercent = await Axios.get(
      `${config.url}api/v1/price/11`
    );
    setManagerPrice(priceForManagerPercent.data);
    const prices = [for3Month.data, for6Month.data, for12Month.data];
    setPrices(prices);
    setSpinning(false);
  };

  return (
    <div>
      <Modal
        title="Оформить подписку"
        visible={activateModal}
        okText="Оформить"
        cancelText="Закрыть"
        closable={false}
        onOk={activateMarket}
        onCancel={() => modalValue(false)}
      >
        <Spin spinning={spinning}>
          <Form>
            <Form.Item label="Выберите тип подписки">
              <Select
                value={priceId}
                onChange={(priceId) => setPriceId(priceId)}
              >
                {prices.map((price) => (
                  <Select.Option value={price.id}>
                    {price.name} = {price.price} {price.unit}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
