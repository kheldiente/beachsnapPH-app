import React, { useState } from "react";
import {
    StyleSheet,
    FlatList,
    ListRenderItem,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { Beach, BeachList } from "@/data/beach";

export default function BeachCardList(props) {
    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = ({ item }: { item: Beach }) => (
        <TouchableOpacity>
            <View style={styles.card}>
                <View style={styles.item}>
                    <Text>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <FlatList
            data={props.data}
            renderItem={renderItem}
            keyExtractor={(item: Beach) => item.id}
            showsVerticalScrollIndicator={false}
        />
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
    }
});