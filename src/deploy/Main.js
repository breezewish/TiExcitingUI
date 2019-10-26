import { Layout, PageHeader, Tabs } from 'antd';
import React from 'react';
import DeployMachines from './Machines';

export default class DeployMain extends React.Component {
  state = {
    tabKey: 'machines',
  };

  render() {
    const contents = {
      machines: (<DeployMachines />),
      components: (<p>b</p>),
    };

    return (
      <Layout>
        <Layout.Content style={{ backgroundColor: '#FFF' }}>
          <PageHeader
            title="部署"
            subTitle="部署一个新的 TiDB / TiKV 集群"
            footer={
              <Tabs
                defaultActiveKey="1"
                animated={false}
                onChange={(tabKey) => this.setState({ tabKey })}
              >
                <Tabs.TabPane tab="目标机器" key="machines" />
                <Tabs.TabPane tab="组件" key="components" />
              </Tabs>
            }
          />
        </Layout.Content>
        <Layout.Content style={{ padding: '20px' }}>
          {contents[this.state.tabKey]}
        </Layout.Content>
      </Layout>
    );
  }
}
