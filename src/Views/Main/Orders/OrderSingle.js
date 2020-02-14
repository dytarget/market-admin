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
  Icon
} from "antd";
import axios from "axios";
import getOrderStatus from "../../../utils/getOrderStatus";
import getOrderDate from "../../../utils/getOrderDate";
import getOrderPrice from "../../../utils/getOrderPrice";
import { store } from "../../../store";
import getCommunicationType from "../../../utils/getCommunicationType";
import { UserComponent } from "../components/UserComponent";
import { RespondList } from "../components/RespondList";
import ReactImageGallery from "react-image-gallery";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

const url = "https://cors-anywhere.herokuapp.com/http://91.201.214.201:8443/";

export class OrderSingle extends Component {
  constructor(props) {
    super(props);
    const { order } = props;

    this.state = {
      order,
      spinning: true
    };
  }
  async componentDidMount() {
    if (!this.state.order) {
      this.refresh();
    } else {
      this.setState({ spinning: false });
    }
  }

  refresh = async () => {
    const res = await axios.get(
      `${url}api/v1/order?mode=SINGLE&order=${this.props.match.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${store.getState().userReducer.token}`
        }
      }
    );
    this.setState({ spinning: false, order: res.data.orders[0] });
  };

  updateOrderStatus = status => {
    this.setState({ spinning: true });

    axios
      .patch(
        `${url}api/v1/order/${this.state.order.id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${store.getState().userReducer.token}`
          }
        }
      )
      .then(res => {
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { order, spinning } = this.state;

    const images = [];
    order && order.images &&
      order.images.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`
        };
        images.push(obj);
      });
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Карточка заказа</h2>
        {order && (
          <Button.Group style={{ marginBottom: 20 }}>
            {order.status === "MODERATION" && (
              <Popconfirm
                placement="top"
                onConfirm={() => this.updateOrderStatus("OPEN")}
                title={"Опубликовать ?"}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Опубликовать</Button>
              </Popconfirm>
            )}
            {order.status === "OPEN" && (
              <Popconfirm
                placement="top"
                onConfirm={() => this.updateOrderStatus("CANCELLED")}
                title={"Отменить ?"}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Отменить</Button>
              </Popconfirm>
            )}
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
              {images && images.length && (
                <ReactImageGallery items={images} />
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

export default OrderSingle;
