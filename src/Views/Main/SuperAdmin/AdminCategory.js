import { Tabs } from "antd";
import React, { Component } from "react";
import Users from "./Users";
const TabPane = Tabs.TabPane;

class AdminSlidingTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "top"
    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  render() {
    const { mode } = this.state;
    return (
      <div style={{ padding: "0 50px" }}>
        <Tabs defaultActiveKey="1" tabPosition={mode}>
          <TabPane tab="Пользователи" key="1">
            <Users />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default AdminSlidingTabs;
