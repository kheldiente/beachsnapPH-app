import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gridRegions } from "@/data/beach";
import BeachGridList from "@/components/BeachGridList";
import { DefaultFont } from "@/constants/Fonts";
import { useNavigation } from "expo-router";
import { exploreLayoutKeys } from "@/constants/Global";

export default function RegionListLayout(props: any) {
    const getItemId = (item: { id: any; }) => (item.id)
    const navigation = useNavigation();

    const getSegmentButtons = () => {
        return ["All", "Visited"];
    };

    const getGridData = () => {
        return gridRegions.map((arr) => (
            { gridItemArray: arr }
        ))
    }

    const handleScroll = (event: any) => {
        // console.log(props);
        // console.log(event.nativeEvent.contentOffset.y);
    };

    const handleSegmentButtonClick = (index: number) => { };

    const handleRegionClick = (key) => {
        if (key === '') {
            return;
        }
        
        navigation.navigate({
            name: `${exploreLayoutKeys.BEACH_LIST}`,
            params: { region: key },
        })
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container1}>
                    <BeachGridList
                        data={getGridData()}
                        onClick={(key) => handleRegionClick(key)}
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
        paddingHorizontal: 10
    },
    container1: {
        flexDirection: "column"
    },
    header1: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 15,
        marginLeft: 8,
        marginTop: 10
    },
});