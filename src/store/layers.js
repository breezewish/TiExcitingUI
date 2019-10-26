import { observable } from 'mobx';

class Store {
  @observable hostListVisible = true;
  @observable hostAddVisible = false;
}

const store = new Store();

export default store;
