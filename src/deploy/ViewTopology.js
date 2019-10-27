import _ from 'lodash';
import { Card, Tag, Button, Form, Checkbox, Icon, Typography } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import HostView from '../components/HostView';

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

@inject('hosts')
@observer
class DeployViewTopology extends React.Component {
  handleNext = () => {
    if (this.props.onNextStep) {
      this.props.onNextStep();
    }
  }

  render() {
    if (!this.props.topo) {
      return null;
    }

    const filteredHosts = _(this.props.hosts.hosts)
      .toPairs()
      .filter((kv) => kv[0] in this.props.topo)
      .fromPairs()
      .value();

    const hostChildren = {};
    for (let id in this.props.topo) {
      const t = [];
      for (let c in this.props.topo[id]) {
        if (this.props.topo[id][c]) {
          t.push(componentTags[c]);
        }
      }
      hostChildren[id] = t;
    }

    return (
      <Card
        bordered={false}
        title="查看并修改部署方案"
        bodyStyle={{ padding: 0 }}
      >
        <Card>
          <div><p>您可以在主机之间拖动组件，从而修改部署方案，或从此区域拖动组件到主机中。</p></div>
          <div>{Object.values(componentTags)}</div>
        </Card>
        <HostView
          hosts={filteredHosts}
          hostChildren={hostChildren}
        />
        <div style={{ padding: '16px' }}>
          <Button type="primary" onClick={this.handleNext} loading={this.props.inProgress}>开始部署 <Icon type="right" /></Button>
        </div>
      </Card>
    );
  }
}

export default DeployViewTopology;
