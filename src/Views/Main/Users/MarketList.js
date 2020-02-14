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
  message
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { store } from "../../../store";
import TextArea from "antd/lib/input/TextArea";

const url = "https://cors-anywhere.herokuapp.com/http://91.201.214.201:8443/";
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
    title: "Специализации",
    dataIndex: "category",
    key: "category",
    render: category => <span>{category.categoryName}</span>
  },
  //   {
  //     title: "Номер телефона",
  //     dataIndex: "username",
  //     key: "username",
  //     render: username => {
  //       const usernameMatch = username.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  //       const phoneNumber =
  //         "(" +
  //         usernameMatch[1] +
  //         ") " +
  //         usernameMatch[2] +
  //         "-" +
  //         usernameMatch[3] +
  //         "-" +
  //         usernameMatch[4];

  //       return <span>8-{phoneNumber}</span>;
  //     }
  //   },
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

        this.setState({ spinning: false, markets: res.data.users });
      })
      .catch(err => {
        console.log(err);
      });
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
          onOk={() => this.setState({ editModal: false })}
          onCancel={() => this.setState({ editModal: false })}
        >
          <Form>
            <Form.Item label="Название маркета">
              <Input onChange={e => this.setState({ name: e.target.value })} />
            </Form.Item>
            <Form.Item label="Адерс">
              <Input
                onChange={e => this.setState({ address: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input onChange={e => this.setState({ email: e.target.value })} />
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
                onChange={e => this.setState({ site: e.target.value })}
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
                      this.setState({ sundaySchedule: e.target.value })
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
