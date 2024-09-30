import BeachCardList from '@/components/BeachCardList';
import { DefaultFont } from '@/constants/Fonts';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
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

export default function VisitedBeachesLayout({ navigation, route }) {
    const { id, name } = route.params.province;
    const headerTitle = `${name}`

    const visitedBeaches = useRef([]);
    const notVisitedBeaches = useRef([]);
    const [selectedFilter, setSelectedFilter] = useState(filters[0].id);
    const [beaches, setBeaches] = useState([]);

    const getVisitedAndNotVisitedBeaches = async () => {
        const visitedAndNotVisitedBeaches = await DatabaseActions.getVisitedAndNotVisitedBeaches(id);

        visitedBeaches.current = visitedAndNotVisitedBeaches?.visited;
        notVisitedBeaches.current = visitedAndNotVisitedBeaches?.notVisited;

        // console.log(`getVisitedAndNotVisited: ${JSON.stringify(visitedAndNotVisitedBeaches)}`)
        setBeaches(visitedBeaches.current);
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

    const renderChipFilters = (selected = filters[0].id) => {
        return (
            <ScrollView
                key={'_chipFilters'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {filters.map((filter) => (
                    <Chip
                        title={filter.title}
                        key={`_chip_${filter.id}`}
                        color={
                            selected === filter.id ? styles.chipFilterContainer.color
                                : styles.chipFilterDisabled.color
                        }
                        onPress={() => handleChipClick(filter.id)}
                        containerStyle={styles.chipFilterContainer}
                        titleStyle={styles.chipFilterTitle}
                    />
                ))}
            </ScrollView>
        );
    }

    const handleChipClick = (id) => {
        const beachesToShow = id === filters[0].id ? visitedBeaches.current : notVisitedBeaches.current;

        setSelectedFilter(id);
        setBeaches(beachesToShow);
    }

    useEffect(() => {
        navigation.setOptions(
            secondaryHeaderBar(headerTitle)
        )
        getVisitedAndNotVisitedBeaches();
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
            edges={['right', 'left']}
        >
            {beaches.length > 0 &&
                <ScrollView
                    showsVerticalScrollIndicator={false}
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