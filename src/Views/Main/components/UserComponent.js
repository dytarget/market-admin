import React, { useState, useEffect } from "react";
import { Card, Icon, Skeleton, Avatar, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import { Link } from "react-router-dom";

const url = "http://91.201.214.201:8443/";
const sex = { M: "Мужской", F: "Женский" };

export const UserComponent = ({ user, master }) => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (user) {
      setloading(false);
    }
  }, [user]);

  return (
    <div>
      <Card
        style={{ width: 300 }}
        actions={[
          <span>{sex[user.sex]}</span>,
          <Tooltip title="Посмотреть профиль">
            <Link
              to={`/users/${master ? "masters" : "clients"}/${user.username}`}
            >
              <Icon type="eye" key="look" />
            </Link>
          </Tooltip>,
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
            description={`8${user.username}`}
          />
        </Skeleton>
      </Card>
    </div>
  );
};
