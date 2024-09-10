import React, { useCallback, useEffect, useState } from "react";
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
import { snapsLayoutKeys } from "@/constants/Global";
import * as DatabaseActions from "@/app/db/DatabaseActions";
import { RefreshControl } from "react-native-gesture-handler";

export default function SnapsAlbumLayout(props: any) {
    const navigation = useNavigation();
    const getItemId = (item: { id: any; }) => (item.id)

    const [snaps, setSnaps] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchData();
            setRefreshing(false);
        }, 500)
    })

    const getGridData = () => {
        return {
            gridItemArray: photoGrid.data
        }
    }

    const handleOnBeachItemClick = (item) => {
        if (item.name === '') {
            return;
        }

        navigation.navigate({
            name: `${snapsLayoutKeys.BEACH_PROFILE}`,
            params: {
                data: item
            },
        });
    };

    const fetchData = async () => {
        const result = await DatabaseActions.getAllSnaps();
        console.log(`snaps: ${JSON.stringify(result)}`);
        setSnaps(result);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left']}>
            {Object.keys(snaps).length > 0 ?
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={styles.container1}>
                        <PhotoGrid
                            data={{
                                gridItemArray: snaps,
                            }}
                            onClick={(key: string) => handleOnBeachItemClick(key)}
                        />
                    </View>
                </ScrollView>
                : <View style={styles.container2}>
                    <Text style={styles.noSnaps}>
                        {`You don't have any snaps! \r\n Click the + button below to add some`
                        }
                    </Text>
                </View>
            }
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
    container2: {
        flex: 1,
        flexGrow: 1,
        flexDirection: "column",
        alignContent: 'center',
        justifyContent: 'center',
    },
    header1: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 18,
        marginRight: 15,
        marginLeft: 8,
        marginTop: 10
    },
    noSnaps: {
        fontFamily: DefaultFont.fontFamilyMedium,
        fontSize: 15,
        color: 'gray',
        marginRight: 15,
        marginLeft: 8,
        marginTop: 10,
        textAlign: 'center',
    },
});