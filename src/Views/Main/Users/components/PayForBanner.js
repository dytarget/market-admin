import React from "react";
import { Modal, Spin, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import config from "../../../../config/config";

export const PayForBanner = ({
  id,
  bannerBalance,
  bannerPayModal,
  modalValue,
  refresh,
}) => {
  const [price, setPrice] = useState();
  const [amount, setAmount] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const activateMarket = () => {
    if (amount && amount > 0) {
      const body = {
        amount,
        marketId: id,
        priceId: price.id,
        type: "BANNER",
      };

      Axios.post(`${config.url}api/v1/transaction`, body)
        .then((res) => {
          const body = {
            bannerBalance: bannerBalance + amount,
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
      message.error("Укажите сумму");
    }
  };

  useEffect(() => {
    loadPrices();
    return () => {
      setPrice(0);
    };
  }, [id]);

  const loadPrices = async () => {
    setSpinning(true);
    const forManagerPercentage = await Axios.get(`${config.url}api/v1/price/9`);
    setPrice(forManagerPercentage.data);
    setSpinning(false);
  };

  return (
    <div>
      <Modal
        title="Оплатить за баннера"
        visible={bannerPayModal}
        okText="Оплатить"
        cancelText="Закрыть"
        closable={false}
        onOk={activateMarket}
        onCancel={() => modalValue(false)}
      >
        <Spin spinning={spinning}>
          <Form>
            <Form.Item label="Укажите сумму для пополнения">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
