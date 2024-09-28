import { DefaultFont } from '@/constants/Fonts';
import { items, myProgressLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { dateStringToMDY } from '@/constants/Utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { secondaryHeaderBar } from '@/constants/SharedComponent';

export default function GoalListLayout({ navigation, route }) {
    const headerTitle = 'Current goal'
    const beachListRef = useRef([]);

    const [beachList, setBeachList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const isLoading = useRef(true);
    const isReloadingData = useRef(false);

    const subscribeToAppLifecycle = async () => {
        navigation.addListener('focus', async () => {
            console.log(`reloading data in current goal page... ${isLoading.current} ${isReloadingData.current}`);
            if (!isLoading.current && !isReloadingData.current) {
                isReloadingData.current = true;
                setTimeout(async () => {
                    console.log('Reloading data in current goal page...');
                    await fetchData();
                    isReloadingData.current = false;
                }, 200)
            }
        });
    }


    const renderBeachCardItem = (item) => {
        const handleOnClickCardItem = () => {
            navigation.navigate(snapsLayoutKeys.BEACH_PROFILE, {
                data: item.beach
            });
        }

        const renderRightCta = () => {
            return (item.photoCount > 0
                ? <Text style={{
                    fontFamily: DefaultFont.fontFamilyBold,
                    fontSize: 14,
                    alignSelf: 'center',
                    color: 'black',
                }}>
                    {item.photoCount === 1
                        ? '1 snap'
                        : `${item.photoCount} snaps`
                    }
                </Text>
                : (
                    <TouchableOpacity
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            handleOnClickCardItem(item)
                        }}
                    >
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 14,
                            color: 'darkviolet',
                        }}>Add snap</Text>
                    </TouchableOpacity>
                )
            )
        }

        return (
            <View
                key={`visited_bchList+${item.id}`}
                style={{
                    backgroundColor: 'papayawhip',
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    marginHorizontal: 10,
                    marginTop: 10,
                }}
            >
                <View
                    key={`_goal_bchList+${item.id}`}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingVertical: 20,
                    }}>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 20,
                            color: 'black',
                        }}>{item.beach.name}</Text>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 12,
                            color: 'gray'
                        }}>{item.beach.municipality}, {item.beach.province}</Text>
                    </View>
                    {renderRightCta()}
                </View>
            </View>
        )
    }

    const fetchData = async () => {
        isLoading.current = true;

        beachListRef.current = await DatabaseActions.getLatestGoal();
        const beachIds = beachListRef.current.map((goal) => goal.beachId)
        const details = await DatabaseActions.getBeachesWithIds(beachIds);

        beachListRef.current = beachListRef.current.map((beach) => ({
            ...beach,
            photoCount: beach.photoCount === undefined ? 0 : beach.photoCount,
            beach: details.filter((detail) => beach.beachId === detail.id)[0]
        }));
        beachListRef.current.sort((bch1, bch2) => bch2.photoCount - bch1.photoCount);

        const visited = beachListRef.current.filter((item) => item.photoCount > 0).length
        setStyling(visited, beachListRef.current.length)

        isLoading.current = false;
        setBeachList(beachListRef.current);
    }

    const setStyling = (progress, maxProgress) => {
        navigation.setOptions(
            secondaryHeaderBar(`${headerTitle} (${progress}/${maxProgress})`)
        )
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchData();
            setRefreshing(false);
        }, 500)
    })

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 200);

        subscribeToAppLifecycle();
    }, [])

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
            <ScrollView
                style={styles.root}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {(!isLoading.current && beachList.length > 0) &&
                    <ScrollView>
                        {beachList.map((item) => renderBeachCardItem(item))}
                    </ScrollView>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white',
    },
});