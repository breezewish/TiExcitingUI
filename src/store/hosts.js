import { Modal } from 'antd';
import { observable, action } from 'mobx';
import uniqid from 'uniqid';

class Store {
  @observable hosts = {};

  constructor() {
    this.addHost({
      name: 'uhost-ap3kilnh',
      host: '10.9.164.80',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-1',
    });
    this.addHost({
      name: 'uhost-kesclakw',
      host: '10.9.136.246',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-1',
    });
    this.addHost({
      name: 'uhost-ou3hu5yx',
      host: '10.9.158.146',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-2',
    });
    this.addHost({
      name: 'uhost-x2ofoajg',
      host: '10.9.111.178',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-2',
    });
    this.addHost({
      name: 'uhost-ahdkyu5j',
      host: '10.9.106.240',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-1',
    });
    this.addHost({
      name: 'uhost-keoznqgf',
      host: '10.9.13.204',
      username: 'root',
      password: 'VQh?dv>c$55c',
      port: 22,
      dc: 'ucloud',
      rack: 'rack-2',
    });
    this.addHost({
      host: '192.168.233.128',
      username: 'tidb',
      password: '123456',
      port: 22,
      dc: 'Tongji',
    });
    this.addHost({
      host: '192.168.233.129',
      username: 'tidb',
      password: '123456',
      port: 22,
      dc: 'Tongji',
    });
    this.addHost({
      host: '192.168.233.130',
      username: 'tidb',
      password: '123456',
      port: 22,
      dc: 'Tongji',
    });
    this.addHost({
      host: '192.168.233.131',
      username: 'tidb',
      password: '123456',
      port: 22,
      dc: 'Tongji',
    });
  }

  @action.bound
  addHost(opts) {
    if (!opts.name) {
      opts.name = `${opts.username}@${opts.host}:${opts.port}`;
    }
    opts.port = parseInt(opts.port);
    if (!opts.port) {
      Modal.error({
        title: '添加失败',
        content: `无效端口`,
      });
      return false;
    }
    if (Object.values(this.hosts).map(v => v.host).indexOf(opts.host) !== -1) {
      Modal.error({
        title: '添加失败',
        content: `主机 ${opts.host} 已存在，不能重复添加`,
      });
      return false;
    }
    // TODO: 检查 name 格式
    if (Object.values(this.hosts).map(v => v.name).indexOf(opts.name) !== -1) {
      Modal.error({
        title: '添加失败',
        content: `唯一名称 ${opts.name} 已存在，不能重复添加`,
      });
      return false;
    }
    opts.id = uniqid();
    opts.dc = opts.dc || '';
    opts.rack = opts.rack || '';
    this.hosts[opts.id] = opts;
    return true;
  }
}

const store = new Store();

export default store;
