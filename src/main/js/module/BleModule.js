import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  ScanMode,
} from 'react-native-ble-plx';

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
    this.notifyServiceUUID = [];
    this.notifyCharacteristicUUID = [];
  }

  startDeviceScan(
    onError: (error: BleError) => void,
    onScanSuccess: (device: Device) => void,
  ) {
    this.manager.startDeviceScan(
      null,
      {scanMode: ScanMode.LowLatency},
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

  async connectTest(
    device: Device,
    onError: (error: String) => void = {},
    onConnectSuccess: (device: Device) => void = {},
  ) {
    try {
      await this.manager
        .connectToDevice(device.id, {timeout: 3000})
        .then(bleDevice => {
          this.peripheralId = bleDevice.id;
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(connectDevice => {
          return this.fetchServicesAndCharacteristicsForDevice(connectDevice);
        })
        .then(services => {
          console.log('fetchServicesAndCharacteristicsForDevice', services);
          this.isConnecting = false;
          this.getUUID(services);
          onConnectSuccess(device);
        })
        .catch(error => {
          this.isConnecting = false;
          console.log('connect fail: ', error);
          onError(error.toString());
        });
    } catch (error) {
      onError(error.toString());
    }
  }

  getUUID(services) {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.notifyServiceUUID = [];
    this.notifyCharacteristicUUID = [];

    for (let i in services) {
      // console.log('service',services[i]);
      let charchteristic = services[i].characteristics;
      for (let j in charchteristic) {
        // console.log('charchteristic',charchteristic[j]);
        if (charchteristic[j].isReadable) {
          this.readServiceUUID.push(services[i].uuid);
          this.readCharacteristicUUID.push(charchteristic[j].uuid);
        }
        if (charchteristic[j].isWritableWithResponse) {
          this.writeWithResponseServiceUUID.push(services[i].uuid);
          this.writeWithResponseCharacteristicUUID.push(charchteristic[j].uuid);
        }
        if (charchteristic[j].isWritableWithoutResponse) {
          this.writeWithoutResponseServiceUUID.push(services[i].uuid);
          this.writeWithoutResponseCharacteristicUUID.push(
            charchteristic[j].uuid,
          );
        }
        if (charchteristic[j].isNotifiable) {
          this.notifyServiceUUID.push(services[i].uuid);
          this.notifyCharacteristicUUID.push(charchteristic[j].uuid);
        }
      }
    }

    console.log('readServiceUUID', this.readServiceUUID);
    console.log('readCharacteristicUUID', this.readCharacteristicUUID);
    console.log(
      'writeWithResponseServiceUUID',
      this.writeWithResponseServiceUUID,
    );
    console.log(
      'writeWithResponseCharacteristicUUID',
      this.writeWithResponseCharacteristicUUID,
    );
    console.log(
      'writeWithoutResponseServiceUUID',
      this.writeWithoutResponseServiceUUID,
    );
    console.log(
      'writeWithoutResponseCharacteristicUUID',
      this.writeWithoutResponseCharacteristicUUID,
    );
    console.log('notifyServiceUUID', this.notifyServiceUUID);
    console.log('notifyCharacteristicUUID', this.notifyCharacteristicUUID);
  }

  startNotify(
    listener: (error: ?Error, characteristic: ?Characteristic) => void,
  ) {
    console.log('----- start notify and device into -----');
    console.log('peripheralId:' + this.peripheralId);
    console.log('serviceUUID:' + this.writeWithResponseServiceUUID[0]);
    console.log('charUUID:' + this.writeWithResponseCharacteristicUUID[0]);
    console.log('NcharUUID:' + this.notifyServiceUUID[0]);
    console.log('NcharUUID:' + this.notifyCharacteristicUUID[0]);
    this.manager.monitorCharacteristicForDevice(
      this.peripheralId,
      this.notifyServiceUUID[0],
      this.notifyCharacteristicUUID[0],
      listener,
    );
  }

  writeToDevice(value, index) {
    let formatValue = value;
    let transactionId = 'write';

    /***
     * 一般是使用 writeWithResponseServiceUUID
     * 和 writeWithResponseCharacteristicUUID
     *
     * WM裡面用notifyServiceUUID
     * 和 notifyCharacteristicUUID
     */
    console.log('----- start write and device into -----');
    console.log('peripheralId:' + this.peripheralId);
    console.log('serviceUUID:' + this.writeWithResponseServiceUUID[index]);
    console.log('charUUID:' + this.writeWithResponseCharacteristicUUID[index]);
    console.log('NcharUUID:' + this.notifyServiceUUID[index]);
    console.log('NcharUUID:' + this.notifyCharacteristicUUID[index]);
    console.log('payload :' + value);
    return new Promise((resolve, reject) => {
      this.manager
        .writeCharacteristicWithResponseForDevice(
          this.peripheralId,
          this.notifyServiceUUID[index],
          this.notifyCharacteristicUUID[index],
          formatValue,
        )
        .then(
          characteristic => {
            console.log('write success', value);
            resolve(characteristic);
          },
          error => {
            console.log('write fail: ', error);
            reject(error);
          },
        );
    });
  }

  destroy() {
    console.log('destroy');
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
