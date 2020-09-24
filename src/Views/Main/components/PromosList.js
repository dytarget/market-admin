import React from "react";
import { List, Avatar } from "antd";
import { Link } from "react-router-dom";
import config from "../../../config/config";

export const PromosList = ({ promos }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={promos}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <img
                  width={300}
                  height={180}
                  alt="promo"
                  src={
                    item.image
                      ? `${config.images}${item.image.imageName}`
                      : "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png"
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
