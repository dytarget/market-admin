import React from "react";
import { List, Avatar, Rate } from "antd";
import { Link } from "react-router-dom";
import config from "../../../config/config";

export const CommentsList = ({ comments }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  src={
                    item.user && item.user.avatar
                      ? `${config.images}${item.user.avatar.imageName}`
                      : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  }
                />
              }
              title={
                <div>
                  <Link to="https://ant.design">
                    {item.user.firstName} {item.user.lastName}
                  </Link>
                  <Rate
                    style={{ marginLeft: 20 }}
                    disabled
                    value={item.rating}
                  />
                </div>
              }
              description={
                <div>
                  <div>{item.text}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
