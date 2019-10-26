import { observable } from "mobx";

class Store {
  @observable hostListVisible = false;
  @observable hostAddVisible = true;
}

const store = new Store();

export default store;
