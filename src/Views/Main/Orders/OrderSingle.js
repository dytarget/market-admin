import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Tag,
  Spin,
  Tabs,
  Button,
  Popconfirm,
  Icon,
  Modal,
  Select,
} from "antd";
import GoogleMap, { Marker } from "react-maps-google";
import axios from "axios";
import getOrderStatus from "../../../utils/getOrderStatus";
import getOrderDate from "../../../utils/getOrderDate";
import getOrderPrice from "../../../utils/getOrderPrice";
import { store } from "../../../store";
import getCommunicationType from "../../../utils/getCommunicationType";
import { UserComponent } from "../components/UserComponent";
import { RespondList } from "../components/RespondList";
import ReactImageGallery from "react-image-gallery";
import sendPushNotification from "../../../utils/sendPushNotification";
import sendPushNotificationToMasters from "../../../utils/sendPushNotificationToMasters";
import { connect } from "react-redux";
import createLogs from "../../../utils/createLogs";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

const url = "http://91.201.214.201:8443/";

class OrderSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "",
      spinning: true,
      updateModal: "",
      specId: "",
      description: "",
      address: "",
      specs: [],
    };
  }
  async componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    this.setState({ spinning: true });
    const res = await axios.get(
      `${url}api/v1/order?mode=SINGLE&order=${this.props.match.params.id}`
    );
    this.setState({ spinning: false, order: res.data.content[0] });
    axios
      .get(`${url}api/v1/spec`)
      .then((res) => this.setState({ specs: res.data.specializations }));
  };

  updateOrder = () => {
    this.setState({ spinning: true, updateModal: false });

    axios
      .patch(`${url}api/v1/order/${this.state.order.id}`, {
        specialization: this.state.specId,
        address: this.state.address,
        description: this.state.description,
      })
      .then((res) => {
        createLogs(`Обновил данные Заказ ID=${res.data.id}`);

        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateOrderStatus = (status) => {
    this.setState({ spinning: true });

    axios
      .patch(
        `${url}api/v1/order/${this.state.order.id}`,
        { status },
        {
          headers: {},
        }
      )
      .then((res) => {
        createLogs(
          `Обновил Статус Заказа на "${getOrderStatus(status).text}" ID=${
            res.data.id
          }`
        );

        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendNotsToMaster = () => {
    const { order } = this.state;
    axios
      .get(`${url}api/v1/user/masters/${order.specialization.id}`)
      .then((res) => {
        let arr = [];
        res.data.users.forEach((user) => {
          if (user.city.id === order.city.id) {
            arr.push(user.id);
          }
        });

        if (arr.length > 0) {
          sendPushNotificationToMasters(
            `Заказ №${order.id} «${order.description.substring(0, 20)}${
              order.description.length > 20 ? `...` : ``
            }»`,
            `Тапсырыс №${order.id} «${order.description.substring(0, 20)}${
              order.description.length > 20 ? `...` : ``
            }»`,
            "Новый заказ",
            "Жаңа тапсырыс",
            arr,
            "MasterListOrders",
            order.id,
            "master",
            "bells"
          );
        }
      });
  };

  render() {
    const { order, spinning } = this.state;
    const user = this.props.userReducer.user;
    const canEditOrder =
      user && user.userRights && user.userRights.canEditOrder === true;
    const canDeleteOrder =
      user && user.userRights && user.userRights.canDeleteOrder === true;
    console.log(order);

    const images = [];
    order &&
      order.images &&
      order.images.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`,
        };
        images.push(obj);
      });
    return (
      <Content
        style={{ padding: "0 24px", minHeight: 500 }}
        className="content"
      >
        <h2 style={{ textAlign: "center" }}>Карточка заказа</h2>
        <Modal
          title="Обновить заказ"
          visible={this.state.updateModal}
          okText="Обновить"
          cancelText="Закрыть"
          closable={false}
          onOk={this.updateOrder}
          onCancel={() => this.setState({ updateModal: false })}
        >
          <Form>
            <Form.Item label="Специализация">
              <Select
                defaultValue={order?.specialization?.id}
                onChange={(specId) => this.setState({ specId })}
              >
                {this.state.specs.map((spec) => (
                  <Select.Option value={spec.id}>{spec.specName}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Описание">
              <Input
                defaultValue={order.description}
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Адрес">
              <Input
                defaultValue={order.address}
                onChange={(e) =>
                  this.setState({
                    address: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        </Modal>
        {order && (
          <Button.Group style={{ marginBottom: 20 }}>
            {order.status === "MODERATION" && canEditOrder && (
              <Popconfirm
                placement="top"
                onConfirm={() => {
                  this.updateOrderStatus("OPEN");
                  sendPushNotification(
                    `Заказ №${order.id} «${order.description.substring(0, 20)}${
                      order.description.length > 20 ? `...` : ``
                    }»`,
                    `Тапсырыс №${order.id} «${order.description.substring(
                      0,
                      20
                    )}${order.description.length > 20 ? `...` : ``}»`,
                    "Опубликован Ваш",
                    "Тапсырыс жарияланды",
                    order.customer.id,
                    "MyOrder",
                    order.id,
                    "client",
                    "bells"
                  );
                  this.sendNotsToMaster();
                }}
                title={"Опубликовать ?"}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Опубликовать</Button>
              </Popconfirm>
            )}
            {(order.status === "OPEN" || order.status === "MODERATION") &&
              canEditOrder && (
                <Popconfirm
                  placement="top"
                  onConfirm={() => {
                    this.updateOrderStatus("CANCELLED");
                    sendPushNotification(
                      `заказ №${order.id} «${order.description.substring(
                        0,
                        20
                      )}${order.description.length > 20 ? `...` : ``}»`,
                      `тапсырыс №${order.id} «${order.description.substring(
                        0,
                        20
                      )}${order.description.length > 20 ? `...` : ``}»`,
                      `Отменён`,
                      `Жойылды`,
                      order.customer.id,
                      "MyOrderFinished",
                      order.id,
                      "client",
                      "bells"
                    );
                  }}
                  title={"Отменить ?"}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Отменить</Button>
                </Popconfirm>
              )}
            {(order.status === "OPEN" ||
              order.status === "IN_PROGRESS" ||
              order.status === "WAITING_FOR_CUSTOMER_RESPONSE") &&
              canEditOrder && (
                <Popconfirm
                  placement="top"
                  onConfirm={() => {
                    this.updateOrderStatus("COMPLETED");
                    sendPushNotification(
                      `заказ №${order.id} «${order.description.substring(
                        0,
                        20
                      )}${order.description.length > 20 ? `...` : ``}»`,
                      `тапсырыс №${order.id} «${order.description.substring(
                        0,
                        20
                      )}${order.description.length > 20 ? `...` : ``}»`,
                      `Завершён`,
                      "Аяқталды",
                      order.customer.id,
                      "MyOrderFinished",
                      order.id,
                      "client",
                      "bells"
                    );
                  }}
                  title={"Завершить ?"}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Завершить</Button>
                </Popconfirm>
              )}
            <Button
              onClick={() => this.setState({ updateModal: true })}
              type="primary"
            >
              Редактировать
            </Button>
          </Button.Group>
        )}
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Номер заказа">
                      {<Input type="text" value={order.id} />}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Специализация">
                      <Input readOnly value={order.specialization.specName} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Адрес">
                      <Input value={order.address} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Просмотры">
                      <Input value={order.viewCount} />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Статус">
                      <Tag color={getOrderStatus(order.status).color}>
                        {getOrderStatus(order.status).text}
                      </Tag>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Дата">
                      <Input
                        value={getOrderDate(order.urgency, order.urgencyDate)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Цена">
                      <Input
                        value={getOrderPrice(order.orderPriceType, order.price)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Способ связи">
                      <Input
                        value={getCommunicationType(order.communicationType)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Заказ создан">
                      <Input
                        value={`${order.created[2]}.${order.created[1]}.${order.created[0]}`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Описание">
                      <TextArea rows={9} value={order.description} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Заказчик">
                      <UserComponent user={order.customer} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Мастер">
                      {order.master ? (
                        <UserComponent user={order.master} />
                      ) : (
                        <span>Мастера нет</span>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              {order.coordinates && (
                <GoogleMap
                  options={{ width: 400, height: 400 }}
                  apiKey="AIzaSyD1iFA3Aqk9D8dUkAJr_zeZ1-iP1GXq2os"
                >
                  <Marker
                    position={{
                      lat: JSON.parse(order.coordinates.toLowerCase()).latitude,
                      lng: JSON.parse(order.coordinates.toLowerCase())
                        .longitude,
                    }}
                  />
                </GoogleMap>
              )}
              {images && images.length ? (
                <ReactImageGallery items={images} />
              ) : (
                <span>Нет фото</span>
              )}
              <Tabs defaultActiveKey="1">
                <TabPane tab="Отклики" key="1">
                  <RespondList responds={order.communicationHistories} />
                </TabPane>
              </Tabs>
            </Fragment>
          )}
        </Spin>
      </Content>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(OrderSingle);
