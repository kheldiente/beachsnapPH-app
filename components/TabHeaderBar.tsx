import { DefaultFont } from "@/constants/Fonts";
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

export default function TabHeaderBar(props) {
    return (
        <View style={styles.toolbar}>
            <Text style={styles.title}>BeachSnap PH</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    toolbar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 20,
        paddingBottom: 50,
    },
    title: {
        color: 'green',
        fontFamily: DefaultFont.fontFamily,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        position: 'absolute',
        margin: 5
    },
});