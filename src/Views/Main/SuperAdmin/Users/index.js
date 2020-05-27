import {
  Table,
  Popconfirm,
  message,
  Modal,
  Button,
  Input,
  Select,
  Icon,
  BackTop,
  Tag,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import NewUser from "./NewUser";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import UsersCategory from "./UsersCategory";
import { store } from "../../../../store";

const url = "http://91.201.214.201:8443/";

const Option = Select.Option;
const ButtonGroup = Button.Group;
const { Meta } = Card;
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_res: [],
      update_data: [{ id: "", login: "", email: "", group: "" }],
      editingKey: "",
      chModal: false,
      avatar:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      fstName: "",
      lstName: "",
      user_id: "",
      group_list: [],
      phone: "",
      paper_address: "",
      real_address: ""
    };
    this.compName = (state, lic) => {
      let result = lic;
      {
        state.map(comp => (lic === comp.id ? (result = comp.name) : comp.id));
      }
      return result;
    };
    this.columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => b.id - a.id,
        sortDirections: ["descend"],
        sortOrder: true
      },
      {
        title: "Логин",
        dataIndex: "username",
        key: "login"
      },
      {
        title: "Почта",
        dataIndex: "email",
        key: "email"
      },

      {
        title: "Группа пользователя",
        dataIndex: "group_name",
        key: "group_name",
        render: (text, record) => (
          <span>
            <Tag
              color={
                record.group_name === "Admin"
                  ? "#00474f"
                  : record.group_name === "Chief"
                  ? "#092b00"
                  : "#08979c"
              }
              key={record.id}
            >
              {record.group_name === "Admin"
                ? "Администратор"
                : record.group_name === "Client"
                ? "Клиент"
                : record.group_name === "Chief"
                ? "Начальник"
                : "Администратор"}
            </Tag>
            {record.login === "ilyas" || record.login === "diskakov" ? (
              <Tag color={"#0050b3"} key={record.id}>
                {"DEV"}
              </Tag>
            ) : record.group_name === "Admin" ? (
              <Icon type="setting" />
            ) : (
              <Icon type="user" />
            )}
          </span>
        )
      },
      {
        title: "Действия",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.data_res.length >= 1 ? (
            <div>
              <ButtonGroup>
                <Button shape="circle" onClick={() => this.changeShow(record)}>
                  <Icon type="edit" theme="twoTone" />
                </Button>
                <Modal
                  style={{ height: 100 }}
                  title="Изменить Пользователя"
                  visible={this.state.chModal}
                  onOk={() => this.handleUpdate(this.state.update_data[0])}
                  onCancel={this.changeHide}
                  okText="Изменить"
                  cancelText="Отменить"
                >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={1}>
                      <Col span={24}>
                        <Form.Item label="Логин">
                          {
                            <Input
                              type="text"
                              allowClear={true}
                              placeholder="Логин"
                              defaultValue={this.state.update_data[0].login}
                              value={this.state.update_data[0].login}
                              onChange={evt =>
                                this.handleChange(
                                  evt,
                                  this.state.update_data[0],
                                  "login"
                                )
                              }
                            />
                          }
                        </Form.Item>

                        <Form.Item label="Почта">
                          {
                            <Input
                              placeholder="Почта"
                              allowClear={true}
                              defaultValue={this.state.update_data[0].email}
                              value={this.state.update_data[0].email}
                              onChange={evt =>
                                this.handleChange(
                                  evt,
                                  this.state.update_data[0],
                                  "email"
                                )
                              }
                            />
                          }
                        </Form.Item>

                        <Form.Item label="Группа пользователя">
                          {
                            <Select
                              defaultValue={this.state.update_data[0].group}
                              value={this.state.update_data[0].group}
                              onChange={val =>
                                this.handleChange(
                                  val,
                                  this.state.update_data[0],
                                  "group"
                                )
                              }
                            >
                              {this.state.group_list.map(gr => (
                                <Option key={gr.id} value={gr.id}></Option>
                              ))}
                            </Select>
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
                <Popconfirm
                  placement="topLeft"
                  title="Удалить пользователя?"
                  onConfirm={() => this.handleDelete(record)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button type="danger" shape="circle">
                    <Icon type="delete" />
                  </Button>
                </Popconfirm>
              </ButtonGroup>
            </div>
          ) : null
      }
    ];
  }
  handleChange = (evt, updRecord, field) => {
    var data = [];
    if (field === "login") {
      data.push({
        id: updRecord.id,
        login: evt.target.value,
        email: updRecord.email,
        group: updRecord.group
      });
    }
    if (field === "email") {
      data.push({
        id: updRecord.id,
        login: updRecord.login,
        email: evt.target.value,
        group: updRecord.group
      });
    }
    if (field === "group") {
      data.push({
        id: updRecord.id,
        login: updRecord.login,
        email: updRecord.email,
        group: evt
      });
    }

    this.setState({
      update_data: data
    });
  };
  handleDelete = record => {
    //message.info("Clicked on Yes.");
    this.setState({ loading: true });
    axios({
      method: "delete",
      url: this.props.b_url + "users?id=" + record.id,
      headers: {
        credentials: "include",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + this.props.token
      }
    }).then(res => {
      this.refresh();
      this.setState({ loading: false });
      if (res.data.detailed_message !== "") {
        res.data.error_code == 0
          ? message.success(res.data.detailed_message)
          : message.error(res.data.detailed_message);
      }
    });
  };
  handleUpdate = updRecord => {
    this.setState({ loading: true });
    axios({
      method: "post",
      url:
        this.props.b_url +
        "users?id=" +
        updRecord.id +
        "&login=" +
        updRecord.login +
        "&email=" +
        updRecord.email +
        "&group_id=" +
        updRecord.group +
        "&updated_by=" +
        this.props.login,
      headers: {
        credentials: "include",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + this.props.token
      }
    }).then(res => {
      this.componentDidMount();
      this.setState({ loading: false, chModal: false });
      if (res.data.detailed_message !== "") {
        res.data.error_code == 0
          ? message.success(res.data.detailed_message)
          : message.error(res.data.detailed_message);
      }
    });
  };

  changeShow = record => {
    var data = [];
    data.push({
      id: record.id,
      login: record.login,
      email: record.email,
      group: record.group_id
    });
    this.setState({
      chModal: true,
      update_data: data
    });
  };
  changeHide = () => {
    this.setState({
      chModal: false
    });
  };

  refresh = () => {
    const { token } = store.getState().userReducer;
    this.setState({ loading: true });
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios
      .get(`${url}api/v1/user`, {
        headers
      })
      .then(res => {
        console.log(res.data);

        const result = res.data.users.filter(
          user => user.username.length !== 10
        );

        this.setState({ loading: false, data_res: result });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    return (
      <div>
        <div>
          <NewUser
            refreshClientComponent={this.refresh}
            login={this.props.login}
          />
        </div>

        <Row>
          <Col span={18}>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.state.data_res}
              pagination={{
                defaultPageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "30"]
              }}
              onChange={() => this.refresh}
              loading={this.state.loading}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    this.setState({
                      avatar: record.avatar,
                      fstName: record.first_name,
                      lstName: record.last_name,
                      user_id: record.id,
                      phone: record.phone
                    });
                  }, // click row
                  onDoubleClick: event => {}, // double click row
                  onContextMenu: event => {}, // right button click row
                  onMouseEnter: event => {}, // mouse enter row
                  onMouseLeave: event => {} // mouse leave row
                };
              }}
            />
            <BackTop />
            <strong style={{ color: "rgba(64, 64, 64, 0.6)" }} />
          </Col>
          <Col span={6}>
            {" "}
            <Card
              hoverable
              style={{ width: 200, marginLeft: 10 }}
              cover={<img alt="example" src={this.state.avatar} />}
            >
              <Meta
                title={this.state.lstName}
                description={this.state.fstName}
              />
              {this.state.phone && <p>Phone: 8{this.state.phone}</p>}
            </Card>
          </Col>
        </Row>
        <UsersCategory ParentId={this.state.user_id} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
    login: state.login,
    b_url: state.b_url,
    token: state.token
  };
};
export default connect(mapStateToProps)(Admin);
