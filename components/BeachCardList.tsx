import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { Beach, BeachList } from "@/data/beach";
import { DefaultFont } from "@/constants/Fonts";
import { ScrollView } from "react-native";

export default function BeachCardList(props) {
    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = (item) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => {
                props.handleOnClickCard(item)
            }}
        >
            <View style={styles.card}>
                <View style={styles.item}>
                    <Text style={styles.title}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            {props.data.map((item) =>
                renderItem(item)
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 40,
        backgroundColor: 'white',
        borderColor: "white",
        borderRadius: 5,
        shadowColor: "transparent",
        marginVertical: 5,
        flexDirection: "row",
        alignItems: 'center'
    },
    item: {
        margin: 10
    },
    title: {
        fontFamily: DefaultFont.fontFamily
    }
});