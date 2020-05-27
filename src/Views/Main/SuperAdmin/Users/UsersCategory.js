import { Tabs } from "antd";
import React, { Component } from "react";
import UsersClient from "./UsersClients";
const TabPane = Tabs.TabPane;

class UserSlidingTabs extends Component {
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
      <div>
        <Tabs defaultActiveKey="1" tabPosition={mode} style={{ height: 700 }}>
          <TabPane tab="Клиенты" key="1">
            <UsersClient ParentId={this.props.ParentId} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default UserSlidingTabs;
