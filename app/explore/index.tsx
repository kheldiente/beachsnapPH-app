import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BeachGridList from "@/components/BeachGridList";
import { DefaultFont } from "@/constants/Fonts";
import { useNavigation } from "expo-router";
import { exploreLayoutKeys } from "@/constants/Global";
import * as DatabaseActions from "@/app/db/DatabaseActions";

export default function RegionListLayout(props: any) {
    const navigation = useNavigation();
    const [regions, setRegions] = useState(null);

    const getRegionGridData = async () => {
        const cRegions = await DatabaseActions.getAllRegions();
        console.log(cRegions);

        if (cRegions === null) {
            return [];
        }

        // Add empty region to show EVEN grid
        cRegions.push({ id: '', name: '' })

        var result = [];
        var index = 0;
        var inc = 3;
        while (index < cRegions.length) {
            var row = [];
            for (var k = index; k < index + inc; k++) {
                if (k < cRegions.length) {
                    row.push(cRegions[k]);
                }
            }
            result.push(row);
            index = index + inc;
        }
        
        if (result.length > 0) {
            setRegions(result);
        }
    }

    const handleScroll = (event: any) => {
        // console.log(props);
        // console.log(event.nativeEvent.contentOffset.y);
    };

    const handleSegmentButtonClick = (index: number) => { };

    const handleRegionClick = (item) => {
        navigation.navigate({
            name: `${exploreLayoutKeys.BEACH_LIST}`,
            params: { region: item },
        })
    };

    useEffect(() => {
        getRegionGridData();
    }, [])

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            <ScrollView
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
            >
                {regions &&
                    <View style={styles.container1}>
                        <BeachGridList
                            data={regions}
                            onClick={(item) => handleRegionClick(item)}
                        />
                    </View>
                }
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
        backgroundColor: 'white'
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