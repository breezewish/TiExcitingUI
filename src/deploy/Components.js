import { Card, Button, Form, Checkbox, Icon } from 'antd';
import React from 'react';

class DeployComponents extends React.Component {
  handleNext = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.onNextStep) {
          this.props.onNextStep(values);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        bordered={false}
        title="请选择需要部署的 TiDB 组件"
      >
        <Form layout="vertical">
        <Form.Item extra="PD 组件负责协调事务与调度数据，必选">
            <Checkbox disabled checked>PD</Checkbox>
          </Form.Item>
          <Form.Item extra="TiKV 组件负责存储数据，必选">
            <Checkbox disabled checked>TiKV</Checkbox>
          </Form.Item>
          <Form.Item extra="TiDB 组件提供 SQL 层计算功能，若不勾选则只部署 KV 数据库">
            {getFieldDecorator('tidb', {
              valuePropName: 'checked',
              initialValue: true,
            })(
            <Checkbox>TiDB</Checkbox>
            )}
          </Form.Item>
          <Form.Item extra="收集并存储所有组件及节点的监控，并提供可视化界面展示">
            {getFieldDecorator('metrics', {
              valuePropName: 'checked',
              initialValue: true,
            })(
            <Checkbox>监控（Prometheus、Node Exporter 及 Grafana）</Checkbox>
            )}
          </Form.Item>
          <Form.Item extra="TiSpark 组件可以计算大型分析型 SQL（OLAP）">
            {getFieldDecorator('tispark', {
              valuePropName: 'checked',
              initialValue: false,
            })(
            <Checkbox>TiSpark</Checkbox>
            )}
          </Form.Item>
          <Form.Item extra="在组件进程崩溃时基于 Supervise 自动重启组件（注：不会开机自启动）">
            {getFieldDecorator('supervise', {
              valuePropName: 'checked',
              initialValue: true,
            })(
            <Checkbox>Supervise 进程守护</Checkbox>
            )}
          </Form.Item>
          <Button type="primary" onClick={this.handleNext}>保存并预览部署方案 <Icon type="right" /></Button>
        </Form>
      </Card>
    );
  }
}

const Wrapper = Form.create({ name: 'deploy_components' })(DeployComponents);

export default Wrapper;
