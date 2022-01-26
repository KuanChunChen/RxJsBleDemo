import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

export const checkBlePermission = async () => {
  const permission = 'android.permission.ACCESS_FINE_LOCATION';

  if (Platform.OS === 'android') {
    return await PermissionsAndroid.request(permission);
  } else {
    //TODO ios permission
  }
};
