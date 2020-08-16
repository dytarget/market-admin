import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Button,
  Icon,
  Popconfirm,
  Modal,
  Select,
  message,
  Upload,
  BackTop,
  Table,
} from "antd";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import "./Photo.css";
import UpdateMarket from "./components/UpdateMarket";
import Products from "../Products/Products";
import { PromosTable } from "../components/PromosTable";
import { ActivateMarket } from "./components/ActivateMarket";
import { PayForBanner } from "./components/PayForBanner";
import moment from "moment";
import { PayForSideBanner } from "./components/PayForSideBanner";
import ProductCategories from "./components/ProductCategories";
import ButtonGroup from "antd/lib/button/button-group";
import createLogs from "../../../utils/createLogs";
import config from "../../../config/config";
import generateCitiesId from "../../../utils/generateCitiesId";

const { Content } = Layout;
const { TextArea } = Input;

const viewReportLabelNames = {
  profileViewCount: "Просмотры профиля",
  phoneNumberViewCount: "Просмотры номера телефона",
  productViewCount: "Просмотроы товаров и цен",
  bannerViewMasterCount: "Просмотры баннера Мастера",
  bannerFollowMasterCount: "Переходы по баннерам Мастера",
  sideViewMasterCount: "Просмотры бокового баннера Мастера",
  sideFollowMasterCount: "Переходы по боковому баннеру Мастера",
  bannerViewCustomerCount: "Просмотры баннера Заказчики",
  bannerFollowCustomerCount: "Переходы по баннерам Заказчики",
  sideViewCustomerCount: "Просмотры бокового баннера Заказчики",
  sideFollowCustomerCount: "Переходы по боковому баннеру Заказчики",
};

const url = "http://91.201.214.201:8443/";

