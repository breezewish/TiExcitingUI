import _ from 'lodash';
import { Button, Card, Layout, PageHeader, List, Icon, Result } from 'antd';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { NavLink } from 'react-router-dom';

import io from 'socket.io-client';

@inject('deployments')
@observer
class Progress extends React.Component {
  state = {
    tasks: [],
    finished: false,
  };

  componentDidMount() {
    const deployId = this.props.match.params.id;
    const taskId = this.props.deployments.deployments[deployId].taskId;

    var socket = io();
    socket.on('connect', () => {
      socket.emit('deploy', { task_id: taskId });
    });

    socket.on('sync', (res) => {
      console.log('sync', res);
      if (this.state.tasks.length == 0) {
        this.setState({ tasks: res.task.steps });
      }
    });

    socket.on('task', (res) => {
      console.log('task', res);

      if (res.finish) {
        this.setState({ finished: true });
        return;
      }

      this.state.tasks.forEach((task, idx) => {
        if (task.step_id == res.step.step_id) {
          this.state.tasks[idx] = res.step;
        }
      });
      this.setState({ tasks: [...this.state.tasks] });
    });

    this.socket = socket;
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
  }

  render() {
    const deployId = this.props.match.params.id;

    const statusMap = {
      finished: <Icon type="check-circle" style={{ color: '#37b24d' }} />,
      unfinished: null,
      running: <Icon type="loading" spin style={{ color: '#fa5252' }} />,
    };
    if (this.state.finished) {
      return <Result
        status="success"
        title="集群部署成功！"
        extra={[
          <Button type="primary">
            <NavLink to={`/manage/${deployId}`}>
            查看集群详情
            </NavLink>
          </Button>
        ]}
      />;
    } else {
      return (
        <Layout>
          <Layout.Content style={{ backgroundColor: '#FFF' }}>
            <PageHeader
              title="部署进度"
              subTitle="正在部署集群..."
            />
          </Layout.Content>
          <Layout.Content style={{ padding: '20px' }}>
            <Card bordered={false}>
              <List
                bordered
                dataSource={this.state.tasks}
                renderItem={item => (
                  <List.Item style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '60px' }}>
                      {statusMap[item.status]}
                    </div>
                    <div>{item.msg}</div>
                  </List.Item>
                )}
              />
            </Card>
          </Layout.Content>
        </Layout>
      );
    }
  }
}

export default Progress;
