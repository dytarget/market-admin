import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Tabs,
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
import { store } from "../../../store";
import "./Photo.css";
import UpdateMarket from "./components/UpdateMarket";
import Products from "../Products/Products";
import { PromosTable } from "../components/PromosTable";
import { ActivateMarket } from "./components/ActivateMarket";
import { PayForBanner } from "./components/PayForBanner";
import moment from "moment";
import { PayForSideBanner } from "./components/PayForSideBanner";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const url = "http://91.201.214.201:8443/";

export class MarketProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      master: "",
      spinning: true,
      responds: [],
      marketCategories: [],
      editModal: false,
      masterType: "",
      orgName: "",
      promoImage: "",
      createPromoModal: false,
      createProdModal: false,
      prodImage: "",
      prodCats: [],
      data: [],
      updateModal: false,
      activateModal: false,
      bannerPayModal: false,
      sideBannerPayModal: false,
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
        const dataRes = [];
        dataRes.push({ name: "Просмотры профиля", count: res.data.viewCount });
        dataRes.push({
          name: "Просмотры номера телефона",
          count: res.data.phoneViewCount,
        });
        dataRes.push({
          name: "Просмотров товаров и цен",
          count: 0,
        });

        let viewMasters = 0;
        let viewCustomers = 0;

        res.data.promos.map((elem) => {
          if (elem.displayType === "MASTER") {
            console.log(elem.viewCount);

            viewMasters = viewMasters + elem.viewCount ? elem.viewCount : 0;
            console.log(viewMasters);
          } else {
            viewCustomers = viewCustomers + elem.viewCount ? elem.viewCount : 0;
          }
        });

        dataRes.push({
          name: "Просмотры баннера",
          count: viewCustomers + viewMasters,
          children: [
            { name: "Заказчики", count: viewCustomers },
            { name: "Мастеры", count: viewMasters },
          ],
        });

        dataRes.push({
          name: "Переходы по баннерам",
          count: 0,
          children: [
            { name: "Заказчики", count: 0 },
            { name: "Мастеры", count: 0 },
          ],
        });

        this.setState({ market: res.data, spinning: false, data: dataRes });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteImage = (id) => {
    this.setState({ spinning: true });
    console.log(id);

    axios
      .delete(`${url}api/v1/image/${id}`)
      .then((res) => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
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

  updateMasterStatus = (status) => {
    this.setState({ spinning: true });

    axios
      .put(`${url}api/v1/user/${this.state.master.username}`, { status })
      .then((res) => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateMasterType = () => {
    this.setState({ spinning: true });

    const { masterType, orgName, master } = this.state;
    if (masterType === "COMPANY" && orgName.length < 1) {
      message.error("Заполните организацю мастера");
    } else {
      axios
        .put(`${url}api/v1/user/${master.username}`, { masterType, orgName })
        .then((res) => {
          this.refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onChangePromoImage = (info) => {
    this.setState({ promoImage: info.file.originFileObj });
  };

  deleteMarket = () => {
    this.setState({ spinning: true });

    axios
      .delete(`${url}api/v1/super/market/${this.state.market.id}`)
      .then((res) => {
        this.refresh();
        this.props.history.push("/users/markets");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createPromo = () => {
    this.setState({ spinning: true, createPromoModal: false });

    axios
      .post(
        `${url}api/v1/promo?link=${this.state.link}&marketId=${this.props.match.params.id}`
      )
      .then((res) => {
        console.log(res.data);
        const files = new FormData();
        files.append("file", this.state.promoImage);
        axios
          .post(`${url}api/v1/image/promo/${res.data.id}`, files, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.refresh();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createProduct = () => {
    const token = store.getState().userReducer.token;
    this.setState({ createProdModal: false });
    axios
      .post(
        `${url}api/v1/product`,
        {
          categoryId: this.state.prodCatId,
          cost: this.state.prodCost,
          description: this.state.prodDescription,
          marketId: this.state.market.id,
          name: this.state.prodName,
        },
        {
          headers: {},
        }
      )
      .then((res) => {
        const file = new FormData();
        file.append("file", this.state.prodImage);

        const authOptions2 = {
          method: "POST",
          url: `${url}api/v1/image/product/${res.data.id}`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: file,
        };
        axios(authOptions2).then(() => {
          this.refresh();
          message.success("Успешно!");
        });
      });
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

    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Карточка Маркета</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Modal
                title="Создать акции и скидки"
                visible={this.state.createPromoModal}
                okText="Создать"
                cancelText="Закрыть"
                closable={false}
                onOk={this.createPromo}
                onCancel={() => this.setState({ createPromoModal: false })}
              >
                <Form>
                  <Form.Item label="Переходня ссылка">
                    <Input
                      onChange={(text) =>
                        this.setState({ link: text.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Фото">
                    <Upload
                      fileList={[]}
                      {...props}
                      onChange={this.onChangePromoImage}
                    >
                      <Button>
                        <Icon type="upload" /> Нажмите чтобы загрузить
                      </Button>
                    </Upload>
                    <p>
                      {this.state.promoImage === "" ||
                        this.state.promoImage.name}
                    </p>
                  </Form.Item>
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

              <Modal
                title="Создать Продук"
                visible={this.state.createProdModal}
                okText="Создать"
                cancelText="Закрыть"
                closable={false}
                onOk={this.createProduct}
                onCancel={() => this.setState({ createProdModal: false })}
              >
                <Form>
                  <Select
                    onChange={(categoryId) =>
                      this.setState({ prodCatId: categoryId })
                    }
                  >
                    {this.state.prodCats.map((cat) => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>

                  <Form.Item label="Название">
                    <Input
                      onChange={(e) =>
                        this.setState({ prodName: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Описание">
                    <Input
                      onChange={(e) =>
                        this.setState({ prodDescription: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Цена">
                    <Input
                      onChange={(e) =>
                        this.setState({ prodCost: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Фото">
                    <Upload
                      fileList={[]}
                      onChange={(info) =>
                        this.setState({ prodImage: info.file.originFileObj })
                      }
                    >
                      <Button>
                        <Icon type="upload" /> Нажмите чтобы загрузить
                      </Button>
                    </Upload>
                    <p>
                      {this.state.prodImage === "" || this.state.prodImage.name}
                    </p>
                  </Form.Item>
                </Form>
              </Modal>

              <div style={{ display: "flex", flexDirection: "row" }}>
                {market.subscriptionType === "FULL" && (
                  <div style={{ margin: "0 10px" }}>
                    <Button
                      onClick={() =>
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
                      onClick={() => this.setState({ bannerPayModal: true })}
                      type="primary"
                    >
                      Оплатить за баннера
                    </Button>
                    <Input value={market.bannerBalance || 0} />
                  </div>
                )}
                <div style={{ margin: "0 10px", width: 258 }}>
                  <Button
                    onClick={() => this.setState({ activateModal: true })}
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
                          ? moment(market.subscriptionEnd).format("DD/MM/YYYY")
                          : ""
                      }
                    />
                  </div>
                )}
              </div>

              <div style={{ margin: "20px 0px" }}>
                <Button.Group>
                  <Popconfirm
                    placement="top"
                    onConfirm={this.deleteMarket}
                    title={"Удалить ?"}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="danger">Удалить</Button>
                  </Popconfirm>
                  <Button
                    onClick={() => this.setState({ updateModal: true })}
                    type="primary"
                  >
                    Редактировать
                  </Button>
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
                        <Form.Item label="Сайт">
                          <Input value={market.site} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Эмайл">
                          <Input value={market.email} />
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
                    title: "Количество",
                    dataIndex: "count",
                    key: "count",
                  },
                ]}
                dataSource={this.state.data}
                bordered
              />
              <PromosTable promos={this.state.market.promos} />
              <Products market={this.state.market} />
            </Fragment>
          )}
          <BackTop />
        </Spin>
      </Content>
    );
  }
}

export default MarketProfile;
