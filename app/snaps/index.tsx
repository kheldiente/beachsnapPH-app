import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PhotoGrid from "@/components/PhotoGrid";
import { DefaultFont } from "@/constants/Fonts";
import { useNavigation } from "expo-router";
import { photoGrid } from "@/data/photos";

export default function SnapsAlbumLayout(props: any) {
    const getItemId = (item: { id: any; }) => (item.id)
    const navigation = useNavigation();

    const getSegmentButtons = () => {
        return ["All", "Visited"];
    };

    const getGridData = () => {
        return {
            gridItemArray: photoGrid.data
        }
    }

    const handleScroll = (event: any) => {
        // console.log(props);
        // console.log(event.nativeEvent.contentOffset.y);
    };

    const handleRegionClick = (key) => {
        if (key === '') {
            return;
        }
        
        // navigation.navigate({
        //     name: `${exploreLayoutKeys.BEACH_LIST}`,
        //     params: { region: key },
        // })
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container1}>
                    <PhotoGrid
                        data={getGridData()}
                        onClick={(key: string) => handleRegionClick(key)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    statusBar: {
        flex: 1,
    },
    segmentedButtons: {
        flexDirection: "row",
        backgroundColor: "white",
        margin: 15,
        borderRadius: 10
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    container1: {
        flexDirection: "column",
    },
    header1: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 18,
        marginRight: 15,
        marginLeft: 8,
        marginTop: 10
    },
});