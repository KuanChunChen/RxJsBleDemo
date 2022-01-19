import React, {Component} from 'react';
import {Text, View} from "react-native";
import {styles} from "./Styles";

export class DeviceComponent extends Component {

    constructor() {
        super();
    }

    render() {

        return (
            <View style={styles.container}>
                <Text>Device ID :</Text>
                <Text>RSSI : </Text>
            </View>);
    }
}

