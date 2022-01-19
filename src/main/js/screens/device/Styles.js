import {Platform, StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        paddingLeft: 10,
        paddingRight: 10,
    },

});
