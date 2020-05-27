import React, { Component } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Upload,
  Button,
  Icon,
  Spin,
  message,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { store } from "../../../../store";
import Axios from "axios";

const url = "http://91.201.214.201:8443/";

export default class UpdateMarket extends Component {
  constructor(props) {
    super(props);
    let specs = props.market.specializations.map((elem) => elem.id);
    this.state = {
      about: props.market.about,
      address: props.market.address,
      industry: props.market.industry,
      breakSchedule: props.market.breakSchedule,
      workdaysSchedule: props.market.workdaysSchedule,
      saturdaySchedule: props.market.saturdaySchedule,
      sundaySchedule: props.market.sundaySchedule,
      site: props.market.site,
      status: props.market.status,
      youtubeVideoLink: props.market.youtubeVideoLink,
      email: props.market.email,
      name: props.market.marketName,
      phone: props.market.phone,
      cityId: props.market.city.id,
      specsId: specs,
      spinning: false,
      cities: [],
      specializations: [],
    };
  }

  componentDidMount() {
    Axios.get(`${url}api/v1/city/all`)
      .then((res) => this.setState({ cities: res.data.cities }))
      .catch((err) => console.log(err));
    Axios.get(`${url}api/v1/spec`).then((res) => {
      this.setState({ specializations: res.data.specializations });
    });
  }

  createMarket = () => {
    this.setState({ spinning: true });
    message.warning("Подождите");
    const { token } = store.getState().userReducer;
    const headers = {};
    Axios.patch(
      `${url}api/v1/market/${this.props.market.id}`,
      {
        about: this.state.about,
        address: this.state.address,
        industry: this.state.industry,
        breakSchedule: this.state.breakSchedule,
        workdaysSchedule: this.state.workdaysSchedule,
        saturdaySchedule: this.state.saturdaySchedule,
        sundaySchedule: this.state.sundaySchedule,
        site: this.state.site,
        status: this.state.status,
        youtubeVideoLink: this.state.youtubeVideoLink,
        email: this.state.email,
        name: this.state.name,
        phone: this.state.phone,
        cityId: this.state.cityId,
        specializationIds: this.state.specsId,
      },
      {
        headers,
      }
    )
      .then((resmarket) => {
        this.setState({ spinning: false });
        message.success("Успешно");
        this.props.refresh();
        this.props.modalValue(false);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ spinning: false });
        message.success("Ошибка");
      });
  };

  render() {
    return (
      <div>
        <Modal
          title="Обновить маркета"
          visible={this.props.editModal}
          okText="Обновить"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createMarket}
          onCancel={() => this.props.modalValue(false)}
        >
          <Spin spinning={this.state.spinning}>
            <Form>
              <Form.Item label="Название маркета">
                <Input
                  value={this.state.name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Адрес">
                <Input
                  value={this.state.address}
                  onChange={(e) => this.setState({ address: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Телефон">
                <Input
                  value={this.state.phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="E-mail">
                <Input
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Отрасль">
                <Input
                  value={this.state.industry}
                  onChange={(e) => this.setState({ industry: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Специялизация">
                <Row gutter={16}>
                  <Col span={24}>
                    <Select
                      onChange={(specsId) => this.setState({ specsId })}
                      defaultValue={this.state.specsId}
                      mode="multiple"
                    >
                      {this.state.specializations.map((spec) => (
                        <Select.Option key={spec.id} value={spec.id}>
                          {spec.specName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Город">
                <Row gutter={16}>
                  <Col span={24}>
                    <Select
                      defaultValue={this.state.cityId}
                      onChange={(cityId) => this.setState({ cityId })}
                    >
                      {this.state.cities.map((city) => (
                        <Select.Option key={city.id} value={city.id}>
                          {city.cityName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="Веб-сайт">
                <Input
                  value={this.state.site}
                  onChange={(e) => this.setState({ site: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Про маркет">
                <TextArea
                  rows={4}
                  value={this.state.about}
                  onChange={(e) => this.setState({ about: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Ссылка на видео в Youtube">
                <span style={{ margin: 0, padding: 0 }}>
                  Чтобы взять ссылку с Youtube, нажмите кнопку поделиться и
                  копировать ссылку
                </span>
                <Input
                  placeholder={"Пример: https://youtu.be/5-4TgpDYPwg"}
                  value={this.state.youtubeVideoLink}
                  onChange={(e) =>
                    this.setState({
                      youtubeVideoLink: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="График работы(рабочине дни)">
                    <Input
                      value={this.state.workdaysSchedule}
                      placeholder="9:00-18:00"
                      onChange={(e) =>
                        this.setState({
                          workdaysSchedule: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="График работы(суббота)">
                    <Input
                      value={this.state.saturdaySchedule}
                      placeholder="9:00-14:00"
                      onChange={(e) =>
                        this.setState({
                          saturdaySchedule: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="График работы(воскресенье)">
                    <Input
                      value={this.state.sundaySchedule}
                      placeholder="выходной"
                      onChange={(e) =>
                        this.setState({
                          sundaySchedule: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="График работы(Перерыв)">
                    <Input
                      value={this.state.breakSchedule}
                      placeholder="12:00-13:00"
                      onChange={(e) =>
                        this.setState({
                          breakSchedule: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}
