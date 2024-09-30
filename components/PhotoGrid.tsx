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
import { Ionicons } from "@expo/vector-icons";

export default function PhotoGrid(props) {
    const data = props.data.gridItemArray;
    const getLatestSnap = (beach) => {
        return props.data.gridItemArray[beach.provinceId]['snaps']
            .filter((snap) => snap.beachId === beach.id)[0]
            .photoUrl;
    }

    const getSnapsSize = (beach) => {
        if (beach.id.includes('empty_')) {
            return 0;
        }

        return props.data.gridItemArray[beach.provinceId]['snaps']
            .filter((snap) => snap.beachId === beach.id).length;
    }

    // Written like this to prevent 
    // renderItem complaining for a type
    const renderItem = (item) => {
        var count = 3;
        var startIdx = 0;

        const beaches = [...item.beaches];
        const columns = Math.ceil(beaches.length / 3);
        const columnArr = [...Array(columns).keys()];

        const remaining = (columnArr.length * count) - beaches.length
        if (remaining !== 0) {
            [...Array(remaining).keys()].forEach((index) => {
                beaches.push({
                    id: `empty_${index}+photoGrid+${new Date().toDateString()}`,
                    name: '',
                })
            })
        }

        const gridRow = (column, beaches) => {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                    key={`photoGrid_${column}+row`}
                >
                    {beaches.map((bch) => renderGridCard(bch))}
                </View>
            )
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {columnArr.map((column) => {
                    var endIdx = startIdx + count
                    const row = gridRow(column, beaches.slice(startIdx, endIdx))
                    startIdx = endIdx;
                    return row;
                })}
            </View>
        )
        // return (
        //     <View style={styles.gridItem}>
        //         {[...Array(count).keys()].map((index) => {
        //             return (index < item.beaches.length) ?
        //                 renderGridCard(item.beaches[index])
        //                 : renderGridCard({
        //                     id: 'empty_' + item.id + `_${index}`,
        //                     name: '',
        //                 })
        //         })}
        //     </View>
        // )
    }

    const handleOnClickCard = (key) => {
        props.onClick(key);
    }

    const renderGridCard = (item) => {
        const showData = !item.id.includes('empty_')
        const fileImg = 'file:///Users/mikediente/Library/Developer/CoreSimulator/Devices/D154F7E4-684E-4666-811D-681AAC334BC2/data/Containers/Data/Application/1F23EC99-02ED-4D28-81FB-80B1CA3E30EC/Library/Caches/ExponentExperienceData/@anonymous/beach-snap-ph-175ae04c-e255-4cae-9c82-f3bf935d29f8/ImagePicker/74127695-7A3B-444D-82EA-346B7767B69D.jpg'
        const maxNameLength = 15;
        const name = item.name.length < maxNameLength
            ? `${item.name}`
            : `${item.name.substring(0, maxNameLength)}...`
        const photosCount = getSnapsSize(item);

        return (
            <View key={`_phGrid_${item.id}`}>
                <TouchableOpacity
                    onPress={() => handleOnClickCard(item)}
                    disabled={!showData}
                >
                    <View style={styles.card}>
                        {true &&
                            <View style={styles.gridItemImg}>
                                {showData ?
                                    (<Image
                                        source={{ uri: getLatestSnap(item) }}
                                        style={styles.img}
                                    />) : (<View />)
                                }
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <Text
                    style={styles.gridItemTxt}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >{name}</Text>
                <Text style={styles.gridItemSubTxt}>{
                    photosCount > 0 ? `${photosCount}` : ''
                }</Text>
            </View>
        )
    }

    // console.log(`photoGrid data: ${JSON.stringify(data)}`);
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            {data &&
                Object.keys(data).map((key) => {
                    const item = data[key];
                    const firstItem = item['beaches'][0]
                    const provinceName = firstItem['province'];
                    const regionId = firstItem['regionId']
                    const regionName = firstItem['metadata'];
                    const visited = item['beaches'].length;
                    const beachesCount = item['totalBeaches'];

                    return (
                        <View
                            key={`_phGrid_container_${key}`}
                            style={styles.container}
                        >
                            <View style={styles.containerHeader}>
                                <Text style={styles.header}>{provinceName}</Text>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginRight: 15,
                                            backgroundColor: 'lightgray',
                                            // paddingHorizontal: 10,
                                            paddingLeft: 5,
                                            paddingVertical: 2,
                                            borderRadius: 5,
                                        }}
                                        onPress={() => {
                                            props.onClickRightCta({
                                                id: item.id,
                                                name: provinceName,
                                            })
                                        }}
                                    >
                                        <Text style={{
                                            ...styles.subHeader,
                                            color: 'black',
                                            // marginLeft: 6,
                                        }}>
                                            {visited} / {beachesCount}
                                        </Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={14}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: 'black',
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderItem(item)}
                        </View>
                    )
                })
            }
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
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
        marginLeft: 10,
        color: 'darkgray',
    },
    subHeader: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 12,
        color: 'black',
    },
    gridItemImg: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 5
    },
    img: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    gridItemTxt: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 13,
        color: 'black',
        marginTop: 5,
        alignSelf: 'center',
    },
    gridItemSubTxt: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 10,
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
        marginHorizontal: 6
    },
});