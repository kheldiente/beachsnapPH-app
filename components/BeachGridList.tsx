import React, { useState } from "react";
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { getThumbnail } from "@/data/beach";
import { DefaultFont } from "@/constants/Fonts";

export default function BeachGridList(props) {

    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = (item) => {
        const gridItemArray = item.gridItemArray
        return (
            <View
            key={`_item_${gridItemArray.toString()}`} 
            style={styles.gridItem}
            >
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
            <TouchableOpacity
                key={`_bchGrid_${item}`}
                onPress={() => handleOnClickCard(item)}
                disabled={!showData}
            >
                <View style={styles.card}>
                    {true &&
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
        justifyContent: 'space-evenly',
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
        marginTop: 10,
    },
});