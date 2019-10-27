import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { observer, inject } from 'mobx-react';

const { Sider } = Layout;

@inject('layers')
@observer
class SideMenu extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { location, layers } = this.props;

    return (
      <Sider
      >
        <div className="logo" />
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]}>
          <Menu.Item key="/deploy">
            <NavLink to="/deploy">
              <Icon type="download" />
              部署
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/notifications">
            <NavLink to="/notifications">
              <Icon type="dashboard" />
              集群管理
            </NavLink>
          </Menu.Item>
        </Menu>
        <Menu theme="dark" mode="vertical" selectable={false} onClick={(item) => {
          if (item.key === 'hosts') {
            layers.hostListVisible = true;
          }
        }}>
          <Menu.Item key="hosts">
            <Icon type="deployment-unit" />
            配置机器
          </Menu.Item>
          <Menu.Item key="settings">
            <Icon type="setting" />
            设置
          </Menu.Item>
          <Menu.SubMenu
            key="language"
            title={
              <span>
                <Icon type="global" />
                语言
              </span>
            }>
            <Menu.Item key="zh">
              简体中文
            </Menu.Item>
            <Menu.Item key="en">
              英文
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
    )
  }
}

export default withRouter(SideMenu);
