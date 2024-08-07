import React, { useState } from "react";
import {
    StyleSheet,
    FlatList,
    Image,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Card } from "react-native-elements";
import { Beach, BeachList, getThumbnail } from "@/data/beach";
import { DefaultFont } from "@/constants/Fonts";

export default function BeachGridList(props) {

    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = (item) => {
        const gridItemArray = item.item.gridItemArray
        return (
            <View style={styles.gridItem}>
                {gridItemArray.map((gridItem) =>
                    renderGridCard(gridItem)
                )}
            </View>
        )
    }

    const handleOnClickCard = (key) => {
        props.onClick(key);
    }

    const renderGridCard = (item) => {
        const showData = item !== ''
        const thumbnailImg = getThumbnail(item)

        return (
            <TouchableOpacity onPress={() => handleOnClickCard(item)}>
                <View
                    style={
                        showData ? styles.card : styles.cardInvisible
                    }
                >
                    {showData &&
                        <View style={styles.gridItemImg}>
                            <Image
                                source={thumbnailImg}
                                style={styles.img}
                            />
                            <Text style={styles.gridItemTxt}>{item}</Text>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={props.data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    gridItemImg: {
        width: '100%',
        height: 100,
        overflow: 'hidden',
        borderRadius: 5
    },
    img: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    gridItemTxt: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        margin: 5,
        position: 'absolute',
        alignSelf: 'flex-start',
    },
    gridItem: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        borderColor: 'white',
        width: 110,
        marginTop: 10,
    },
    cardInvisible: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        width: 110,
    },
});