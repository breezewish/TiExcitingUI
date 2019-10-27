import _ from 'lodash';
import { Layout, PageHeader, Tabs } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import DeployHosts from './Hosts';
import DeployComponents from './Components';
import DeployViewTopology from './ViewTopology';

class Hider extends React.Component {
  render() {
    return (
      <div style={{ display: this.props.show ? 'block' : 'none' }}>{this.props.children}</div>
    )
  }
}

function allocateOnLightestNode(topos, component) {
  let minValue = Number.MAX_VALUE;
  let minNodeId = null;

  for (let id in topos) {
    if (topos[id][component]) {
      continue;
    }
    const components = _.filter(Object.values(topos[id])).length;
    if (components < minValue) {
      minValue = components;
      minNodeId = id;
    }
  }

  if (minNodeId) {
    topos[minNodeId][component] = true;
  }
}

function organizeComponents(hosts, componentsOriginal) {
  const components = {...componentsOriginal};
  delete components.supervise;
  if (components.metrics) {
    components.prometheus = true;
    components.node_exporter = true;
    components.grafana = true;
    delete components.metrics;
  }
  if (hosts.length === 0) {
    throw new Error('必须选择至少一个目标机器部署 TiDB 组件');
  }
  const topo = {};
  hosts.forEach(id => topo[id] = {});
  if (hosts.length === 1) {
    // 1 machine, put all in one
    topo[hosts[0]] = components;
    return topo;
  }

  if (components.node_exporter) {
    hosts.forEach(id => topo[id].node_exporter = true);
    delete components.node_exporter;
  }

  if (hosts.length === 2) {
    // 2 machine: Each component (except for the node_exporter) distributes on 1 node.
    for (let key in components) {
      if (components[key]) {
        allocateOnLightestNode(topo, key);
      }
    }
    return topo;
  }
  // Otherwise (>= 3):
  // If tidb, allocate half of the machine for TiDB and half of the machine for TiKV.
  // If not, allocate all mechines for TiKV.
  let tikvInstances = Math.max(hosts.length, 3);
  if (components.tidb) {
    tikvInstances = Math.max(~~(hosts.length / 2), 3);
  }
  for (let i = 0; i < tikvInstances; i++) {
    allocateOnLightestNode(topo, 'tikv');
  }
  components.tikv = false;
  for (let i = 0; i < 3; i++) {
    allocateOnLightestNode(topo, 'pd');
  }
  components.pd = false;
  if (components.tidb) {
    let tidbInstances = ~~(hosts.length / 2);
    for (let i = 0; i < tidbInstances; i++) {
      allocateOnLightestNode(topo, 'tidb');
    }
    components.tidb = false;
  }
  for (let key in components) {
    if (components[key]) {
      allocateOnLightestNode(topo, key);
    }
  }
  return topo;
}

@inject('hosts')
@observer
class DeployMain extends React.Component {
  // state = {
  //   tabKey: 'hosts',
  //   hosts: [],
  // };

  state = {
    tabKey: 'components',
    hosts: [this.props.hosts.hosts[Object.keys(this.props.hosts.hosts)[0]].id],
    topo: null,
  };

  render() {
    return (
      <Layout>
        <Layout.Content style={{ backgroundColor: '#FFF' }}>
          <PageHeader
            title="部署"
            subTitle="部署一个新的 TiDB / TiKV 集群"
            footer={
              <Tabs
                animated={false}
                onChange={(tabKey) => this.setState({ tabKey })}
                activeKey={this.state.tabKey}
              >
                <Tabs.TabPane tab="1. 目标机器" key="hosts" />
                <Tabs.TabPane tab="2. 组件" key="components" disabled={this.state.hosts.length === 0} />
                <Tabs.TabPane tab="3. 部署方案" key="view_topo" disabled={!this.state.topo} />
              </Tabs>
            }
          />
        </Layout.Content>
        <Layout.Content style={{ padding: '20px' }}>
          <Hider show={this.state.tabKey === 'hosts'}>
            <DeployHosts onNextStep={ids => {
              this.setState({ hosts: ids, tabKey: 'components' });
            }}/>
          </Hider>
          <Hider show={this.state.tabKey === 'components'}>
            <DeployComponents onNextStep={configs => {
              const topo = organizeComponents(this.state.hosts, {
                ...configs,
                pd: true,
                tikv: true,
              });
              this.setState({ tabKey: 'view_topo', topo });
            }}/>
          </Hider>
          <Hider show={this.state.tabKey === 'view_topo'}>
            <DeployViewTopology topo={this.state.topo} />
          </Hider>
        </Layout.Content>
      </Layout>
    );
  }
}

export default DeployMain;
