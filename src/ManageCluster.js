import _ from 'lodash';
import { Layout, Menu, Icon, Card, Tag } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import HostView from './components/HostView';

const colors = {
  pd: 'red',
  tikv: 'orange',
  tidb: 'magenta',
  prometheus: 'cyan',
  node_exporter: 'blue',
  grafana: 'purple',
  tispark: 'gold',
};

const componentTags = {
  pd: <Tag key="pd" color={colors['pd']}>PD</Tag>,
  tikv: <Tag key="tikv" color={colors['tikv']}>TiKV</Tag>,
  tidb: <Tag key="tidb" color={colors['tidb']}>TiDB</Tag>,
  prometheus: <Tag key="prometheus" color={colors['prometheus']}>Prometheus</Tag>,
  node_exporter: <Tag key="node_exporter" color={colors['node_exporter']}>NodeExporter</Tag>,
  grafana: <Tag key="grafana" color={colors['grafana']}>Grafana</Tag>,
  tispark: <Tag key="tispark" color={colors['tispark']}>TiSpark</Tag>,
};


@inject('deployments', 'hosts')
@observer
class ManageCluster extends React.Component {
  state = {
    activeDeployId: null,
  }

  componentDidMount() {
    const deployId = this.props.match.params.id;
    if (deployId) {
      this.setState({ activeDeployId: deployId });
    }
  }

  handleClick = (e) => {
    this.setState({ activeDeployId: e.key });
  }

  renderChild(deployId) {
    const deploy = this.props.deployments.deployments[deployId];
    console.log(toJS(deploy));
    const filteredHosts = _(this.props.hosts.hosts)
      .toPairs()
      .filter((kv) => kv[0] in deploy.topology)
      .fromPairs()
      .value();

    const hostChildren = {};
    for (let id in deploy.topology) {
      const t = [];
      for (let c in deploy.topology[id]) {
        if (deploy.topology[id][c]) {
          t.push(componentTags[c]);
        }
      }
      hostChildren[id] = t;
    }

    return (
      <Card
        bordered={false}
        title="集群拓扑"
        bodyStyle={{ padding: 0 }}
      >
        <HostView
          hosts={filteredHosts}
          hostChildren={hostChildren}
        />
      </Card>
    );
  }

  render() {
    let content = null;
    if (this.state.activeDeployId) {
      content = this.renderChild(this.state.activeDeployId);
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Sider theme="light">
          <Menu
            onClick={this.handleClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            { _.map(this.props.deployments.deployments, d => {
              return (
                <Menu.Item key={d.id}>
                  <NavLink to={`/manage/${d.id}`}>
                      {d.id}
                  </NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content style={{ padding: '20px' }}>
          {content}
        </Layout.Content>
      </Layout>
    );
  }
}

export default ManageCluster;
