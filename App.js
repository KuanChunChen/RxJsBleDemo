/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BleScanComponent} from './src/main/js/screens/scan/BleScanScreen';
import {DeviceComponent} from './src/main/js/screens/device/DeviceScreen';
import {navigationRef} from './RootNavigation';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BleScanComponent}
          options={{title: 'Scan List'}}
        />
        <Stack.Screen
          name="BleDevice"
          component={DeviceComponent}
          options={{title: 'My Device'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
