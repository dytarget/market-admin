import React, { useState, useEffect } from "react";
import { Card, Icon, Skeleton, Avatar, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";

const url = "http://91.201.214.201:8443/";
const sex = { M: "Мужской", F: "Женский" };

export const UserComponent = ({ user }) => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (user) {
      setloading(false);
    }
  }, []);

  return (
    <div>
      <Card
        style={{ width: 300}}
        actions={[
          <span>{sex[user.sex]}</span>,
          <Tooltip title="Посмотреть профиль">
            <Icon type="eye" key="look" />
          </Tooltip>
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={
              <Avatar
                src={
                  user.avatar
                    ? `http://91.201.214.201:8443/images/${user.avatar.imageName}`
                    : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                }
              />
            }
            title={`${user.firstName} ${user.lastName}`}
            description={user.notes}
          />
        </Skeleton>
      </Card>
    </div>
  );
};
