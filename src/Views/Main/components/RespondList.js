import React from "react";
import { List, Avatar } from "antd";
import { Link } from "react-router-dom";
import config from "../../../config/config";

export const RespondList = ({ responds, master = false }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={Array.isArray(responds) ? responds.reverse() : []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  src={
                    item.respondedMaster.avatar
                      ? `${config.images}${item.respondedMaster.avatar.imageName}`
                      : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  }
                />
              }
              title={
                <Link to="https://ant.design">
                  {item.respondedMaster.firstName}{" "}
                  {item.respondedMaster.lastName}
                </Link>
              }
              description={
                <div>
                  <div>
                    {item.communicationHistoryInfos.map((history, index) => {
                      return (
                        history.communicationType === "MESSAGE" && (
                          <span key={index}>
                            Мастер писал{" "}
                            {item.order ? (
                              <span>
                                на заказ{" "}
                                <Link to={`/orders/orderlist/${item.order.id}`}>
                                  {item.order.id}
                                </Link>
                                {": "}
                              </span>
                            ) : (
                              ":"
                            )}
                            {history.text}
                          </span>
                        )
                      );
                    })}
                  </div>
                  <div>
                    {item.communicationHistoryInfos.map((history, index) => {
                      return (
                        history.communicationType === "CALL" && (
                          <span key={index}>
                            <p style={{ margin: 0 }}>
                              Мастер звонил: {history.created[0]}-
                              {history.created[1]}
                              {"-"}
                              {history.created[2]} {history.created[3]}:
                              {history.created[4]}
                            </p>
                          </span>
                        )
                      );
                    })}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
