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
import { useState } from 'react';
import TabHeaderBar from '@/components/TabHeaderBar';

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

    navigation.setOptions({
        headerBackVisible: false,
        headerTitle: (props) => (
            <TabHeaderBar
                id="tabHeaderBar"
                title={`${route.params.region} 🏖️`}
                {...props}
            />
        )
    })

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
            <View style={styles.container1}>
                <Text style={styles.header1}>{province}</Text>
                <BeachCardList
                    data={mockData.data}
                    handleOnClickCard={handleOnClickCard}
                />
            </View>
        );
    }

    const renderChipFilters = (selected = "All") => {
        return (
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {['All', ...filters].map((title) => (
                    <Chip
                        title={title}
                        key={`_chip_${title}`}
                        color={
                            selected === title ? styles.chipFilter.color
                                : styles.chipFilterDisabled.color
                        }
                        onPress={() => handleChipClick(title)}
                        containerStyle={styles.chipFilter}
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
    chipFilter: {
        fontFamily: DefaultFont.fontFamily,
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'green',
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
    },
})