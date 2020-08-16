import React from "react";
import {
  Icon,
  Table,
  Button,
  Layout,
  Spin,
  Avatar,
  Input,
  Form,
  Modal,
  Col,
  Row,
  Upload,
  message,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { connect } from "react-redux";
import createLogs from "../../../utils/createLogs";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    fixed: "left",
  },
  {
    title: "Логотип",
    dataIndex: "logo",
    key: "logo",
    render: (logo) => (
      <Avatar
        src={
          logo
            ? `http://91.201.214.201:8443/images/${logo.imageName}`
            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      />
    ),
  },
  {
    title: "Название",
    dataIndex: "marketName",
    key: "marketName",
    render: (marketName, data) => (
      <Link to={`/users/markets/${data.id}`}>
        <span>{marketName}</span>
      </Link>
    ),
  },
  {
    title: "Дата регистрации",
    dataIndex: "created",
    key: "created",
    render: (created) =>
      created && <span>{`${created[2]}/${created[1]}/${created[0]}`}</span>,
  },
  {
    title: "Категория",
    dataIndex: "specializations",
    key: "specializations",
    render: (specializations) => (
      <span>{specializations.map((i) => `${i.specName}\n `)}</span>
    ),
    width: 200,
  },
  {
    title: "Отрасль",
    dataIndex: "industry",
    key: "industry",
    width: 200,
  },
  {
    title: "Номер телефона",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => <span>8{phone}</span>,
  },
  {
    title: "Адрес",
    dataIndex: "address",
    key: "address",
    width: 200,
  },
  {
    title: "Тариф",
    dataIndex: "subscriptionType",
    key: "subscriptionType",
    render: (subscriptionType) => (
      <span>{subscriptionType === "FULL" ? "Полный" : "Ограниченный"}</span>
    ),
  },
  {
    title: "Дата начало подписки",
    dataIndex: "subscriptionStart",
    key: "subscriptionStart",
    render: (subscriptionStart) => (
      <span>
        {subscriptionStart &&
          // moment(subscriptionStart).subtract(1, "months").format("DD/MM/YYYY")}
          `${subscriptionStart[2]}/${subscriptionStart[1]}/${subscriptionStart[0]}`}
      </span>
    ),
  },
  {
    title: "Дата окончания подписки",
    dataIndex: "subscriptionEnd",
    key: "subscriptionEnd",
    render: (subscriptionEnd) => (
      <span>
        {subscriptionEnd &&
          // moment(subscriptionEnd).subtract(1, "months").format("DD/MM/YYYY")}
          `${subscriptionEnd[2]}/${subscriptionEnd[1]}/${subscriptionEnd[0]}`}
      </span>
    ),
  },
  {
    title: "Остаток за размещения баннера",
    dataIndex: "bannerBalance",
    key: "bannerBalance",
    render: (bannerBalance) => {
      const balance = bannerBalance ? parseInt(bannerBalance, 10) : 0;
      return (
        <span
          style={
            balance < 1000
              ? {
                  backgroundColor: "red",
                  padding: "10px 20px",
                }
              : {}
          }
        >
          {balance}
        </span>
      );
    },
    width: 170,
  },
  {
    title: "Менеджер",
    dataIndex: "manager",
    key: "manager",
    render: (manager) => {
      return (
        <span>
          {manager?.firstName} {manager?.lastName}
        </span>
      );
    },
  },
];
class MarketTable extends React.Component {
  state = {
    markets: [],
    spinning: false,
    editModal: false,
    files: [],
    data: [],
    specializations: [],
    search: "",
    productCategories: [],
    cities: [],
    logo: "",
    specializationIds: [],
    latitude: null,
    longitude: null,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ spinning: true });
    const headers = {};
    axios
      .get(`${url}api/v1/city/all`, {
        headers,
      })
      .then((res) => this.setState({ cities: res.data.cities }))
      .catch((err) => console.log(err));

    let cities = "";

    if (
      !this.props.userReducer.user.isSuperAdmin &&
      this.props.userReducer.user.cities
    ) {
      this.props.userReducer.user.cities.forEach((city) => {
        cities += `city=${city}&`;
      });

      cities = "/cities?" + cities.substring(0, cities.lastIndexOf("&"));
    }

    axios
      .get(`${url}api/v1/market${cities}`, {
        headers,
      })
      .then((res) => {
        console.log(res.data);

        this.setState({
          markets: res.data.markets,
          data: res.data.markets,
          spinning: false,
        });
        axios
          .get(`${url}api/v1/spec`, {
            headers,
          })
          .then((res) => {
            this.setState({
              specializations: res.data.specializations,
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createMarket = () => {
    const { specializationIds, latitude, longitude } = this.state;
    this.setState({ editModal: false, spinning: true });
    if (this.state.username && this.state.code) {
      axios
        .post(`${url}api/v1/super/market`, {
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
          coordinates:
            latitude && longitude
              ? JSON.stringify({ latitude, longitude })
              : null,
          specializationIds,
        })
        .then((resmarket) => {
          const file = new FormData();
          file.append("file", this.state.logo);

          createLogs(`Создал профиль Продавца ${this.state.name}`);

          const authOptions = {
            method: "POST",
            url: `${url}api/v1/image/market/${resmarket.data.id}`,
            data: file,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };

          axios(authOptions).then((res) => {
            createLogs(`Добавил логотип Продавца ${this.state.name}`);

            const file2 = new FormData();
            this.state.files.forEach((element) => {
              file2.append("files", element);
            });
            const authOptionsPhotos = {
              method: "POST",
              url: `${url}api/v1/image/market/${resmarket.data.id}/photos`,
              data: file2,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };

            axios(authOptionsPhotos).then((res) => {
              createLogs(`Добавил фотографии Продавца ${this.state.name}`);

              axios({
                method: "POST",
                url: `${url}api/v1/admin/market/user`,
                data: {
                  code: this.state.code,
                  username: this.state.username,
                },
              }).then((user) => {
                axios({
                  method: "PUT",
                  url: `${url}api/v1/user/${user.data.username}`,
                  data: {
                    marketId: resmarket.data.id,
                  },
                }).then(() => {
                  createLogs(
                    `Создал пользователя(Логин:${this.state.username}) Кабинета Продавца ${this.state.name}`
                  );
                  this.refresh();
                  setTimeout(() => window.location.reload(), 1000);

                  this.setState({ editModal: false });
                });
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onChangeLogo = (info) => {
    this.setState({ logo: info.file.originFileObj });
  };

  onChangeUploading = (info) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      const { files } = this.state;
      files.push(info.file.originFileObj);
      this.setState({ files });
      console.log("files", this.state.files);

      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  change = (value) => {
    this.setState({ search: value.target.value });
    if (value.target.value === "") {
      this.setState({ data: this.state.markets });
    } else {
      const data = this.state.markets.filter(
        (data) =>
          `${data.marketName}`
            .toLowerCase()
            .indexOf(value.target.value.toLowerCase()) !== -1
      );
      this.setState({ data });
    }
  };

  render() {
    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
    };
    return (
      <Content style={{ minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список Продавцов</h2>
        <Modal
          title="Создать Продавца"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createMarket}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Название Продавца">
              <Input
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Логин Кабинета Продавца">
              <Input
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Пароль">
              <Input
                type="password"
                onChange={(e) => this.setState({ code: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Адрес">
              <Input
                onChange={(e) => this.setState({ address: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Телефон">
              <Input
                onChange={(e) => this.setState({ phone: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Отрасль">
              <Input
                onChange={(e) => this.setState({ industry: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Специялизация">
              <Row gutter={16}>
                <Col span={24}>
                  <Select
                    onChange={(specializationIds) =>
                      this.setState({ specializationIds })
                    }
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
                  <Select onChange={(cityId) => this.setState({ cityId })}>
                    {this.state.cities.map((city) => (
                      <Select.Option value={city.id}>
                        {city.cityName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Веб-сайт">
              <Input
                onChange={(e) => this.setState({ site: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Про Продавца">
              <TextArea
                rows={4}
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Координаты карты">
                  <Input
                    placeholder="Широта"
                    type="number"
                    onChange={(e) =>
                      this.setState({
                        latitude: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Координаты карты">
                  <Input
                    placeholder="Долгота"
                    type="number"
                    onChange={(e) =>
                      this.setState({
                        longitude: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Логотип Продавца">
              <Upload fileList={[]} {...props} onChange={this.onChangeLogo}>
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
              <p>{this.state.logo === "" || this.state.logo.name}</p>
            </Form.Item>
            <Form.Item label="Фотографии Продавца">
              <Upload {...props} onChange={this.onChangeUploading}>
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Button.Group>
          <Button onClick={this.refresh} type="primary">
            <Icon type="reload" />
            Обновить
          </Button>
          {this.props.canEditUser && (
            <Button
              onClick={() => this.setState({ editModal: true })}
              type="primary"
            >
              <Icon type="plus" />
              Добавить Продавца
            </Button>
          )}
        </Button.Group>
        <Input
          style={{ width: 300, marginLeft: 30 }}
          placeholder="Поиск по Названию"
          value={this.state.search}
          onChange={this.change}
          prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        <span style={{ marginLeft: 10 }}>
          Количество: {this.state.data.length}
        </span>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table
            columns={columns}
            pagination={{ pageSize: 7 }}
            dataSource={this.state.data}
            style={{ padding: "10px 20px" }}
            scroll={{ x: "calc(1200px + 70%)", y: 500 }}
          />
        </Spin>
      </Content>
    );
  }
}

export default connect(({ userReducer }) => ({ userReducer }), {})(MarketTable);
