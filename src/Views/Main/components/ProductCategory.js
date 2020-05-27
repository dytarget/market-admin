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
} from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { store } from "../../../store";

const url = "http://91.201.214.201:8443/";

export const ProductCategoryList = ({ list, marketId, refresh }) => {
  const [visibleProduct, setVisibleProduct] = useState(false);
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(0);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    let arr = [];
    list.map((elem) => {
      const prods = elem.products;
      prods.map((prod) => (prod.categoryName = elem.categoryName));
      arr = arr.concat(prods);
    });
    setProductList(arr);
  }, [list]);

  const createProduct = (categoryId) => {
    setModal(false);
    const { token } = store.getState().userReducer;

    Axios.post(
      `${url}api/v1/product`,
      {
        categoryId,
        cost,
        description,
        marketId,
        name,
      },
      {
        headers: {},
      }
    ).then((res) => {
      const file = new FormData();
      file.append("file", image);

      const authOptions2 = {
        method: "POST",
        url: `${url}api/v1/image/product/${res.data.id}`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: file,
      };
      Axios(authOptions2).then(() => {
        refresh();
        message.success("Успешно!");
      });
    });
  };

  const deleteProduct = (id) => {
    message.warn("Подождите");
    Axios.delete(`${url}api/v1/product/${id}`)
      .then(() => {
        message.success("Успешно удалено");
        refresh();
      })
      .catch(() => message.error("Ошибка"));
  };

  const columns = [
    {
      title: "Фото товара",
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
      title: "Удалить",
      key: "delete",
      render: (data) => (
        <Popconfirm
          onConfirm={() => deleteProduct(data.id)}
          okText="Да"
          cancelText="Нет"
          title="Удалить"
        >
          <Button type="danger">
            <Icon type="delete" />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          width: "90%",
          alignSelf: "center",
          marginVertical: 25,
          marginBottom: 40,
          borderBottomWidth: 2,
          borderColor: "#999999",
        }}
      >
        <img
          alt="product"
          src={
            product.image
              ? `http://91.201.214.201:8443/images/${product.image.imageName}`
              : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
          }
          width={270}
          height={200}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 17,
                maxWidth: "80%",
                fontWeight: "500",
              }}
            >
              {product.productName} | {product.cost}₸
            </p>
            <p style={{ maxWidth: "80%", flexShrink: 1 }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <List.Item>
        <List.Item.Meta
          avatar={
            <img
              width={300}
              height={180}
              alt="promo"
              src={
                category.image
                  ? `http://91.201.214.201:8443/images/${category.image.imageName}`
                  : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
              }
            />
          }
          title={
            <div>
              <div>
                <Link onClick={() => setVisibleProduct(true)}>
                  {category.categoryName}
                </Link>
              </div>
              <Button
                onClick={() => {
                  setModal(true);
                  setId(category.id);
                }}
              >
                Создать продукт
              </Button>
            </div>
          }
        />
      </List.Item> */}
      <Table
        bordered
        scroll={{ x: true }}
        dataSource={productList}
        columns={columns}
      />
      <Modal
        title="Создать продукт"
        visible={modal}
        okText="Создать"
        cancelText="Закрыть"
        closable={false}
        onOk={() => createProduct(id)}
        onCancel={() => setModal(false)}
      >
        <Form>
          <Form.Item label="Название">
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Описание">
            <Input onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>

          <Form.Item label="Цена">
            <Input onChange={(e) => setCost(e.target.value)} />
          </Form.Item>

          <Form.Item label="Фото">
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
