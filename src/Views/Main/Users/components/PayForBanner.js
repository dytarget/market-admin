import React from "react";
import { Modal, Spin, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import config from "../../../../config/config";
import createLogs from "../../../../utils/createLogs";

export const PayForBanner = ({
  id,
  bannerBalance,
  bannerPayModal,
  modalValue,
  refresh,
}) => {
  const [price, setPrice] = useState();
  const [amount, setAmount] = useState(0);
  const [amountVerify, setAmountVerify] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const activateMarket = () => {
    if (amount && parseInt(amount, 10) > 0) {
      if (amount === amountVerify) {
        const body = {
          amount,
          marketId: id,
          priceId: price.id,
          type: "BANNER",
        };

        Axios.post(`${config.url}api/v1/transaction`, body)
          .then((res) => {
            const body = {
              bannerBalance: parseInt(bannerBalance, 10) + parseInt(amount, 10),
            };
            Axios.patch(`${config.url}api/v1/market/${id}`, body)
              .then(() => {
                createLogs(
                  `Пополнил счет за релкаму Продавца с id ${id} на сумму ${amount}`
                );

                message.success("Успешно");
                refresh();
                setTimeout(() => window.location.reload(), 1000);

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
        message.error("Не совпадают суммы!");
      }
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
            <Form.Item label="Введите сумму еще раз">
              <Input
                value={amountVerify}
                onChange={(e) => setAmountVerify(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
