import { Card, Empty, Button } from 'antd';
import React from 'react';

export default class DeployMachines extends React.Component {
  render() {
    return (
      <Card bordered={false} title="请选择部署 TiDB 集群的目标机器">
        <Empty description="您还没有配置机器">
          <Button type="primary">添加机器</Button>
        </Empty>
      </Card>
    );
  }
}
