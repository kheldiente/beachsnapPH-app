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

export default function BeachListLayout({ navigation, route }) {
    const { id, name } = route.params.region;
    const headerTitle = `${name}`

    const allProvinces = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState(NO_FILTER.id);
    const [provinces, setProvinces] = useState([]);

    const getProvinces = async () => {
        const cProvinces = await DatabaseActions.getAllProvinces(id);

        allProvinces.current = cProvinces;
        setProvinces(cProvinces);
    }

    const getFilters = () => {
        return [
            NO_FILTER,
            ...allProvinces.current,
        ]
    }

    const handleOnClickCard = (item) => {
        navigation.push(`${snapsLayoutKeys.BEACH_PROFILE}`, {
            id: item.id,
            name: item.name,
        })
    }

    const renderBeachList = (province) => {
        return (
            <View key={`_bListView_${province.id}`} style={styles.container1}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text key={'_bListHeader'} style={styles.header1}>{province.name}</Text>
                    {province.beaches.length === 0 &&
                        <Text
                            key={'_bList+noBeaches'}
                            style={styles.noBeaches}
                        >No beaches</Text>
                    }
                </View>
                {province.beaches.length > 0 &&
                    (<BeachCardList
                        key={'_bcList'}
                        data={province.beaches}
                        handleOnClickCard={handleOnClickCard}
                    />)}
            </View>
        );
    }

    const renderChipFilters = (selected = "ALLPROV") => {
        return (
            <ScrollView
                key={'_chipFilters'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {getFilters().map((province) => (
                    <Chip
                        title={province.name}
                        key={`_chip_${province.id}`}
                        color={
                            selected === province.id ? styles.chipFilterContainer.color
                                : styles.chipFilterDisabled.color
                        }
                        onPress={() => handleChipClick(province.id)}
                        containerStyle={styles.chipFilterContainer}
                        titleStyle={styles.chipFilterTitle}
                    />
                ))}
            </ScrollView>
        );
    }

    const handleChipClick = (id) => {
        var dataToShow = allProvinces.current;
        if (id !== 'ALLPROV') {
            dataToShow = dataToShow.filter((province) =>
                province.id === id
            );
        }

        setSelectedFilter(id);
        setProvinces(dataToShow);
    }

    useEffect(() => {
        navigation.setOptions(
            secondaryHeaderBar(headerTitle)
        )
        getProvinces();
    }, []);

    return (
        <SafeAreaView
            style={styles.container}
            edges={['right', 'left']}
        >
            {allProvinces.current &&
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {renderChipFilters(selectedFilter)}
                    {provinces.map((province) =>
                        renderBeachList(province)
                    )}
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