import React, {Component} from 'react';
import {Text, View} from "react-native";
import {styles} from "./Styles";

export class DeviceComponent extends Component {

    constructor({route}) {
        super();
        this.route = route;
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Name :{this.route.params.bleDevice.name != null ? this.route.params.bleDevice.name : "Empty"} </Text>
                <Text>Device ID :{this.route.params.bleDevice.id != null ? this.route.params.bleDevice.id : "00:00:00:00:00:00"}</Text>
                <Text>RSSI :{this.route.params.bleDevice.rssi != null ? this.route.params.bleDevice.rssi : "0 dBm"} </Text>
                <Text>Mtu :{this.route.params.bleDevice.mtu != null ? this.route.params.bleDevice.mtu : "0"} </Text>
                <Text>LocalName :{this.route.params.bleDevice.localName != null ? this.route.params.bleDevice.localName : "Empty"} </Text>
                <Text>TxPowerLevel :{this.route.params.bleDevice.txPowerLevel != null ? this.route.params.bleDevice.txPowerLevel : "0"} </Text>
            </View>
        );
    }
}

