import BeachCardList from '@/components/BeachCardList';
import { DefaultFont } from '@/constants/Fonts';
import { mockData } from '@/data/beach';
import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from '@rneui/themed';
import { useState } from 'react';

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

export default function RegionList() {
    const { region = "EMPTY" } = useLocalSearchParams();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [data, setData] = useState(provinces);

    console.log(`Showing provinces for ${region}`)

    const renderBeachList = (province) => {
        return (
            <View style={styles.container1}>
                <Text style={styles.header1}>{province}</Text>
                <BeachCardList data={mockData.data} />
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
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'green',
    },
    chipFilterDisabled: {
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