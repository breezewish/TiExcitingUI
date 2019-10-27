import { observable, action, toJS } from 'mobx';
import uniqid from 'uniqid';

class Store {
  @observable deployments = {};

  @action.bound
  addDeployment(hosts, config, topology) {
    const d = {
      id: uniqid(),
      hosts: JSON.parse(JSON.stringify(hosts)),
      config: JSON.parse(JSON.stringify(config)),
      topology: JSON.parse(JSON.stringify(topology)),
    };
    this.deployments[d.id] = d;
    console.log(d);
    return d;
  }
}

const store = new Store();

export default store;
