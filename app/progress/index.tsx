import { DefaultFont } from '@/constants/Fonts';
import { LinearProgress } from '@rneui/themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable
} from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { RefreshControl } from 'react-native-gesture-handler';
import { dateStringToMDY } from '@/constants/Utils';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { myProgressLayoutKeys } from '@/constants/Global';

const progressWheelOptions = (progress) => {
    var fixedProgress = progress; // Only works for android
    if (Platform.OS === 'ios') {
        if (progress > 0) {
            fixedProgress = progress + 1;
        }
    }

    return {
        color: 'darkseagreen',
        backgroundColor: 'lightgray',
        size: 170,
        width: 10,
        duration: 600,
        progress: fixedProgress,
        rounded: true
    }
}

const renderCurrentGoal = (currentGoal, navigation) => {
    const visited = currentGoal.filter((goal) => goal.photoCount > 0).length;
    const totalBeachGoal = currentGoal.length;
    const caption = `Complete your goal this month and unlock achievements. Share it with your friends!`;
    const progress = visited / totalBeachGoal;

    const handleCurrentGoalClick = () => {
        // navigation.navigate(myProgressLayoutKeys.GOAL_LIST);
    }

    return (
        <Pressable
            key={'_currGoal'}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                marginHorizontal: 10,
            }}
        // onPress={() => {
        //     handleCurrentGoalClick();
        // }}
        >
            <View
                style={{
                    // opacity: 0,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingRight: 5,
                    }}
                >
                    <Text
                        key={'_currGoal_header'}
                        style={styles.headerText}
                    >Current Goal</Text>
                    <Ionicons
                        name="eye-outline"
                        color="black"
                        size={22}
                        onPress={() => {
                            handleCurrentGoalClick();
                        }}
                    />
                </View>
                <View
                    key={'_currGoal_msg'}
                    style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}
                >
                    <Text
                        style={{
                            ...styles.headerText,
                            fontSize: 40,
                            alignSelf: 'center',
                        }}
                    >
                        {visited}
                    </Text>
                    <Text
                        style={{
                            ...styles.headerText,
                            fontSize: 14,
                            marginLeft: 5,
                            color: 'darkgray',
                            alignSelf: 'center'
                        }}
                    >
                        {`visited out of ${totalBeachGoal} beaches`}
                    </Text>
                </View>
                <LinearProgress
                    key={'_currGoal_progress'}
                    style={{
                        width: '100%',
                        height: 6,
                        marginBottom: 10,
                        borderRadius: 10,
                    }}
                    value={progress}
                    variant="determinate"
                />
                <Text
                    key={'_currGoal_caption'}
                    style={{
                        ...styles.statsTitle,
                        flexWrap: 'wrap'
                    }}
                >
                    {caption}
                </Text>
            </View>
        </Pressable>
    )
}

const renderStatCard = (data) => {
    return (
        <View
            key={`visited_bchList+${data.key}`}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                marginHorizontal: 10,
                marginTop: 10,
            }}
        >
            <Text style={styles.headerText}>{data.title}</Text>
            {data.list.map((item) => (
                <View
                    key={`_visited_bchList+${data.key}+${item.beach.id}}`}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginTop: 10,
                    }}>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 15,
                            color: 'black',
                        }}>{item.beach.name}</Text>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 10,
                            color: 'gray'
                        }}>As of {dateStringToMDY(item.dateVisited, true)}</Text>
                    </View>
                    <Text style={{
                        fontFamily: DefaultFont.fontFamilyBold,
                        fontSize: 12,
                        alignSelf: 'center',
                        color: 'black',
                    }}>{item.photoCount === 1
                        ? '1 snap'
                        : `${item.photoCount} snaps`
                        }</Text>
                </View>
            ))}
        </View>
    )
}

