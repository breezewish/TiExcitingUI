import { Icon, Col, Row, Card, Typography, Checkbox, Empty, Button } from 'antd';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import './HostView.less';

@observer
class VisDc extends React.Component {
  render() {
    return (
      <div className="host-view-vis-dc">
        <div className="host-view-vis-dc-title">
          {this.props.checkable ? (
            <Checkbox
              onChange={this.props.onCheckChange}
              indeterminate={this.props.checkIndeterminate}
              checked={this.props.checked}
              style={{ marginRight: '10px' }}
            />
          ) : null}
          <Icon type="cloud" /> 机房：{this.props.dcName || '默认'}
        </div>
        <div className="host-view-vis-dc-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

@observer
class VisRack extends React.Component {
  render() {
    return (
      <Card
        title={<>
          {this.props.checkable ? (
            <Checkbox
              onChange={this.props.onCheckChange}
              indeterminate={this.props.checkIndeterminate}
              checked={this.props.checked}
              style={{ marginRight: '10px' }}
            />
          ) : null}
          <Icon type="database" /> 机架：{this.props.rackName || '默认'}
        </>}
        // bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        {this.props.children}
      </Card>
    );
  }
}

@observer
class VisHost extends React.Component {
  handleClick = () => {
    if (this.props.clickable && this.props.onClick) {
      this.props.onClick(this.props.host);
    }
  }

  render() {
    return (
      <div className={classNames(["host-view-vis-host", { clickable: this.props.clickable }])} key={this.props.host.id} onClick={this.handleClick}>
        {this.props.checkable ? (
          <Checkbox
            onChange={this.props.onCheckChange}
            checked={this.props.checked}
            style={{ marginRight: '10px' }}
          />
        ) : null}
        <div className="host-view-vis-host-content">
          <div><Typography.Text>{ this.props.host.name }</Typography.Text></div>
          <div><Typography.Text disabled>{ this.props.host.username }@{ this.props.host.host }:{ this.props.host.port }</Typography.Text></div>
        </div>
      </div>
    );
  }
}

@observer
class HostView extends React.Component {
  updateCheckedHost = (checked) => {
    if (this.props.onCheckedHostsChange) {
      this.props.onCheckedHostsChange(checked);
    }
  }

  handleHostCheckChange = (id, checked) => {
    this.updateCheckedHost({
      ...this.props.checkedHosts,
      [id]: checked,
    });
  };

  handleRackCheckChange = (dcName, rackName, checked) => {
    const checks = {};
    _(this.props.hosts).forEach(host => {
      if (host.dc === dcName && host.rack === rackName) {
        checks[host.id] = checked;
      }
    });
    this.updateCheckedHost({
      ...this.props.checkedHosts,
      ...checks
    });
  };

  handleDcCheckChange = (dcName, checked) => {
    const checks = {};
    _(this.props.hosts).forEach(host => {
      if (host.dc === dcName) {
        checks[host.id] = checked;
      }
    });
    this.updateCheckedHost({
      ...this.props.checkedHosts,
      ...checks
    });
  };

  render() {
    const numberOfHosts = Object.keys(this.props.hosts).length;

    if (numberOfHosts === 0) {
      return (
        <div style={{ padding: '50px' }}>
          <Empty description="您还没有配置机器"></Empty>
        </div>
      );
    }

    // Group hosts by DC and Rack
    const groupByDc = _(this.props.hosts)
      .groupBy('dc')
      .toPairs()
      .map((kv) => {
        return [kv[0], _(kv[1])
          .groupBy('rack')
          .toPairs()
          .sortBy(0)
          .value()];
      })
      .sortBy(0)
      .value();

    const allDcs = {};
    const allRacks = {};
    const dcCheckStates = {};
    const rackCheckStates = {};

    if (this.props.checkable) {
      _.forEach(this.props.hosts, host => {
        if (!allDcs[host.dc]) {
          allDcs[host.dc] = [];
        }
        allDcs[host.dc].push(host);
        if (!allRacks[host.dc + '|' + host.rack]) {
          allRacks[host.dc + '|' + host.rack] = [];
        }
        allRacks[host.dc + '|' + host.rack].push(host);
      });


      for (const dc in allDcs) {
        let hasChecked = false;
        let hasUnchecked = false;
        allDcs[dc].forEach(item => {
          if (this.props.checkedHosts && this.props.checkedHosts[item.id]) {
            hasChecked = true;
          } else {
            hasUnchecked = true;
          }
        });
        if (hasChecked && hasUnchecked) {
          dcCheckStates[dc] = {
            check: true,
            indeterminate: true,
          };
        } else if (hasChecked) {
          dcCheckStates[dc] = {
            check: true,
            indeterminate: false,
          };
        } else if (hasUnchecked) {
          dcCheckStates[dc] = {
            check: false,
            indeterminate: false,
          };
        }
      }

      for (const rack in allRacks) {
        let hasChecked = false;
        let hasUnchecked = false;
        allRacks[rack].forEach(item => {
          if (this.props.checkedHosts[item.id]) {
            hasChecked = true;
          } else {
            hasUnchecked = true;
          }
        });
        if (hasChecked && hasUnchecked) {
          rackCheckStates[rack] = {
            check: true,
            indeterminate: true,
          };
        } else if (hasChecked) {
          rackCheckStates[rack] = {
            check: true,
            indeterminate: false,
          };
        } else if (hasUnchecked) {
          rackCheckStates[rack] = {
            check: false,
            indeterminate: false,
          };
        }
      }
    }

    return (
      <>
        {groupByDc.map((kv) =>
          <VisDc
            dcName={kv[0]}
            key={kv[0]}
            checkable={this.props.checkable}
            checked={this.props.checkable && dcCheckStates[kv[0]].check}
            checkIndeterminate={this.props.checkable && dcCheckStates[kv[0]].indeterminate}
            onCheckChange={(target) => {
              this.handleDcCheckChange(kv[0], target.target.checked)
            }}
          >
            {_.chunk(kv[1], 3).map((chunks, idx) =>
              <Row gutter={16} key={idx}>
                {chunks.map(item => (
                  <Col span={8} key={item[0]}>
                    <VisRack
                      rackName={item[0]}
                      key={item[0]}
                      checkable={this.props.checkable}
                      checked={this.props.checkable && rackCheckStates[kv[0]+'|'+item[0]].check}
                      checkIndeterminate={this.props.checkable && rackCheckStates[kv[0]+'|'+item[0]].indeterminate}
                      onCheckChange={(target) => {
                        this.handleRackCheckChange(kv[0], item[0], target.target.checked)
                      }}
                    >
                      {item[1].map(host =>
                        <VisHost
                          host={host}
                          key={host.id}
                          clickable={this.props.clickable}
                          onClick={this.props.onHostClick}
                          checkable={this.props.checkable}
                          checked={this.props.checkable && this.props.checkedHosts[host.id]}
                          onCheckChange={(target) => {
                            this.handleHostCheckChange(host.id, target.target.checked)}
                          }
                        />
                      )}
                    </VisRack>
                  </Col>
                ))}
              </Row>
            )}
          </VisDc>
        )}
      </>
    );
  }
}

export default HostView;
