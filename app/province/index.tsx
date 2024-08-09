import BeachCardList from '@/components/BeachCardList';
import { DefaultFont } from '@/constants/Fonts';
import { mockData } from '@/data/beach';
import { router } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from '@rneui/themed';
import { useEffect, useState } from 'react';
import TabHeaderBar from '@/components/TabHeaderBar';
import { secondaryHeaderBar } from '@/constants/SharedComponent';

const filters = [
    'Albay',
    'Camarines Norte',
    'Camarines Sur',
    'Catanduanes',
    'Masbate',
    'Sorsogon'
];
const provinces = [
    'Albay',
    'Camarines Norte',
    'Camarines Sur',
    'Catanduanes',
    'Masbate',
    'Sorsogon'
];

export default function BeachListLayout({ navigation, route }) {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [data, setData] = useState(provinces);
    const headerTitle = `${route.params.region} 🏖️`


    useEffect(() => {
        navigation.setOptions(secondaryHeaderBar(headerTitle))
    });

    const handleOnClickCard = (item) => {
        console.log(`${JSON.stringify(item)}`);
        router.push({
            pathname: '/beach/[profile]',
            params: {
                id: item.id,
                name: item.name
            }
        })
    }

    const renderBeachList = (province) => {
        return (
            <View key={`_bListView_${province}`} style={styles.container1}>
                <Text key={'_bListHeader'} style={styles.header1}>{province}</Text>
                <BeachCardList
                    key={'_bcList'}
                    data={mockData.data}
                    handleOnClickCard={handleOnClickCard}
                />
            </View>
        );
    }

    const renderChipFilters = (selected = "All") => {
        return (
            <ScrollView
                key={'_chipFilters'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {['All', ...filters].map((title) => (
                    <Chip
                        title={title}
                        key={`_chip_${title}`}
                        color={
                            selected === title ? styles.chipFilterContainer.color
                                : styles.chipFilterDisabled.color
                        }
                        onPress={() => handleChipClick(title)}
                        containerStyle={styles.chipFilterContainer}
                        titleStyle={styles.chipFilterTitle}
                    />
                ))}
            </ScrollView>
        );
    }

    const handleChipClick = (key) => {
        var dataToShow = provinces;
        if (key !== 'All') {
            dataToShow = [key];
        }

        setSelectedFilter(key);
        setData(dataToShow);
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={['right', 'left']}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {renderChipFilters(selectedFilter)}
                {data.map((province) =>
                    renderBeachList(province)
                )}
            </ScrollView>
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
        fontFamily: DefaultFont.fontFamily,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        marginVertical: 10,
    },
})