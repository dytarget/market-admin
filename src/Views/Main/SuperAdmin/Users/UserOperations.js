import React, { useState, useEffect } from "react";
import ButtonGroup from "antd/lib/button/button-group";
import {
  Button,
  Icon,
  Modal,
  Form,
  Row,
  Col,
  Select,
  Popconfirm,
  message,
  Input,
  Popover,
} from "antd";
import Axios from "axios";
import config from "../../../../config/config";
import createLogs from "../../../../utils/createLogs";

const { Option } = Select;

export const UserOperations = ({ record, refresh }) => {
  const [visible, setVisible] = useState(false);
  const [visibleCity, setVisibleCity] = useState(false);
  const [newLoginVisible, setNewLoginVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState(record.firstName);
  const [lastName, setLastName] = useState(record.lastName);
  const [orderValues, setOrderValues] = useState([]);
  const [incomeValues, setIncomeValues] = useState([]);
  const [outcomeValues, setOutcomeValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [statisticValues, setStatisticValues] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [cityPermissions, setCityPermissions] = useState([]);
  const [cities, setCities] = useState([]);

  const [cityId, setCityId] = useState("");

  useEffect(() => {
    const isSuperAdmin =
      record.roles.filter((e) => e.roleName === "ROLE_SUPER_ADMIN").length > 0;
    setIsSuperAdmin(isSuperAdmin);
    if (isSuperAdmin === false) {
      Axios.get(`${config.url}api/v1/super/permission/${record.id}`).then(
        ({ data }) => {
          setCityPermissions(data);
        }
      );
      Axios.get(`${config.url}api/v1/city/all`).then((res) =>
        setCities(res.data.cities)
      );
    }
    if (record.userRights) {
      const orderArray = [];
      const userArray = [];
      const incomeArray = [];
      const outcomeArray = [];
      const statisticsArray = [];

      Object.keys(record.userRights).forEach((right) => {
        const rightValue = record.userRights[right];
        if (rightValue === true) {
          if (right.includes("Order")) {
            orderArray.push(right);

            setOrderValues(orderArray);
          }
          if (right.includes("Income") && right !== "canDeleteIncome") {
            incomeArray.push(right);
            setIncomeValues(incomeArray);
          }
          if (right.includes("Outcome")) {
            outcomeArray.push(right);
            setOutcomeValues(outcomeArray);
          }
          if (right.includes("User")) {
            userArray.push(right);
            setUserValues(userArray);
          }
          if (right === "canLookStatistics") {
            statisticsArray.push(right);
            setStatisticValues(statisticsArray);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const handleDelete = () => {
    message.warn("Подождите");

    Axios({
      method: "delete",
      url: `${config.url}api/v1/user/${record.id}`,
    })
      .then((res) => {
        message.success("Успешно");
        createLogs(
          `Удалил Менеджерa ${record.firstName} ${record.lastName} ${record.username}`
        );
        refresh();
      })
      .catch(() => {
        message.error("Ошибка");
      });
  };

  const handleUpdate = () => {
    message.warn("Подождите");
    const body = {};

    Axios.put(`${config.url}api/v1/user/${record.username}`, {
      firstName,
      lastName,
    });

    const selectedValues = [
      ...orderValues,
      ...incomeValues,
      ...outcomeValues,
      ...userValues,
      ...statisticValues,
    ];

    const values = [
      "canLookOrder",
      "canDeleteOrder",
      "canEditOrder",
      "canLookIncome",
      "canEditIncome",
      "canLookOutcome",
      "canEditOutcome",
      "canDeleteOutcome",
      "canLookStatistics",
      "canLookUser",
      "canEditUser",
      "canDeleteUser",
    ];

    values.forEach((val) => {
      if (selectedValues.includes(val)) {
        body[val] = true;
      } else {
        body[val] = false;
      }
    });

    Axios({
      method: "patch",
      url: `${config.url}api/v1/user/rights/${record.id}`,
      data: body,
    })
      .then((res) => {
        setVisible(false);
        createLogs(
          `Обновил права Менеджерa ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisible(false);
        message.error("Ошибка");
      });
  };

  const deleteCity = (id) => {
    message.warn("Подождите");
    Axios.delete(`${config.url}api/v1/super/permission/${id}`)
      .then((res) => {
        createLogs(
          `Убрал разрешение на город у Менеджерa ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisibleCity(false);
        message.error("Ошибка");
      });
  };

  const addCity = () => {
    message.warn("Подождите");

    Axios({
      method: "PATCH",
      url: `${config.url}api/v1/super/permission/${record.id}/city/${cityId}`,
    })
      .then((res) => {
        message.success("Успешно");
        createLogs(
          `Добавил разрешение на город Менеджеру ${record.firstName} ${record.lastName} ${record.username}`
        );
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisibleCity(false);
        message.error("Ошибка");
      });
  };

  const setSuperAdmin = () => {
    Axios.patch(`${config.url}api/v1/super/delegate/${record.id}`)
      .then((res) => {
        createLogs(
          `Сделал Менеджерa Super Админом ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisible(false);
        message.error("Ошибка");
      });
  };

  const clearSuperAdmin = () => {
    Axios.patch(`${config.url}api/v1/super/revoke/${record.id}`)
      .then((res) => {
        createLogs(
          `Убрал у Менеджерa статус Super Админа ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisible(false);
        message.error("Ошибка");
      });
  };

  const handleUpdateLogin = () => {
    Axios.patch(`${config.url}api/v1/user/creds/${record.id}`, {
      userName: newLogin,
    })
      .then((res) => {
        createLogs(
          `Обновил логин Менеджера на новый(${newLogin}) ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisible(false);
        message.error("Ошибка");
      });
  };

  const handleUpdatePassword = () => {
    Axios.patch(`${config.url}api/v1/user/creds/${record.id}`, {
      password: newPassword,
    })
      .then((res) => {
        createLogs(
          `Обновил пароль Менеджера ${record.firstName} ${record.lastName} ${record.username}`
        );
        message.success("Успешно");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        setVisible(false);
        message.error("Ошибка");
      });
  };

  return (
    <div>
      <ButtonGroup>
        <Popover title="Логин">
          <Button shape="circle" onClick={() => setNewLoginVisible(true)}>
            <Icon type="idcard" theme="twoTone" />{" "}
          </Button>
        </Popover>

        <Popover title="Пароль">
          <Button shape="circle" onClick={() => setPasswordVisible(true)}>
            <Icon type="lock" theme="twoTone" />
          </Button>
        </Popover>

        {isSuperAdmin || (
          <Popover
            content={
              "Разрешения на города.У Super-Админа есть права на все города"
            }
            title="Города"
          >
            <Button onClick={() => setVisibleCity(true)}>
              <Icon type="gold" theme="twoTone" />
            </Button>
          </Popover>
        )}

        {!isSuperAdmin ? (
          <Popconfirm
            placement="topLeft"
            title="Сделать Super Админом ?"
            onConfirm={setSuperAdmin}
            okText="Да"
            cancelText="Нет"
          >
            <Button shape="circle">
              <Icon type="plus-circle" theme="twoTone" />
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            placement="topLeft"
            title="Убрать статус Super Админа ?"
            onConfirm={clearSuperAdmin}
            okText="Да"
            cancelText="Нет"
          >
            <Button shape="circle">
              <Icon type="minus-circle" theme="twoTone" />
            </Button>
          </Popconfirm>
        )}
        <Button shape="circle" onClick={() => setVisible(true)}>
          <Icon type="edit" theme="twoTone" />
        </Button>
        <Modal
          title="Обновить Логин"
          visible={newLoginVisible}
          onCancel={() => setNewLoginVisible(false)}
          onOk={handleUpdateLogin}
          okText="Изменить"
          cancelText="Отменить"
          closable={false}
        >
          <Form style={{ marginTop: 20 }} layout="vertical" hideRequiredMark>
            <Form.Item label="Логин">
              <Input
                value={newLogin}
                onChange={(e) => setNewLogin(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Обновить Пароль"
          visible={passwordVisible}
          onCancel={() => setPasswordVisible(false)}
          onOk={handleUpdatePassword}
          okText="Изменить"
          cancelText="Отменить"
          closable={false}
        >
          <Form style={{ marginTop: 20 }} layout="vertical" hideRequiredMark>
            <Form.Item label="Пароль">
              <Input
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Изменить Пользователя"
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={handleUpdate}
          okText="Изменить"
          cancelText="Отменить"
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Имя">
                  <Input
                    placeholder="Введите имя пользователя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Фамилия">
                  <Input
                    placeholder="Введите фамилию пользователя"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Права на Заказы">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    defaultValue={orderValues}
                    optionLabelProp="label"
                    onChange={(values) => setOrderValues(values)}
                  >
                    <Option value="canLookOrder" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditOrder" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteOrder" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Права на Входящие">
                  <Select
                    mode="multiple"
                    defaultValue={incomeValues}
                    placeholder="Выберите права"
                    optionLabelProp="label"
                    onChange={(values) => setIncomeValues(values)}
                  >
                    <Option value="canLookIncome" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditIncome" label="Действия">
                      Действия
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Права на Исходящие">
                  <Select
                    mode="multiple"
                    defaultValue={outcomeValues}
                    placeholder="Выберите права"
                    optionLabelProp="label"
                    onChange={(values) => setOutcomeValues(values)}
                  >
                    <Option value="canLookOutcome" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditOutcome" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteOutcome" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Права на Пользователи">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    defaultValue={userValues}
                    optionLabelProp="label"
                    onChange={(values) => setUserValues(values)}
                  >
                    <Option value="canLookUser" label="Просмотр">
                      Просмотр
                    </Option>
                    <Option value="canEditUser" label="Действия">
                      Действия
                    </Option>
                    <Option value="canDeleteUser" label="Удалить">
                      Удалить
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Права на Статистику">
                  <Select
                    mode="multiple"
                    placeholder="Выберите права"
                    defaultValue={statisticValues}
                    optionLabelProp="label"
                    onChange={(values) => setStatisticValues(values)}
                  >
                    <Option value="canLookStatistics" label="Просмотр">
                      Просмотр
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Города"
          visible={visibleCity}
          cancelButtonProps={{
            style: { opacity: 0 },
            disabled: true,
          }}
          okText="Закрыть"
          closable={false}
          onOk={() => setVisibleCity(false)}
        >
          <Form layout="vertical" hideRequiredMark>
            <Form.Item label="Город">
              <Select
                placeholder="Выберите права на Город"
                value={cityId}
                onChange={(cityId) => setCityId(cityId)}
                optionLabelProp="label"
              >
                {cities.map((city) => (
                  <Option value={city.id} label={city.cityName}>
                    {city.cityName}
                  </Option>
                ))}
              </Select>
              {cityId !== "" && (
                <Button style={{ marginTop: 30 }} onClick={addCity}>
                  Добавить разрешения
                </Button>
              )}
              <Form.Item style={{ marginTop: 40 }} label="Разрешения">
                {cityPermissions.map((permission) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <span style={{ minWidth: 250 }}>
                      {permission?.city?.cityName}
                    </span>
                    <Popconfirm
                      placement="topLeft"
                      title="Отозвать разрешения на город ?"
                      onConfirm={() => deleteCity(permission?.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button icon="delete" type="danger" />
                    </Popconfirm>
                  </div>
                ))}
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
        <Popconfirm
          placement="topLeft"
          title="Удалить пользователя?"
          onConfirm={handleDelete}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="danger" shape="circle">
            <Icon type="delete" />
          </Button>
        </Popconfirm>
      </ButtonGroup>
    </div>
  );
};
