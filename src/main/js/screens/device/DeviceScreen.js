import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './Styles';
import {bleModule} from '../../../../../App';
import {FunctionCodeEnum, makePayload} from '../../util/ModbusPayloadUtil';
export class DeviceComponent extends Component {
  constructor({route}) {
    super();
    this.route = route;
    {
      console.log('notifyServiceUUID', bleModule.notifyServiceUUID);
      console.log('charUUID', bleModule.notifyCharacteristicUUID);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Name :
          {this.route.params.bleDevice.name != null
            ? this.route.params.bleDevice.name
            : 'Empty'}{' '}
        </Text>
        <Text>
          Device ID :
          {this.route.params.bleDevice.id != null
            ? this.route.params.bleDevice.id
            : '00:00:00:00:00:00'}
        </Text>
        <Text>
          RSSI :
          {this.route.params.bleDevice.rssi != null
            ? this.route.params.bleDevice.rssi
            : '0 dBm'}
        </Text>
        <Text>
          Mtu :
          {this.route.params.bleDevice.mtu != null
            ? this.route.params.bleDevice.mtu
            : '0'}
        </Text>
        <Text>
          LocalName :
          {this.route.params.bleDevice.localName != null
            ? this.route.params.bleDevice.localName
            : 'Empty'}
        </Text>
        <Text>
          NotifyServiceUUID :
          {bleModule.notifyServiceUUID != null
            ? bleModule.notifyServiceUUID
            : 'Empty'}
        </Text>
        <Text>
          NotifyCharacteristicUUID :
          {bleModule.notifyCharacteristicUUID != null
            ? bleModule.notifyCharacteristicUUID
            : 'Empty'}
        </Text>

        <Text>
          WriteWithResponseServiceUUID :
          {bleModule.writeWithResponseServiceUUID != null
            ? bleModule.writeWithResponseServiceUUID
            : 'Empty'}
        </Text>
        <Text>
          WriteWithResponseCharacteristicUUID :
          {bleModule.writeWithResponseCharacteristicUUID != null
            ? bleModule.writeWithResponseCharacteristicUUID
            : 'Empty'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.buttonView,
            {marginHorizontal: 10, height: 40, alignItems: 'center'},
          ]}
          onPress={() => writeData('01030D48000246b1', 0)}>
          <Text style={styles.buttonText}>{'發送資料'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

function writeData(data: String, index) {
  bleModule.startNotify(
    characteristic => {
      console.log('data Change :', characteristic);
    },
    error => {
      console.log('write fail on start notify: ', error);
    },
  );
  // let writePayload = makePayload(
  //   1,
  //   FunctionCodeEnum.FUNCTION_ID_READ_HOLDING_REGISTER,
  //   589,
  //   2,
  // );
  // console.log('payload:' + writePayload);
  // bleModule.writeToDevice(writePayload, index).then(r => {});
  bleModule
    .writeToDevice('01030200000445b1', index)
    .then(characteristic => {
      console.log('return data : ' + characteristic.valueOf());
    })
    .catch(error => {
      console.log('write fail on write to device: ', error);
    });
}

// [Req]<READ AI STATUS> 01030D48000246b1
// [Rsp]<READ AI STATUS> 01030400000000fa33
