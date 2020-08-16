import React, { useEffect } from "react";
import {
  List,
  Drawer,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Icon,
  message,
  Table,
  Popconfirm,
  Divider,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { store } from "../../../store";
import ButtonGroup from "antd/lib/button/button-group";
import createLogs from "../../../utils/createLogs";

const url = "http://91.201.214.201:8443/";

export const ProductCategoryList = ({
  list,
  marketId,
  refresh,
  canEditUser,
}) => {
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [id, setId] = useState(0);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    let arr = [];
    list.forEach((elem) => {
      const prods = elem.products;
      prods.map((prod) => {
        prod.categoryName = elem.categoryName;
        prod.categoryId = elem.id;
        return prod;
      });
      arr = arr.concat(prods);
    });
    setProductList(arr);
  }, [list]);

  const deleteProduct = (id, name) => {
    message.warn("Подождите");
    Axios.delete(`${url}api/v1/product/${id}`)
      .then((res) => {
        createLogs(`Удалил категорию товаров ID=${name}`);

        message.success("Успешно удалено");
        refresh();
      })
      .catch(() => message.error("Ошибка"));
  };

  const updateImage = () => {
    const file = new FormData();
    file.append("file", image);
    const axiosOptions = {
      method: "POST",
      url: `${url}api/v1/image/product/${id}`,
      data: file,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    Axios(axiosOptions)
      .then(() => {
        message.success("Успешно отредактировано");
        setVisibleUpdate(false);
        refresh();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(() => message.error("Ошибка"));
  };

  const updateProduct = () => {
    message.warn("Подождите");
    Axios.patch(`${url}api/v1/product/${id}`, {
      categoryId,
      cost,
      description,
      name,
    })
      .then((res) => {
        if (image === "") {
          createLogs(`Обновил категорию товаров ID=${res.data.id}`);
          setTimeout(() => window.location.reload(), 1000);

          message.success("Успешно отредактировано");
          setVisibleUpdate(false);

          refresh();
        } else {
          createLogs(`Обновил категорию товаров ID=${res.data.id}`);

          updateImage();
        }
      })
      .catch(() => message.error("Ошибка"));
  };

  const columns = [
    {
      title: "Фото товара",
      width: 230,
      render: (data) => {
        return (
          <img
            alt="product"
            src={
              data.image
                ? `http://91.201.214.201:8443/images/${data.image.imageName}`
                : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
            }
            width={210}
            height={150}
          />
        );
      },
      key: "nothing",
    },
    {
      title: "Категория товара",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Название",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      width: 130,
    },
    {
      title: "Цена",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Действия",
      key: "operations",
      render: (record) =>
        canEditUser && (
          <ButtonGroup>
            <Button
              onClick={() => {
                setVisibleUpdate(true);
                setDescription(record.description);
                setId(record.id);
                setName(record.productName);
                setCost(record.cost);
                setCategoryId(record.categoryId);
              }}
              type="primary"
            >
              <Icon type="edit" />
            </Button>
            <Popconfirm
              onConfirm={() => deleteProduct(record.id, record.productName)}
              okText="Да"
              cancelText="Нет"
              title="Удалить"
            >
              <Button type="danger">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </ButtonGroup>
        ),
    },
  ];

  return (
    <div>
      <Table
        bordered
        scroll={{ x: "calc(700px + 50%)", y: 500 }}
        dataSource={productList}
        columns={columns}
      />
      <Modal
        title="Редактировать Продукт"
        visible={visibleUpdate}
        okText="Редактировать"
        cancelText="Закрыть"
        closable={false}
        onOk={updateProduct}
        onCancel={() => setVisibleUpdate(false)}
      >
        <Form>
          <Form.Item label="Название">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Описание">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Цена">
            <Input value={cost} onChange={(e) => setCost(e.target.value)} />
          </Form.Item>

          <Form.Item label="Новое Фото">
            <Upload
              fileList={[]}
              onChange={(info) => setImage(info.file.originFileObj)}
            >
              <Button>
                <Icon type="upload" /> Нажмите чтобы загрузить
              </Button>
            </Upload>
            <p>{image === "" || image.name}</p>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
