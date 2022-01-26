import BleModule from './BleModule';

export default class BleModuleManager {
  bleModule: BleModule = new BleModule();
  static instance = null;
  static createInstance() {
    return new BleModuleManager();
  }

  static getInstance() {
    if (!BleModuleManager.instance) {
      BleModuleManager.instance = BleModuleManager.createInstance();
    }
    return BleModuleManager.instance;
  }

  getBlueModule = () => this.bleModule;
}
