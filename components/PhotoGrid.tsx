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

export default function PhotoGrid(props) {

    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = (item) => {
        return (
            <View style={styles.gridItem}>
                {item.municipalities.map((municipality) =>
                    renderGridCard(municipality)
                )}
            </View>
        )
    }

    const handleOnClickCard = (key) => {
        props.onClick(key);
    }

    const renderGridCard = (item) => {
        const showData = item !== ''
        const thumbnailImg = getThumbnail(item.region)
        const fileImg = 'file:///Users/mikediente/Library/Developer/CoreSimulator/Devices/D154F7E4-684E-4666-811D-681AAC334BC2/data/Containers/Data/Application/1F23EC99-02ED-4D28-81FB-80B1CA3E30EC/Library/Caches/ExponentExperienceData/@anonymous/beach-snap-ph-175ae04c-e255-4cae-9c82-f3bf935d29f8/ImagePicker/74127695-7A3B-444D-82EA-346B7767B69D.jpg'

        return (
            <View key={`_phGrid_${item.name}`}>
                <TouchableOpacity
                    onPress={() => handleOnClickCard(item)}
                    disabled={!showData}
                >
                    <View style={styles.card}>
                        {true &&
                            <View style={styles.gridItemImg}>
                                {/* <Image
                                    source={thumbnailImg}
                                    style={styles.img}
                                /> */}
                                <Image
                                    source={{ uri: fileImg }}
                                    style={styles.img}
                                />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <Text style={styles.gridItemTxt}>{item.name}</Text>
                <Text style={styles.gridItemSubTxt}>{item.photos.length}</Text>
            </View>
        )
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            {props.data.gridItemArray.map((item) =>
                <View
                    key={`_phGrid_container_${item.province}`}
                    style={styles.container}
                >
                    <View style={styles.containerHeader}>
                        <Text style={styles.header}>{item.province}</Text>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}>
                            <Text style={styles.subHeader}>
                                Visited beaches: {item.visited}/{item.beachesCount}
                            </Text>
                        </View>
                    </View>
                    {renderItem(item)}
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        backgroundColor: 'white',
        paddingVertical: 8,
    },
    containerHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 16,
        marginLeft: 20,
        fontWeight: 'bold',
        color: 'darkgray',
    },
    subHeader: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        marginRight: 25,
        color: 'darkgray',
    },
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
        color: 'black',
        marginTop: 5,
        alignSelf: 'center',
    },
    gridItemSubTxt: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'gray',
        alignSelf: 'center',
    },
    gridItem: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 5,
        width: 110,
        marginTop: 10,
        marginHorizontal: 6
    },
    cardInvisible: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        width: 110,
        marginTop: 10,
    },
});