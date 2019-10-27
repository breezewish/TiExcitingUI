import _ from 'lodash';
import { Modal, Card, Empty, Button, Icon } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import HostView from '../components/HostView';

@inject('layers', 'hosts')
@observer
class DeployHost extends React.Component {
  state = {
    hostChecks: {},
  };

  handleCheckedHostsChange = (hostChecks) => {
    this.setState({ hostChecks });
  }

  handleSelectAll = () => {
    const checks = {};
    _.forEach(this.props.hosts.hosts, host => checks[host.id] = true);
    this.setState({ hostChecks: checks });
  }

  handleDeSelectAll = () => {
    this.setState({ hostChecks: {} });
  }

  handleNext = () => {
    const hostIds = [];
    for (let id in this.state.hostChecks) {
      if (this.state.hostChecks[id]) {
        hostIds.push(id);
      }
    }
    if (hostIds.length === 0) {
      Modal.error({
        title: '操作失败',
        content: '请选择至少一个目标机器用于部署 TiDB 集群',
      });
      return;
    }
    if (this.props.onNextStep) {
      this.props.onNextStep(hostIds);
    }
  }

  render() {
    const hasHosts = Object.keys(this.props.hosts.hosts).length > 0;
    return (
      <Card
        bordered={false}
        title="请选择部署 TiDB 集群的目标机器"
        bodyStyle={{ padding: 0 }}
        extra={
          <Button.Group>
            <Button onClick={() => this.props.layers.hostListVisible = true}>配置机器</Button>
            <Button onClick={() => this.props.layers.hostAddVisible = true}>创建机器</Button>
            <Button onClick={this.handleSelectAll}>全选</Button>
            <Button onClick={this.handleDeSelectAll}>取消全选</Button>
          </Button.Group>
        }
      >
        { !hasHosts ? (
          <Empty description="您还没有配置机器">
            <Button type="primary" onClick={() => this.props.layers.hostAddVisible = true}>添加机器</Button>
          </Empty>
        ) : (
          <>
            <HostView
              hosts={this.props.hosts.hosts}
              checkable
              onCheckedHostsChange={this.handleCheckedHostsChange}
              checkedHosts={this.state.hostChecks}
            />
            <div style={{ padding: '16px' }}>
              <Button type="primary" onClick={this.handleNext}>保存并选择组件 <Icon type="right" /></Button>
            </div>
          </>
        ) }
      </Card>
    );
  }
}

export default DeployHost;
