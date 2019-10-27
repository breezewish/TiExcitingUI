import { Card, Tag, Button, Form, Checkbox, Icon, Typography } from 'antd';
import React from 'react';

const colors = {
  pd: 'red',
  tikv: 'orange',
  tidb: 'magenta',
  prometheus: 'cyan',
  node_exporter: 'blue',
  grafana: 'purple',
  tispark: 'gold',
};

class DeployViewTopology extends React.Component {
  render() {
    return (
      <Card
        bordered={false}
        title="查看并修改部署方案"
      >
        <Card>
          <div><p>您可以在主机之间拖动组件，从而修改部署方案，或从此区域拖动组件到主机中。</p></div>
          <div>
            <Tag color={colors['pd']}>PD</Tag>
            <Tag color={colors['tikv']}>TiKV</Tag>
            <Tag color={colors['tidb']}>TiDB</Tag>
            <Tag color={colors['prometheus']}>Prometheus</Tag>
            <Tag color={colors['node_exporter']}>NodeExporter</Tag>
            <Tag color={colors['grafana']}>Grafana</Tag>
            <Tag color={colors['tispark']}>TiSpark</Tag>
          </div>
        </Card>
      </Card>
    );
  }
}

export default DeployViewTopology;
