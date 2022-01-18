import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Text, Image, View} from 'react-native';

import BleModule from '../../module/BleModule';
import {checkBlePermission} from '../../util/PermissionUtil';
import {styles} from './Styles';
import Images from '../../../js/screens/scan/ItemImage';
import * as RootNavigation from '../../../../../RootNavigation';

export class BleScanComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScan: false,
      isConnected: false,
      text: '',
      writeData: '',
      receiveData: '',
      readData: '',
      data: [],
      isMonitoring: false,
    };

    this.bluetoothReceiveData = [];
    this.deviceMap = new Map();
  }

  componentDidMount() {
    console.log('componentDidMount: ', 'componentDidMount');

    this.onStateChangeListener = bleModule.manager.onStateChange(state => {
      console.log('onStateChange: ', state);
      if (state === 'PoweredOn') {
        checkBlePermission().then(permissionState => {
          switch (permissionState) {
            case 'granted':
              this.scan();
              break;
            case 'denied':
            case 'never_ask_again':
              console.log(permissionState);
              break;
            default:
              break;
          }
        });
      } else {
        //TODO
      }
    }, true);
  }

  componentWillUnmount() {
    bleModule.destroy();
    this.onStateChangeListener && this.onStateChangeListener.remove();
    // this.disconnectListener && this.disconnectListener.remove();
    // this.monitorListener && this.monitorListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList renderItem={this.renderItem} data={this.state.data} />
      </View>
    );
  }

  renderItem = item => {
    let data = item.item;
    let rssi = data.rssi;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={this.state.isConnected}
        onPress={() => RootNavigation.navigate('Details', data)}
        style={styles.item}>
        <View style={styles.item_column}>
          <Text style={styles.item_title}>{data.name ? data.name : ''}</Text>
          <View style={styles.item_sub_row}>
            <Text style={styles.item_sub_text}>{data.id}</Text>
            <Text style={styles.item_dbm_text}>{rssi + ' dBm'}</Text>
            {this.fetchRssiIcon(rssi)}
          </View>
          <View style={styles.item_under_line} />
        </View>
      </TouchableOpacity>
    );
  };

  getImageSource(itemImage) {
    return <Image style={styles.icon} source={itemImage} />;
  }
  fetchRssiIcon(rssi) {
    let rssiNumber = parseInt(rssi);
    if (rssiNumber > -70) {
      return this.getImageSource(Images.image4);
    } else if (rssiNumber > -85) {
      return this.getImageSource(Images.image3);
    } else if (rssiNumber > -100) {
      return this.getImageSource(Images.image2);
    } else if (rssiNumber > -110) {
      return this.getImageSource(Images.image1);
    } else {
      return this.getImageSource(Images.image0);
    }
  }

  scan() {
    console.log('startDeviceScan scan:', 'scan');
    if (!this.state.isScan) {
      this.setState({isScan: true});
      this.deviceMap.clear();

      bleModule.startDeviceScan(
        error => {
          console.log('startDeviceScan error:', error);
          if (error.errorCode === 102) {
            this.alert(
              'Please open bluetooth permission before use this application.',
            );
          }
          this.setState({isScan: false});
        },
        device => {
          console.log(device.id, device.name);
          this.deviceMap.set(device.id, device);
          this.setState({data: [...this.deviceMap.values()]});
        },
      );

      this.scanTimer && clearTimeout(this.scanTimer);
      this.scanTimer = setTimeout(() => {
        if (this.state.isScan) {
          bleModule.stopScan();
          this.setState({isScan: false});
        }
      }, 1000);
    } else {
      bleModule.stopScan();
      this.setState({isScan: false});
    }
  }
}

const bleModule = new BleModule();