export class MarketProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      marketCategories: [],
      editModal: false,
      data: [],
      updateModal: false,
      activateModal: false,
      bannerPayModal: false,
      sideBannerPayModal: false,
      updateAvatar: false,
      logo: "",
      marketPhotos: [],
      addMarketPhotosModal: false,
      chooseManager: false,
      managerId: 0,
      admins: [],
      userAdmin: "",
      passwordVisible: false,
      loginVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ spinning: true });
    this.refresh();
  }

  refresh = () => {
    axios
      .get(`${url}api/v1/market/${this.props.match.params.id}`)
      .then((res) => {
        axios
          .get(`${url}api/v1/admin/report/view/${this.props.match.params.id}`)
          .then((result) => {
            const dataRes = [];

            Object.keys(result.data.todayReport).forEach((report) => {
              dataRes.push({
                name: viewReportLabelNames[report],
                todayReport: result.data.todayReport[report],
                weekReport: result.data.weekReport[report],
                monthReport: result.data.monthReport[report],
                sumReport: result.data.sumReport[report],
              });
            });
            this.setState({ data: dataRes });
          });

        this.setState({ market: res.data, spinning: false });
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${url}api/v1/super/user/admins${generateCitiesId(true)}`)
      .then((res) => this.setState({ admins: res.data }));
    axios
      .get(`${url}api/v1/user/market/${this.props.match.params.id}`)
      .then((res) => {
        this.setState({ userAdmin: res.data });
      });
  };

  deleteAvatar = (userId) => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/image/user/${userId}/avatar`)
      .then((res) => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteMarket = () => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/super/market/${this.state.market.id}`)
      .then((res) => {
        createLogs(`Удалил Продавца ${this.state.market.marketName}`);
        this.refresh();
        this.props.history.push("/users/markets");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteImage = (id) => {
    this.setState({ spinning: true });
    axios.delete(`${url}api/v1/image/${id}`).then(() => {
      message.success("Успешно");
      createLogs(`Удалил Фотографии ${this.state.market.marketName}`);
      this.refresh();
    });
  };

  updateAvatar = () => {
    this.setState({ updateAvatar: false, spinning: true });
    const file = new FormData();
    file.append("file", this.state.logo);

    const authOptions = {
      method: "POST",
      url: `${url}api/v1/image/market/${this.state.market.id}`,
      data: file,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios(authOptions).then((res) => {
      createLogs(`Обновил логотип Продавца ${this.state.market.marketName}`);

      this.refresh();
      setTimeout(() => window.location.reload(), 1000);

      message.success("Успешно");
      this.setState({ logo: "" });
    });
  };

  addMarketPhotos = () => {
    this.setState({
      addMarketPhotosModal: false,
      spinning: true,
    });
    const file2 = new FormData();
    this.state.marketPhotos.forEach((element) => {
      file2.append("files", element);
    });
    const axiosOptionsPhotos = {
      method: "POST",
      url: `${url}api/v1/image/market/${this.state.market.id}/photos`,
      data: file2,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios(axiosOptionsPhotos).then((res) => {
      createLogs(`Добавил фотографии Продавца ${this.state.market.marketName}`);

      this.refresh();
      setTimeout(() => window.location.reload(), 1000);

      this.setState({ marketPhotos: [] });
    });
  };

  onChangeUploading = (info) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      const { marketPhotos } = this.state;
      marketPhotos.push(info.file.originFileObj);
      this.setState({ marketPhotos });

      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  chooseManager = () => {
    this.setState({ spinning: true });
    const { managerId } = this.state;

    axios
      .patch(`${url}api/v1/market/${this.state.market.id}`, {
        managerId,
      })
      .then((res) => {
        createLogs(
          `Выбрал менеджера по ID(${this.state.market.id}) для Продавца ${this.state.market.marketName}`
        );

        this.refresh();
      })
      .catch((err) => {
        console.log(err);
        message.error("Ошибка");
      });
  };

  handleUpdateLogin = () => {
    if (this.state.newLogin) {
      axios
        .patch(`${config.url}api/v1/user/creds/${this.state.userAdmin.id}`, {
          userName: this.state.newLogin,
        })
        .then((res) => {
          createLogs(
            `Обновил логин Маркета ${this.state.market.id} на новый(${this.state.newLogin}) ${this.state.userAdmin.username}`
          );
          message.success("Успешно");
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch((err) => {
          this.setState({ loginVisible: false });
          message.error("Ошибка");
        });
    } else {
      message.error("Заполните поля или внесите изменения");
    }
  };

  handleUpdatePassword = () => {
    if (this.state.newPassword) {
      axios
        .patch(`${config.url}api/v1/user/creds/${this.state.userAdmin.id}`, {
          password: this.state.newPassword,
        })
        .then((res) => {
          createLogs(`Обновил пароль Маркета ${this.state.market.id}`);
          message.success("Успешно");
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch((err) => {
          this.setState({ passwordVisible: false });
          message.error("Ошибка");
        });
    } else {
      message.error("Заполните поля");
    }
  };

  render() {
    const { market, spinning } = this.state;

    const galleryPhotos = [];
    market &&
      market.photos &&
      market.photos.map((photos, index) => {
        const obj = {
          original: `http://91.201.214.201:8443/images/${photos.imageName}`,
          thumbnail: `http://91.201.214.201:8443/images/${photos.imageName}`,
        };
        galleryPhotos.push(obj);
      });

    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
    };

    console.log(this.state.data);

    return (
      <Content style={{ padding: "0 24px", minHeight: 280, minWidth: 1000 }}>
        <h2 style={{ textAlign: "center" }}>Карточка Продавца</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Modal
                title="Обновить Пароль"
                visible={this.state.passwordVisible}
                onCancel={() => this.setState({ passwordVisible: false })}
                onOk={this.handleUpdatePassword}
                okText="Изменить"
                cancelText="Отменить"
                closable={false}
              >
                <Form
                  style={{ marginTop: 20 }}
                  layout="vertical"
                  hideRequiredMark
                >
                  <Form.Item label="Пароль">
                    <Input
                      value={this.state.newPassword}
                      type="password"
                      onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Обновить Логин"
                visible={this.state.loginVisible}
                onCancel={() => this.setState({ loginVisible: false })}
                onOk={this.handleUpdateLogin}
                okText="Изменить"
                cancelText="Отменить"
                closable={false}
              >
                <Form
                  style={{ marginTop: 20 }}
                  layout="vertical"
                  hideRequiredMark
                >
                  <Form.Item label="Логин">
                    <Input
                      defaultValue={this.state.userAdmin.username}
                      onChange={(e) =>
                        this.setState({ newLogin: e.target.value })
                      }
                    />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Обновить Логотип"
                visible={this.state.updateAvatar}
                okText="Обновить"
                cancelText="Закрыть"
                closable={false}
                onOk={this.updateAvatar}
                onCancel={() => this.setState({ updateAvatar: false })}
              >
                <Form>
                  <Form.Item label="Логотип Продавца">
                    <Upload
                      fileList={[]}
                      {...props}
                      onChange={(info) =>
                        this.setState({ logo: info.file.originFileObj })
                      }
                    >
                      <Button>
                        <Icon type="upload" /> Нажмите чтобы загрузить
                      </Button>
                    </Upload>
                    <p>{this.state.logo === "" || this.state.logo.name}</p>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Выбрать Менеджера"
                visible={this.state.chooseManager}
                okText="Выбрать"
                cancelText="Закрыть"
                onCancel={() => this.setState({ chooseManager: false })}
                onOk={this.chooseManager}
              >
                <Form>
                  <Form.Item label="Менеджер">
                    <Select
                      onChange={(managerId) => this.setState({ managerId })}
                    >
                      {this.state.admins.map((admin) => (
                        <Select.Option value={admin.id}>
                          {admin.firstName} {admin.lastName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Редактировать фотографии"
                visible={this.state.addMarketPhotosModal}
                cancelButtonProps={{
                  style: { opacity: 0 },
                  disabled: true,
                }}
                okText="Закрыть"
                closable={false}
                onOk={() => this.setState({ addMarketPhotosModal: false })}
              >
                <div
                  style={{
                    display: "grid",
                    width: "100%",
                    gridGap: 10,
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows: "minmax(100px,auto)",
                  }}
                >
                  {market?.photos?.map((photos, index) => (
                    <div key={`${index}`}>
                      <img
                        style={{
                          width: 70,
                          height: 70,
                          marginRight: 20,
                        }}
                        src={`http://91.201.214.201:8443/images/${photos.imageName}`}
                        alt="gg"
                      />
                      <Popconfirm
                        placement="top"
                        title={"Удалить ?"}
                        onConfirm={() => {
                          this.setState({ addMarketPhotosModal: false });
                          this.deleteImage(photos.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="danger">
                          <Icon type="delete" />
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
                </div>
                <Form>
                  <Form.Item label="Фотографии Продавца">
                    <Upload {...props} onChange={this.onChangeUploading}>
                      <Button>
                        <Icon type="upload" /> Нажмите чтобы загрузить
                      </Button>
                    </Upload>
                  </Form.Item>
                  {this.state.marketPhotos.length > 0 && (
                    <Button onClick={this.addMarketPhotos}>
                      Добавить Фотографии
                    </Button>
                  )}
                </Form>
              </Modal>
              <UpdateMarket
                refresh={this.refresh}
                market={this.state.market}
                editModal={this.state.updateModal}
                modalValue={(value) => this.setState({ updateModal: value })}
              />
              <ActivateMarket
                id={market.id}
                activateModal={this.state.activateModal}
                modalValue={(value) => this.setState({ activateModal: value })}
                refresh={this.refresh}
              />

              <PayForBanner
                id={market.id}
                bannerBalance={market.bannerBalance || 0}
                bannerPayModal={this.state.bannerPayModal}
                modalValue={(value) => this.setState({ bannerPayModal: value })}
                refresh={this.refresh}
              />

              <PayForSideBanner
                id={market.id}
                sideBannerBalance={market.sideBannerBalance || 0}
                sideBannerPayModal={this.state.sideBannerPayModal}
                modalValue={(value) =>
                  this.setState({ sideBannerPayModal: value })
                }
                refresh={this.refresh}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>
                {market.subscriptionType === "FULL" && (
                  <div style={{ margin: "0 10px" }}>
                    <Button
                      onClick={() =>
                        this.props.canEditUser &&
                        this.setState({ sideBannerPayModal: true })
                      }
                      type="primary"
                    >
                      Оплатить за боковой баннера
                    </Button>
                    <Input value={market.sideBannerBalance || 0} />
                  </div>
                )}
                {market.subscriptionType === "FULL" && (
                  <div style={{ margin: "0 10px" }}>
                    <Button
                      onClick={() =>
                        this.props.canEditUser &&
                        this.setState({ bannerPayModal: true })
                      }
                      type="primary"
                    >
                      Оплатить за баннера
                    </Button>
                    <Input value={market.bannerBalance || 0} />
                  </div>
                )}
                <div style={{ margin: "0 10px", width: 258 }}>
                  <Button
                    onClick={() =>
                      this.props.canEditUser &&
                      this.setState({ activateModal: true })
                    }
                    type="primary"
                    disabled={market.subscriptionType === "FULL"}
                  >
                    Активация/Продление за подписку
                  </Button>
                  <Input value={market.subscriptionBalance || "Ограничен"} />
                </div>
                {market.subscriptionType === "FULL" && (
                  <div style={{ margin: "0 10px" }}>
                    <Button type="primary">Дата окончания подписки</Button>
                    <Input
                      value={
                        market.subscriptionEnd
                          ? `${market.subscriptionEnd[2]}/${market.subscriptionEnd[1]}/${market.subscriptionEnd[0]}`
                          : ""
                      }
                    />
                  </div>
                )}
              </div>

              <div style={{ margin: "20px 0px" }}>
                <Button.Group>
                  {this.props.canDeleteUser && (
                    <Popconfirm
                      placement="top"
                      onConfirm={this.deleteMarket}
                      title={"Удалить ?"}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="danger">Удалить Продавца</Button>
                    </Popconfirm>
                  )}
                  {this.props.canEditUser && (
                    <Button
                      onClick={() => this.setState({ updateModal: true })}
                      type="primary"
                    >
                      Редактировать
                    </Button>
                  )}
                  {this.props.canEditUser && market && market.logo && (
                    <Button
                      onClick={() => this.setState({ updateAvatar: true })}
                      type="primary"
                    >
                      Обновить Логотип
                    </Button>
                  )}
                  {this.props.canEditUser && (
                    <Button
                      onClick={() =>
                        this.setState({ addMarketPhotosModal: true })
                      }
                      type="primary"
                    >
                      Редактировать фотографии
                    </Button>
                  )}
                  {this.props.canEditUser && (
                    <Button
                      onClick={() => this.setState({ chooseManager: true })}
                    >
                      Выбрать {market.manager ? "нового" : ""} Менеджера
                    </Button>
                  )}
                  {this.props.canEditUser && (
                    <>
                      {" "}
                      <Button
                        onClick={() => this.setState({ loginVisible: true })}
                        type="primary"
                      >
                        Обновить Логин(Кабинет Продавца)
                      </Button>
                      <Button
                        onClick={() => this.setState({ passwordVisible: true })}
                        type="primary"
                      >
                        Обновить Пароль(Кабинет Продавца)
                      </Button>
                    </>
                  )}
                </Button.Group>
              </div>

              <Row>
                <Col span={12}>
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                      <Col span={12}>
                        <img
                          alt="example"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          src={
                            market && market.logo
                              ? `http://91.201.214.201:8443/images/${market.logo.imageName}`
                              : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          }
                        />
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Наименование">
                          <Input value={market.marketName} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Специлизация">
                          <Input
                            value={market.specializations.map(
                              (elem) => elem.specName
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Номер Телефона">
                          <Input addonBefore="+7" value={market.phone} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Город">
                          <Input value={market.city && market.city.cityName} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Отрасль">
                          <Input value={market?.industry} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Сайт">
                          <Input value={market.site} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Эмайл">
                          <Input value={market.email} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Широрта(Карта)">
                          <Input
                            value={
                              market.coordinates
                                ? JSON.parse(market.coordinates?.toLowerCase())
                                    .latitude
                                : null
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Долгота(Карта)">
                          <Input
                            value={
                              market.coordinates
                                ? JSON.parse(market.coordinates?.toLowerCase())
                                    .longitude
                                : null
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Фото профиля">
                          {galleryPhotos && galleryPhotos.length && (
                            <ImageGallery items={galleryPhotos} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col span={11} style={{ marginLeft: 20 }}>
                  <Form layout="vertical" hideRequiredMark>
                    <Row>
                      <Col span={24}>
                        <Form.Item label="Описание">
                          <Row gutter={[0, 16]}>
                            <TextArea rows={6} value={market.about} />
                          </Row>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Адрес">
                          <Input value={market.address} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Ссылка на YouTube видео">
                          <Input value={market.youtubeVideoLink} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Широрта(Карта)">
                          <Input
                            value={
                              market.coordinates
                                ? JSON.parse(market.coordinates?.toLowerCase())
                                    .latitude
                                : null
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Долгота(Карта)">
                          <Input
                            value={
                              market.coordinates
                                ? JSON.parse(market.coordinates?.toLowerCase())
                                    .longitude
                                : null
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        span={24}
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <Form.Item label="Режим работы">
                          <Input
                            style={{ textAlign: "right" }}
                            addonBefore="Рабочие дни"
                            value={market.workdaysSchedule}
                          />
                          <Input
                            style={{ textAlign: "right" }}
                            addonBefore=" Суббота "
                            value={market.saturdaySchedule}
                          />
                          <Input
                            style={{ textAlign: "right" }}
                            addonBefore="Воскресенье"
                            value={market.sundaySchedule}
                          />
                          <Input
                            style={{ textAlign: "right" }}
                            addonBefore="Перерыв"
                            value={market.breakSchedule}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Table
                columns={[
                  {
                    title: "Название",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Текущий день",
                    dataIndex: "todayReport",
                    key: "todayReport",
                  },
                  {
                    title: "Неделя",
                    dataIndex: "weekReport",
                    key: "weekReport",
                  },
                  {
                    title: "Месяц",
                    dataIndex: "monthReport",
                    key: "monthReport",
                  },
                  {
                    title: "Общая",
                    dataIndex: "sumReport",
                    key: "sumReport",
                  },
                ]}
                style={{ marginBottom: 20 }}
                dataSource={this.state.data}
                pagination={false}
                scroll={{ y: 500 }}
                bordered
              />
              <h2 style={{ textAlign: "center" }}>Баннеры</h2>

              <PromosTable promos={this.state.market.promos} />
              <ProductCategories
                canEditUser={this.props.canEditUser}
                canDeleteUser={this.props.canDeleteUser}
                marketId={this.state.market.id}
                refresh={this.refresh}
              />
              <Products
                canEditUser={this.props.canEditUser}
                canDeleteUser={this.props.canDeleteUser}
                market={this.state.market}
              />
            </Fragment>
          )}
          <BackTop />
        </Spin>
      </Content>
    );
  }
}

export default MarketProfile;
