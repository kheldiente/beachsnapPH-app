import BeachCardList from '@/components/BeachCardList';
import { DefaultFont } from '@/constants/Fonts';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from '@rneui/themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import { secondaryHeaderBar } from '@/constants/SharedComponent';
import { snapsLayoutKeys } from '@/constants/Global';
import * as DatabaseActions from '@/app/db/DatabaseActions';

const NO_FILTER = {
    id: 'ALLPROV',
    name: 'All',
}

const filters = [
    {
        id: '_Visited+Beaches',
        title: 'Visited',
    },
    {
        id: '_NotVisited+Beaches',
        title: 'Not Visited',
    }
]

const FILTER_VISITED = filters[0].id

export default function VisitedBeachesLayout({ navigation, route }) {
    const { id, name } = route.params.province;
    const headerTitle = `${name}`

    const visitedBeaches = useRef([]);
    const notVisitedBeaches = useRef([]);
    const [selectedFilter, setSelectedFilter] = useState(FILTER_VISITED);
    const [beaches, setBeaches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const isLoading = useRef(true);
    const isReloadingData = useRef(false);
    const selectedFilterRef = useRef(FILTER_VISITED);

    const subscribeToAppLifecycle = async () => {
        navigation.addListener('focus', async () => {
            console.log(`reloading data in progress page... ${isLoading.current} ${isReloadingData.current}`);
            if (!isLoading.current && !isReloadingData.current) {
                isReloadingData.current = true;
                setTimeout(async () => {
                    console.log('Reloading data in goals page...');
                    await fetchData();
                    isReloadingData.current = false;
                }, 200)
            }
        });
    }

    const fetchData = async () => {
        isLoading.current = true;

        const visitedAndNotVisitedBeaches = await DatabaseActions.getVisitedAndNotVisitedBeaches(id);

        visitedBeaches.current = visitedAndNotVisitedBeaches?.visited;
        notVisitedBeaches.current = visitedAndNotVisitedBeaches?.notVisited;

        isLoading.current = false;

        const beachesToShow = selectedFilterRef.current === FILTER_VISITED
            ? visitedBeaches.current : notVisitedBeaches.current;
        setBeaches(beachesToShow);
    }

    const handleOnClickCard = (item) => {
        navigation.push(`${snapsLayoutKeys.BEACH_PROFILE}`, {
            data: item
        })
    }

    const renderBeachList = (beaches) => {
        return (
            <View key={`_bListView_${id}`} style={styles.container1}>
                {beaches.length > 0 &&
                    (<BeachCardList
                        key={'_bcList'}
                        data={beaches}
                        handleOnClickCard={handleOnClickCard}
                    />)}
            </View>
        );
    }

    const renderChipFilters = (selected = FILTER_VISITED) => {
        return (
            <ScrollView
                key={'_chipFilters'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {filters.map((filter) => {
                    const visited = filter.id === FILTER_VISITED
                    var title = `${filter.title}`
                    if (visited) {
                        title = title + ` (${visitedBeaches.current.length})`
                    } else {
                        title = title + ` (${notVisitedBeaches.current.length})`
                    }

                    return (
                        <Chip
                            title={title}
                            key={`_chip_${filter.id}`}
                            color={
                                selected === filter.id ? styles.chipFilterContainer.color
                                    : styles.chipFilterDisabled.color
                            }
                            onPress={() => handleChipClick(filter.id)}
                            containerStyle={styles.chipFilterContainer}
                            titleStyle={styles.chipFilterTitle}
                        />
                    )
                })}
            </ScrollView>
        );
    }

    const handleChipClick = (id) => {
        const beachesToShow = id === FILTER_VISITED ? visitedBeaches.current : notVisitedBeaches.current;

        selectedFilterRef.current = id;
        setSelectedFilter(id);
        setBeaches(beachesToShow);
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchData();
            setRefreshing(false);
        }, 500)
    })

    const setStyling = () => {
        navigation.setOptions(
            secondaryHeaderBar(headerTitle)
        );
    }

    useEffect(() => {
        setStyling();
        setTimeout(() => {
            fetchData();
        }, 200);

        subscribeToAppLifecycle();
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
            edges={['right', 'left']}
        >
            {(!isLoading.current && beaches.length > 0) &&
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {renderChipFilters(selectedFilter)}
                    {renderBeachList(beaches)}
                </ScrollView>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 10
    },
    container1: {
        flexDirection: "column"
    },
    chipFilterContainer: {
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'green',
    },
    chipFilterTitle: {
        fontFamily: DefaultFont.fontFamily
    },
    chipFilterDisabled: {
        fontFamily: DefaultFont.fontFamily,
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'lightgray'
    },
    header1: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 18,
        color: 'green',
        marginVertical: 10,
    },
    noBeaches: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        color: 'gray',
        alignSelf: 'center',
    },
})