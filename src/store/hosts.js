import { Modal } from 'antd';
import { observable } from "mobx";

class Store {
  @observable hosts = {
    '10.9.164.80': {
      name: 'uhost-ap3kilnh',
      host: '10.9.164.80',
      username: 'root',
      password: 'abc',
      port: 22,
    }
  };

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
    if (this.hosts[opts.host]) {
      Modal.error({
        title: '添加失败',
        content: `主机 ${opts.host} 已存在，不能重复添加`,
      });
      return false;
    }

    this.hosts[opts.host] = opts;
    return true;
  }
}

const store = new Store();

export default store;
