import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SegmentedButton from "@/components/SegmentedButton";
import { gridRegions } from "@/data/beach";
import BeachCardList from "@/components/BeachCardList";
import BeachGridList from "@/components/BeachGridList";
import { DefaultFont } from "@/constants/Fonts";

export default function PricesScreen(props: any) {
    const getItemId = (item: { id: any; }) => (item.id)

    const getSegmentButtons = () => {
        return ["All", "Visited"];
    };

    const getGridData = () => {
        return gridRegions.map((arr) => (
            {gridItemArray: arr}
        ))
    }

    const handleScroll = (event: any) => {
        // console.log(props);
        // console.log(event.nativeEvent.contentOffset.y);
    };

    const handleSegmentButtonClick = (index: number) => {};

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView 
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
            >
                {/* <SegmentedButton 
                    style={styles.segmentedButtons} 
                    buttons={getSegmentButtons()} 
                    onPress={handleSegmentButtonClick}
                /> */}
                <View style={styles.container1}>
                    <Text style={styles.header1}>Regions</Text>
                    {/* <BeachCardList data={mockBeachListData.data} /> */}
                    <BeachGridList
                        data={getGridData()} 
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