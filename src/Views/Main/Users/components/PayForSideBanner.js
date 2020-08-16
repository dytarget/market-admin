import React from "react";
import { Modal, Spin, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import config from "../../../../config/config";
import createLogs from "../../../../utils/createLogs";

export const PayForSideBanner = ({
  id,
  sideBannerBalance,
  sideBannerPayModal,
  modalValue,
  refresh,
}) => {
  const [price, setPrice] = useState();
  const [amount, setAmount] = useState(0);
  const [amountVerify, setAmountVerify] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const activateMarket = () => {
    if (amount && amount > 0) {
      if (amountVerify === amount) {
        const body = {
          amount,
          marketId: id,
          priceId: price.id,
          type: "SIDE",
        };

        Axios.post(`${config.url}api/v1/transaction`, body)
          .then((res) => {
            const body = {
              sideBannerBalance:
                parseInt(sideBannerBalance, 10) + parseInt(amount, 10),
            };
            Axios.patch(`${config.url}api/v1/market/${id}`, body)
              .then(() => {
                message.success("Успешно");
                createLogs(
                  `Пополнил счет за боковую релкаму Продавца с id ${id} на сумму ${amount}`
                );
                setTimeout(() => window.location.reload(), 1000);

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
        message.error("Суммы не совпадают");
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
        title="Оплатить за боковой баннер"
        visible={sideBannerPayModal}
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
