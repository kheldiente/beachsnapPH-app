import React, { useState } from "react";
import {
    StyleSheet,
    FlatList,
    ListRenderItem,
    View,
    Text
} from "react-native";
import { Card } from "react-native-elements";
import { Beach, BeachList } from "@/data/beach";

export default function BeachCardList(props) {
    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = ({ item } : { item: Beach }) => ( 
        <Card containerStyle={styles.card}>
            <View>
                <Text>{item.name}</Text>
            </View>
        </Card>
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
        borderColor: "white",
        borderRadius: 5,
        shadowColor: "transparent"

    },
    item: {
        flexDirection: "row",
        margin: 10
    }
});