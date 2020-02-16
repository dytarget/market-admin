import React from "react";
import { List, Avatar } from "antd";
import { Link } from "react-router-dom";

export const PromosList = ({ promos }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={promos}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  src={
                    item.image
                      ? `http://91.201.214.201:8443/images/${item.image.imageName}`
                      : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  }
                />
              }
              title={
                <span>
                  Переходная ссылка:
                  <Link onClick={() => window.open(item.link)}>
                    {item.link}
                  </Link>
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
