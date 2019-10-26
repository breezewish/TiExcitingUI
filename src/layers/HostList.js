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

  handleHostCheckChange = (id, checked) => {
    this.setState({
      hostChecks: {
        ...this.state.hostChecks,
        [id]: checked,
      },
    });
  };

  handleRackCheckChange = (dcName, rackName, checked) => {
    const checks = {};
    _(this.props.hosts.hosts).forEach(host => {
      if (host.dc === dcName && host.rack === rackName) {
        checks[host.id] = checked;
      }
    });
    this.setState({
      hostChecks: {
        ...this.state.hostChecks,
        ...checks,
      },
    });
  };

  handleDcCheckChange = (dcName, checked) => {
    const checks = {};
    _(this.props.hosts.hosts).forEach(host => {
      if (host.dc === dcName) {
        checks[host.id] = checked;
      }
    });
    this.setState({
      hostChecks: {
        ...this.state.hostChecks,
        ...checks,
      },
    });
  };

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
          <Button type="primary" onClick={() => this.props.layers.hostAddVisible = true}>创建机器</Button>
        </Layout.Content>
        <HostView
          hosts={this.props.hosts.hosts}
          clickable
          checkable
          onHostClick={(item) => console.log(item)}
          onHostCheckChange={this.handleHostCheckChange}
          onRackCheckChange={this.handleRackCheckChange}
          onDcCheckChange={this.handleDcCheckChange}
          checkedHosts={this.state.hostChecks}
        />
      </Drawer>
    );
  }
}

export default LayerHostList;
