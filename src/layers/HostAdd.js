import { Drawer, Form, Input, Checkbox, Button, Select, Typography, Collapse } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

@inject('hosts')
@observer
class AddForm extends React.Component {
  state = {
    isPubKeyAuth: false,
    templateValue: undefined,
  };

  handleChangeAuthMethod = e => {
    this.setState({
      isPubKeyAuth: e.target.checked,
    });
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.onSubmit) {
          this.props.onSubmit(values);
        }
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      templateValue: undefined,
    });
  };

  handleTemplateChange = (value) => {
    let v = toJS(value);
    this.setState({
      templateValue: v,
    });
    this.props.form.setFieldsValue({
      ...v,
      name: '',
      host: '',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="vertical">
        <Collapse bordered={false} defaultActiveKey={['import', 'basic']}>
          <Collapse.Panel header="导入模板" key="import">
            <Form.Item label="从现有主机配置复制">
              <Select
                showSearch
                placeholder="选择主机"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const v = option.props.label.toLowerCase() + '|' + option.props.value.username + '@' + option.props.value.host + ':' + option.props.value.port;
                  return v.indexOf(input.toLowerCase()) >= 0;
                }}
                optionLabelProp="label"
                onChange={this.handleTemplateChange}
                value={this.state.templateValue}
              >
                {Object.values(this.props.hosts.hosts).map(v2 => {
                  const v = toJS(v2);
                  return (
                    <Select.Option value={v} label={v.name} key={v.id}>
                      <div>{v.name}</div>
                      <div><Typography.Text disabled>{v.username}@{v.host}:{v.port}</Typography.Text></div>
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header="详细配置" key="basic">
            <Form.Item label="唯一名称">
              {getFieldDecorator('name')(
                <Input placeholder="留空自动生成" />
              )}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator('host', {
                rules: [
                  {
                    required: true,
                    message: '请输入主机地址',
                  },
                ],
              })(
                <Input placeholder="主机地址，IP 或域名" />
              )}
            </Form.Item>
            <Form.Item label="端口">
              {getFieldDecorator('port', {
                rules: [
                  {
                    required: true,
                    message: '请输入端口',
                  },
                ],
                initialValue: '22',
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="登录用户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入登录用户名',
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('isPubKeyAuth', {
                initialValue: false,
              })(
                <Checkbox checked={this.state.isPubKeyAuth} onChange={this.handleChangeAuthMethod}>使用私钥登录</Checkbox>
              )}
            </Form.Item>
            {this.state.isPubKeyAuth ? (
              <>
                <Form.Item label="私钥">
                  {getFieldDecorator('privateKey', {
                    rules: [
                      {
                        required: true,
                        message: '请输入私钥',
                      },
                    ],
                  })(
                    <Input.TextArea />
                  )}
                </Form.Item>
                <Form.Item label="私钥密码">
                  {getFieldDecorator('privateKeyPassword')(
                    <Input.Password />
                  )}
                </Form.Item>
              </>
            ) : (
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入登录密码',
                    },
                  ],
                })(
                  <Input.Password />
                )}
              </Form.Item>
            )}
          </Collapse.Panel>
          <Collapse.Panel header="高级配置" key="advanced">
            <Form.Item label="位置标签: DC">
              {getFieldDecorator('dc', {
                initialValue: '',
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="位置标签: Rack">
              {getFieldDecorator('rack', {
                initialValue: '',
              })(
                <Input />
              )}
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
        <div style={{ margin: '16px' }}>
          <Button type="primary" onClick={this.handleSubmit}>添加</Button>&nbsp;
          <Button onClick={this.handleReset}>重置</Button>
        </div>
      </Form>
    );
  }
}

const AddFormWrapper = Form.create({ name: 'add_form' })(AddForm);

@inject('layers', 'hosts')
@observer
class LayerHostAdd extends React.Component {
  handleSubmit = values => {
    if (this.props.hosts.addHost(values)) {
      this.props.layers.hostAddVisible = false;
    }
  }

  render() {
    return (
      <Drawer
        closable
        destroyOnClose
        title="添加 SSH 远程主机"
        placement="right"
        visible={this.props.layers.hostAddVisible}
        onClose={() => this.props.layers.hostAddVisible = false}
        zIndex={501}
        width={400}
        bodyStyle={{ padding: 0 }}
      >
        <AddFormWrapper onSubmit={this.handleSubmit} />
      </Drawer>
    );
  }
}


export default LayerHostAdd;
