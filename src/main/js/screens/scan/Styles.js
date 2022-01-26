import {PixelRatio, Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  item: {
    flexDirection: 'column',
    borderColor: 'rgb(235,235,235)',
    borderStyle: 'solid',
    paddingLeft: 10,
    paddingVertical: 8,
  },

  item_column: {
    flexDirection: 'column',
  },
  item_title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item_sub_row: {
    flexDirection: 'row',
    marginTop: 5,
  },
  item_sub_text: {
    flex: 1,
    color: '#767676',
    fontSize: 12,
  },

  item_dbm_text: {
    justifyContent: 'flex-end',
    color: '#767676',
    fontSize: 12,
    textAlign: 'right',
    marginRight: PixelRatio.getPixelSizeForLayoutSize(11),
  },

  item_under_line: {
    height: 1,
    backgroundColor: '#cdcdcd',
    marginTop: 9,
  },
  icon: {
    justifyContent: 'flex-end',
    marginRight: PixelRatio.getPixelSizeForLayoutSize(10),
  },
});
