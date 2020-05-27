import React, { Component, Fragment } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Spin,
  Tabs,
  Card,
  Button,
  Icon,
  Popconfirm,
  Modal,
  Select,
  message,
  Upload,
  Drawer,
  BackTop,
  Table,
} from "antd";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import { store } from "../../../store";

import { PromosList } from "../components/PromosList";
import { ProductCategoryList } from "../components/ProductCategory";

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const url = "http://91.201.214.201:8443/";
const columns = [
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
];

export class Products extends Component {
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
      market: props.market,
    };
  }

  componentDidMount() {
    this.setState({ spinning: true });
    this.refresh();
  }

  refresh = () => {
    axios
      .get(`${url}api/v1/product-category`, {
        headers: {},
      })
      .then((res) => this.setState({ prodCats: res.data.productCategories }));

    axios
      .get(`${url}api/v1/product-category/market/${this.state.market.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const containingIds = [];
        const result = [];
        res.data.productCategories.map((cat) => {
          if (!containingIds.includes(cat.id)) {
            containingIds.push(cat.id);
            result.push(cat);
          }
        });
        this.setState({ marketCategories: result, spinning: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteImage = (id) => {
    this.setState({ spinning: true });
    console.log(id);

    axios
      .delete(`${url}api/v1/image/${id}`, {
        headers: {},
      })
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
      .delete(`${url}api/v1/image/user/${userId}/avatar`, {
        headers: {},
      })
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
        .put(`${url}api/v1/user/${master.username}`, {
          masterType,
          orgName,
        })
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
      .delete(`${url}api/v1/super/market/${this.state.market.id}`, {
        headers: {},
      })
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
        `${url}api/v1/promo?link=${this.state.link}&marketId=${this.props.match.params.id}`,
        {},
        {
          headers: {},
        }
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
        <h2 style={{ textAlign: "center" }}>Товары</h2>
        <Spin spinning={spinning}>
          {spinning || (
            <Fragment>
              <Modal
                title="Создать Продукт"
                visible={this.state.createProdModal}
                okText="Создать"
                cancelText="Закрыть"
                closable={false}
                onOk={this.createProduct}
                onCancel={() => this.setState({ createProdModal: false })}
              >
                <Form>
                  <Form.Item label="Категория товара">
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
                  </Form.Item>

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
                        this.setState({
                          prodDescription: e.target.value,
                        })
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
                        this.setState({
                          prodImage: info.file.originFileObj,
                        })
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

              <Button onClick={() => this.setState({ createProdModal: true })}>
                Добавить товар
              </Button>
              <Row>
                <Col span={24}>
                  <ProductCategoryList
                    list={this.state.marketCategories}
                    marketId={market.id}
                    refresh={this.refresh}
                  />
                </Col>
              </Row>
            </Fragment>
          )}
          <BackTop />
        </Spin>
      </Content>
    );
  }
}

export default Products;