export default function ProgressListLayout() {
    const navigation = useNavigation();

    const [recentVisitedBeaches, setRecentVisitedBeaches] = useState([]);
    const [beachesWithManyPhotos, setBeachesWithManyPhotos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const isLoading = useRef(true);
    const isReloadingData = useRef(false);
    const totalCounts = useRef({
        totalBeaches: 500,
        totalRegions: 500,
        totalProvinces: 500,
        totalMunicipalities: 500,
    })
    const [generalGoalStats, setGeneralGoalStats] = useState({
        visitedBeaches: 0,
        visitedRegions: 0,
        visitedProvinces: 0,
        visitedMunicipalities: 0,
    });
    const currentGoal = useRef([]);

    const subscribeToAppLifecycle = async () => {
        navigation.addListener('focus', async () => {
            console.log(`reloading data in progress page... ${isLoading.current} ${isReloadingData.current}`);
            if (!isLoading.current && !isReloadingData.current) {
                isReloadingData.current = true;
                setTimeout(async () => {
                    console.log('Reloading data in goals page...');
                    await fetchData();
                    isReloadingData.current = false;
                }, 500)
            }
        });
    }

    const getGoalTitleByKey = (key) => {
        var title = '';
        if (key === 'visitedRegions') {
            title = 'regions'
        } else if (key === 'visitedProvinces') {
            title = 'provinces'
        } else if (key === 'visitedMunicipalities') {
            title = 'municipalities'
        }
        return title;
    }

    const getTotalCount = (key) => {
        var count = 500;
        if (key === 'visitedRegions') {
            count = totalCounts.current.totalRegions
        } else if (key === 'visitedProvinces') {
            count = totalCounts.current.totalProvinces
        } else if (key === 'visitedMunicipalities') {
            count = totalCounts.current.totalMunicipalities
        }
        return count;
    }

    const renderStats = (stat) => {
        return (
            <View
                key={`_stats+${stat.title}_${stat.statsCount}`}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Text style={styles.statsCount}>{stat.statsCount}</Text>
                <Text style={{
                    fontFamily: DefaultFont.fontFamily,
                    fontSize: 10,
                    alignSelf: 'center',
                    color: 'gray'
                }}>out of {stat.total}</Text>
                <Text style={{
                    ...styles.statsTitle,
                    fontSize: 10,
                }}>{stat.title}</Text>
            </View>
        )
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchData();
            setRefreshing(false);
        }, 500)
    })

    const fetchData = async () => {
        isLoading.current = true;

        const data = await DatabaseActions.getGeneralGoalStats();
        const recentVisitedBeaches = await DatabaseActions.getRecentVisitedBeaches();
        const topBeachesWithPhotos = await DatabaseActions.getTopBeachesWithManyPhotos();
        const goals = await DatabaseActions.getLatestGoal();

        currentGoal.current = goals;
        totalCounts.current = {
            totalBeaches: data?.totalBeaches,
            totalRegions: data?.totalRegions,
            totalProvinces: data?.totalProvinces,
            totalMunicipalities: data?.totalMunicipalities
        }

        isLoading.current = false;

        setGeneralGoalStats({
            visitedBeaches: data?.visitedBeaches,
            visitedRegions: data?.visitedRegions,
            visitedProvinces: data?.visitedProvinces,
            visitedMunicipalities: data?.visitedMunicipalities,
        });

        setRecentVisitedBeaches(recentVisitedBeaches);
        setBeachesWithManyPhotos(topBeachesWithPhotos);
    }

    const initData = async () => {
        await fetchData();
    }

    useEffect(() => {
        setTimeout(() => {
            initData();
        }, 500)

        subscribeToAppLifecycle();
    }, [])

    return (
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
            {isLoading.current
                ? <View />
                : (<View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingBottom: 15,
                    }}
                >
                    <View
                        key={'_progWhl_container'}
                        style={styles.container}
                    >
                        <AnimatedProgressWheel
                            key={'_progWhl'}
                            max={totalCounts?.current.totalBeaches}
                            showProgressLabel={true}
                            rotation={'-90deg'}
                            subtitle={`visited out of \r\n ${totalCounts?.current.totalBeaches} beaches`}
                            labelStyle={styles.labelText}
                            subtitleStyle={styles.text}
                            animateFromValue={0}
                            {...progressWheelOptions(
                                generalGoalStats ? generalGoalStats.visitedBeaches : 0
                            )}
                        />
                    </View>
                    <View
                        key={'_stat_container'}
                        style={{
                            ...styles.statsContainer,
                            marginBottom: 20,
                        }}
                    >
                        {Object.keys(generalGoalStats).map((statKey) => {
                            if (statKey !== 'visitedBeaches') {
                                return renderStats({
                                    title: getGoalTitleByKey(statKey),
                                    total: getTotalCount(statKey),
                                    statsCount: generalGoalStats[`${statKey}`],
                                })
                            }
                        })}
                    </View>
                    {renderCurrentGoal(currentGoal.current, navigation)}
                    {recentVisitedBeaches.length > 0 &&
                        renderStatCard({
                            title: 'Last visited beaches',
                            key: 'STAT1',
                            list: recentVisitedBeaches,
                        })
                    }
                    {beachesWithManyPhotos.length > 0 &&
                        renderStatCard({
                            title: 'Top beaches with many snaps',
                            key: 'STAT2',
                            list: beachesWithManyPhotos,
                        })
                    }
                </View>)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 8,
    },
    headerText: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
        color: 'black',
    },
    text: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        color: 'gray'
    },
    statsCount: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 25,
        color: 'black'
    },
    statsTitle: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        color: 'gray'
    },
    labelText: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 40,
        color: 'gray'
    },
});
