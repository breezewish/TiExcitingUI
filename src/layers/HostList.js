import _ from 'lodash';
import { Drawer, Icon, Layout, Button } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import HostView from '../components/HostView';

@inject('layers', 'hosts')
@observer
class LayerHostList extends React.Component {
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

  render() {
    return (
      <Drawer
        closable
        title={<span><Icon type="deployment-unit" /> 配置机器</span>}
        placement="right"
        visible={this.props.layers.hostListVisible}
        onClose={() => this.props.layers.hostListVisible = false}
        zIndex={500}
        width="100vw"
        drawerStyle={{ background: '#f0f2f5' }}
        bodyStyle={{ padding: 0 }}
      >
        <Layout.Content style={{ background: '#FFF', padding: '16px' }}>
          <Button type="primary" onClick={() => this.props.layers.hostAddVisible = true} style={{ marginRight: '10px' }}>创建机器</Button>
          <Button.Group style={{ marginRight: '10px' }}>
            <Button onClick={this.handleSelectAll}>全选</Button>
            <Button onClick={this.handleDeSelectAll}>取消全选</Button>
          </Button.Group>
          <Button.Group style={{ marginRight: '10px' }}>
            <Button>批量编辑</Button>
            <Button>批量删除</Button>
          </Button.Group>
        </Layout.Content>
        <HostView
          hosts={this.props.hosts.hosts}
          clickable
          checkable
          onHostClick={(item) => console.log(item)}
          onCheckedHostsChange={this.handleCheckedHostsChange}
          checkedHosts={this.state.hostChecks}
        />
      </Drawer>
    );
  }
}

export default LayerHostList;
