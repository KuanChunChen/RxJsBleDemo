import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonView: {
    height: 30,
    backgroundColor: 'rgb(33, 150, 243)',
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
  },
});
