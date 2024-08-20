import { DefaultFont } from "@/constants/Fonts";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

export default function TabHeaderBar(props) {
    return (
        <View style={styles.toolbar}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    toolbar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 50,
    },
    title: {
        color: 'green',
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 20,
        alignSelf: 'flex-start',
        position: 'absolute',
        paddingVertical: 6,
    },
});