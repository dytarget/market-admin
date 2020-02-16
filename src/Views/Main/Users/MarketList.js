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
  Select
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";

const url = "http://91.201.214.201:8443/";
const { Content } = Layout;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Логотип",
    dataIndex: "logo",
    key: "logo",
    render: logo => (
      <Avatar
        src={
          logo
            ? `http://91.201.214.201:8443/images/${logo.imageName}`
            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      />
    )
  },
  {
    title: "Название",
    dataIndex: "marketName",
    key: "marketName",
    render: (marketName, data) => (
      <Link to={`/users/markets/${data.id}`}>
        <span>{marketName}</span>
      </Link>
    )
  },
  {
    title: "Адрес",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "Категория",
    dataIndex: "category",
    key: "category",
    render: category => <span>{category && category.categoryName}</span>
  },
  {
    title: "Номер телефона",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "Веб-сайт",
    dataIndex: "site",
    key: "site"
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: status => (
      <span>{status === "BLOCKED" ? "Заблокирован" : "Активный"}</span>
    )
  }
];

export default class MarketTable extends React.Component {
  state = {
    markets: [],
    spinning: false,
    editModal: false,
    files: [],
    categories: [],
    productCategories: [],
    logo: ""
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ spinning: true });
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios
      .get(`${url}api/v1/market`, {
        headers
      })
      .then(res => {
        console.log(res.data);

        this.setState({ markets: res.data.markets });
        axios
          .get(`${url}api/v1/category`, {
            headers
          })
          .then(res => {
            this.setState({ categories: res.data.categories });
            axios
              .get(`${url}api/v1/product-category`, {
                headers
              })
              .then(res => {
                this.setState({
                  spinning: false,
                  productCategories: res.data.productCategories
                });
              });
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  createMarket = () => {
    const {
      about,
      address,
      breakSchedule,
      workdaysSchedule,
      saturdaySchedule,
      sundaySchedule,
      site,
      status,
      youtubeVideoLink,
      email,
      name,
      phone,
      productCategoriesIds,
      categoryId
    } = this.state;
    const obj = {
      about,
      address,
      breakSchedule,
      workdaysSchedule,
      saturdaySchedule,
      sundaySchedule,
      site,
      status,
      youtubeVideoLink,
      email,
      name,
      phone,
      productCategoriesIds,
      categoryId
    };
    const { token } = store.getState().userReducer;
    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios
      .post(
        `${url}api/v1/admin/market`,
        {
          about: this.state.about,
          address: this.state.address,
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
          productCategoriesIds: this.state.productCategoriesIds,
          categoryId
        },
        {
          headers
        }
      )
      .then(resmarket => {
        const file = new FormData();
        file.append("file", this.state.logo);

        const authOptions = {
          method: "POST",
          url: `${url}api/v1/image/market/${resmarket.data.id}`,
          data: file,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        };

        axios(authOptions).then(res => {
          const file = new FormData();
          this.state.files.forEach(element => {
            file.append("files", element);
          });
          const authOptionsPhotos = {
            method: "POST",
            url: `${url}api/v1/image/market/${resmarket.data.id}/photos`,
            data: file,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          };

          axios(authOptionsPhotos).then(res => {
            this.refresh();
            this.setState({ editModal: false });
          });
        });
      })
      .catch(err => {
        console.log(err);
      });

    console.log(obj);
  };

  onChangeLogo = info => {
    this.setState({ logo: info.file.originFileObj });
  };

  onChangeUploading = info => {
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

  render() {
    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      }
    };
    return (
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <h2 style={{ textAlign: "center" }}>Список маркетов</h2>
        <Modal
          title="Создать маркета"
          visible={this.state.editModal}
          okText="Создать"
          cancelText="Закрыть"
          closable={false}
          onOk={this.createMarket}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Название маркета">
              <Input onChange={e => this.setState({ name: e.target.value })} />
            </Form.Item>
            <Form.Item label="Адрес">
              <Input
                onChange={e => this.setState({ address: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Телефон">
              <Input onChange={e => this.setState({ phone: e.target.value })} />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input onChange={e => this.setState({ email: e.target.value })} />
            </Form.Item>

            <Form.Item label="Категория">
              <Row gutter={16}>
                <Col span={24}>
                  <Select
                    onChange={categoryId => this.setState({ categoryId })}
                    defaultValue={this.state.categoryId}
                  >
                    {this.state.categories.map(cat => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Продукты каких категории будет в маркете">
              <Row gutter={16}>
                <Col span={24}>
                  <Select
                    onChange={productCategoriesIds =>
                      this.setState({ productCategoriesIds })
                    }
                    mode="multiple"
                  >
                    {this.state.productCategories.map(cat => (
                      <Select.Option value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Веб-сайт">
              <Input onChange={e => this.setState({ site: e.target.value })} />
            </Form.Item>
            <Form.Item label="Про маркет">
              <TextArea
                rows={4}
                onChange={e => this.setState({ about: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Ссылка на видео в Youtube">
              <span style={{ margin: 0, padding: 0 }}>
                Чтобы взять ссылку с Youtube, нажмите кнопку поделиться и
                копировать ссылку
              </span>
              <Input
                placeholder={"Пример: https://youtu.be/5-4TgpDYPwg"}
                onChange={e =>
                  this.setState({ youtubeVideoLink: e.target.value })
                }
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="График работы(рабочине дни)">
                  <Input
                    placeholder="9:00-18:00"
                    onChange={e =>
                      this.setState({ workdaysSchedule: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="График работы(суббота)">
                  <Input
                    placeholder="9:00-14:00"
                    onChange={e =>
                      this.setState({ saturdaySchedule: e.target.value })
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
                    onChange={e =>
                      this.setState({ sundaySchedule: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="График работы(Перерыв)">
                  <Input
                    placeholder="12:00-13:00"
                    onChange={e =>
                      this.setState({ breakSchedule: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Логотип маркета">
              <Upload fileList={[]} {...props} onChange={this.onChangeLogo}>
                <Button>
                  <Icon type="upload" /> Нажмите чтобы загрузить
                </Button>
              </Upload>
              <p>{this.state.logo === "" || this.state.logo.name}</p>
            </Form.Item>
            <Form.Item label="Фотографии маркета">
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
          <Button
            onClick={() => this.setState({ editModal: true })}
            type="primary"
          >
            <Icon type="plus" />
            Добавить маркет
          </Button>
        </Button.Group>
        <Spin tip="Подождите..." spinning={this.state.spinning}>
          <Table columns={columns} dataSource={this.state.markets} />
        </Spin>
      </Content>
    );
  }
}
