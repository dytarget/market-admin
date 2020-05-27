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
  Col
} from "antd";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { connect } from "react-redux";

const Option = Select.Option;
const ButtonGroup = Button.Group;

class UserClientView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_res: [],
      client_list: [],
      client_id: "",
      user_id: ""
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
        title: "Наименование",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <Link to={"/ClientDetail/" + record.customer_id}>{text}</Link>
        )
      },
      {
        title: "Дата добавления",
        dataIndex: "created",
        key: "created"
      },
      {
        title: "Кем добавлен",
        dataIndex: "created_by",
        key: "created_by"
      },
      {
        title: "БИН",
        dataIndex: "bin",
        key: "bin"
      },
      {
        title: "Статус",
        dataIndex: "status",
        key: "status",
        render: (text, record) => (
          <span>
            <Tag
              color={record.status == "Активный" ? "green" : "volcano"}
              key={record.id}
            >
              {record.status}
            </Tag>
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
                <Popconfirm
                  placement="topLeft"
                  title="Удалить клиента?"
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

  handleDelete = record => {
    //message.info("Clicked on Yes.");
    this.setState({ loading: true });
    axios({
      method: "delete",
      url: this.props.b_url + "users_customer?id=" + record.id,
      headers: {
        credentials: "include",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + this.props.token
      }
    }).then(res => {
      this.refresh(this.props.ParentId);
      this.setState({ loading: false });
      if (res.data.detailed_message !== "") {
        res.data.error_code == 0
          ? message.success(res.data.detailed_message)
          : message.error(res.data.detailed_message);
      }
    });
  };

  addClient = () => {
    axios({
      method: "post",
      url:
        this.props.b_url +
        "users_customer?customer_id=" +
        this.state.client_id +
        "&user_id=" +
        this.props.ParentId +
        "&created_by=" +
        this.props.login,
      headers: {
        credentials: "include",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + this.props.token
      }
    }).then(res => {
      if (res.data.detailed_message !== "") {
        this.refresh(this.props.ParentId);
        res.data.error_code == 0
          ? message.success(res.data.detailed_message)
          : message.error(res.data.detailed_message);
      }
    });
  };
  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps.ParentId);
  }
  refresh = ParentId => {};
  componentDidMount() {}
  clientOnChange = val => {
    this.setState({ client_id: val });
  };
  render() {
    return (
      <div>
        <div>
          <Form layout="vertical" hideRequiredMark>
            <Form.Item label="Добавление клиентов">
              <Row gutter={6}>
                <Col span={6}>
                  <Select onChange={this.clientOnChange}>
                    {this.state.client_list.map(client => (
                      <Option key={client.id} value={client.id}>
                        {client.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <ButtonGroup>
                    <Button type="primary" onClick={this.addClient}>
                      <Icon type="plus" />
                    </Button>
                    <Button onClick={() => this.refresh(this.props.ParentId)}>
                      <Icon type="reload" />
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={this.state.data_res}
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"]
          }}
          onChange={() => this.refresh(this.props.ParentId)}
          loading={this.state.loading}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {}, // click row
              onDoubleClick: event => {}, // double click row
              onContextMenu: event => {}, // right button click row
              onMouseEnter: event => {}, // mouse enter row
              onMouseLeave: event => {} // mouse leave row
            };
          }}
        />
        <BackTop />
        <strong style={{ color: "rgba(64, 64, 64, 0.6)" }} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    login: state.login,
    b_url: state.b_url,
    token: state.token
  };
};
export default connect(mapStateToProps)(UserClientView);
