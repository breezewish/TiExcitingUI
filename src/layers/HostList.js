import { Drawer, Icon } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('layers')
@observer
class LayerHostList extends React.Component {
  render() {
    return (
      <Drawer
        closable
        title={<span><Icon type="deployment-unit" /> 配置机器</span>}
        placement="right"
        visible={this.props.layers.hostListVisible}
        onClose={() => this.props.layers.hostListVisible = false}
        zIndex={500}
      >
        <button onClick={() => this.props.layers.hostAddVisible = true}>创建机器</button>
      </Drawer>
    );
  }
}

export default LayerHostList;
