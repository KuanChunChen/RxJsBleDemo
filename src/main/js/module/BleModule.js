import {BleError, BleManager, Device} from 'react-native-ble-plx';
import {Platform} from 'react-native';

export default class BleModule {
  constructor() {
    this.isConnecting = false;
    this.initUUID();
    this.manager = new BleManager();
  }
  async fetchServicesAndCharacteristicsForDevice(device) {
    let servicesMap = {};
    let services = await device.services();

    for (let service of services) {
      let characteristicsMap = {};
      let characteristics = await service.characteristics();

      for (let characteristic of characteristics) {
        characteristicsMap[characteristic.uuid] = {
          uuid: characteristic.uuid,
          isReadable: characteristic.isReadable,
          isWritableWithResponse: characteristic.isWritableWithResponse,
          isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
          isNotifiable: characteristic.isNotifiable,
          isNotifying: characteristic.isNotifying,
          value: characteristic.value,
        };
      }

      servicesMap[service.uuid] = {
        uuid: service.uuid,
        isPrimary: service.isPrimary,
        characteristicsCount: characteristics.length,
        characteristics: characteristicsMap,
      };
    }
    return servicesMap;
  }

  initUUID() {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.nofityServiceUUID = [];
    this.nofityCharacteristicUUID = [];
  }

  startDeviceScan(
    onError: (error: BleError) => void,
    onScanSuccess: (device: Device) => void,
  ) {
    this.manager.startDeviceScan(
      null,
      {allowDuplicates: false},
      (error, device) => {
        if (error) {
          console.log('startDeviceScan error:', error);
          onError(error);
        } else {
          console.log(device.id, device.name);
          onScanSuccess(device);
        }
      },
    );
  }

  stopScan() {
    if (this.manager != null) {
      this.manager.stopDeviceScan();
      console.log('stopDeviceScan');
    }
  }

  connect(id) {
    console.log('isConnected:', id);
    this.isConnecting = true;
    return new Promise((resolve, reject) => {
      this.manager
        .connectToDevice(id)
        .then(device => {
          console.log('connect success:', device.name, device.id);
          this.peripheralId = device.id;
          // resolve(device);
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(device => {
          return this.fetchServicesAndCharacteristicsForDevice(device);
        })
        .then(services => {
          console.log('fetchServicesAndCharacteristicsForDevice', services);
          this.isConnecting = false;
          this.getUUID(services);
          resolve();
        })
        .catch(err => {
          this.isConnecting = false;
          console.log('connect fail: ', err);
          reject(err);
        });
    });
  }

  destroy() {
    this.manager.destroy();
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.manager
        .cancelDeviceConnection(this.peripheralId)
        .then(res => {
          console.log('disconnect success', res);
          resolve(res);
        })
        .catch(err => {
          reject(err);
          console.log('disconnect fail', err);
        });
    });
  }
}
