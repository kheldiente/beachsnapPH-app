import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const noSnapsLabel = `You don't have any snaps! \r\n Click the + button below to add some`;

    const [snaps, setSnaps] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const isLoading = useRef(true);
    const isReloadingData = useRef(false);
    const provinceOrder = useRef([]);

    const subscribeToAppLifecycle = async () => {
        navigation.addListener('focus', async () => {
            if (!isLoading.current && !isReloadingData.current) {
                isReloadingData.current = true;
                setTimeout(async () => {
                    console.log('Reloading data in snaps page...');
                    await fetchData();
                    isReloadingData.current = false;
                }, 500)
            }
        });
    }

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

    const handleOnClickRightCta = (item) => {
        if (item.name === '') {
            return;
        }

        navigation.navigate({
            name: `${snapsLayoutKeys.VISITED_BEACHES}`,
            params: {
                province: item
            },
        });
    }

    const getSortedProvinceByVisitedBeaches = (snaps) => {
        var sortedProvinces = {};
        provinceOrder.current.forEach((order) => {
            sortedProvinces[order.id] = snaps[order.id]
        })
        return sortedProvinces;
    }

    const fetchData = async () => {
        isLoading.current = true;

        const result = await DatabaseActions.getAllSnaps();
        isLoading.current = false;

        provinceOrder.current = result.order;
        setSnaps(result.provinceWithSnaps);
    }

    const initData = async () => {
        await fetchData();
    }

    useEffect(() => {
        initData();
        subscribeToAppLifecycle();
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
                                gridItemArray: getSortedProvinceByVisitedBeaches(snaps),
                            }}
                            onClick={(key: string) => handleOnBeachItemClick(key)}
                            onClickRightCta={(item) => handleOnClickRightCta(item)}
                        />
                    </View>
                </ScrollView>
                : isLoading.current ? <View />
                    : (
                        <View style={styles.container2}>
                            <Text style={styles.noSnaps}>
                                {noSnapsLabel}
                            </Text>
                        </View>
                    )
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