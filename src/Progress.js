import _ from 'lodash';
import { Card, Layout, PageHeader, List, Icon } from 'antd';
import React from 'react';

import io from 'socket.io-client';

class Progress extends React.Component {
  state = {
    tasks: [],
  };

  componentDidMount() {
    const id = this.props.match.params.id;

    var socket = io();
    socket.on('connect', () => {
      socket.emit('deploy', { task_id: id });
    });

    socket.on('sync', (res) => {
      console.log('sync', res);
      this.setState({ tasks: res.steps });
    });

    socket.on('task', (res) => {
      console.log('task', res);
      this.state.tasks.forEach((task, idx) => {
        if (task.step_id == res.step_id) {
          this.state.tasks[idx] = task;
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
    const statusMap = {
      finished: <Icon type="check-circle" spin style={{ color: '#37b24d' }} />,
      unfinished: null,
      running: <Icon type="loading" spin style={{ color: '#fa5252' }} />,
    };
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

export default Progress;
