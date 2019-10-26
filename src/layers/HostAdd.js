import { Drawer, Form, Input, Checkbox, Button, Select, Typography, Divider } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

@inject('hosts')
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
        <Form.Item label="从现有主机配置复制">
          <Select
            showSearch
            placeholder="选择主机"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            optionLabelProp="label"
            onChange={this.handleTemplateChange}
            value={this.state.templateValue}
          >
            {Object.values(this.props.hosts.hosts).map(v => {
              return (
                <Select.Option value={v} label={v.name} key={v.name}>
                  <div>{v.name}</div>
                  <div><Typography.Text disabled>{v.username}@{v.host}:{v.port}</Typography.Text></div>
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Divider />
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
        <div>
          <Button type="primary" onClick={this.handleSubmit}>添加</Button>
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
      >
        <AddFormWrapper onSubmit={this.handleSubmit} />
      </Drawer>
    );
  }
}


export default LayerHostAdd;
