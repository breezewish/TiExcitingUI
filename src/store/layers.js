import { observable } from 'mobx';

class Store {
  @observable hostListVisible = false;
  @observable hostAddVisible = false;
}

const store = new Store();

export default store;
