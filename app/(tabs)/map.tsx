import MapView, { Callout, Marker } from 'react-native-maps';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
    philippineCoords,
    silverMapStyle,
    visitedBeachesMarkers
} from '@/data/map';
import { useEffect, useState } from 'react';
import { DefaultFont } from '@/constants/Fonts';
import { Chip } from '@rneui/themed';
import { useNavigation } from 'expo-router';

const filters = [
    'Bicol',
    'Cagayan Valley',
    'Caraga',
    'Central Luzon',
];

export default function MapLayout() {
    const [region, setRegion] = useState(philippineCoords);
    const [markers, setMarkers] = useState(visitedBeachesMarkers);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const renderMarkers = (markers) => {
        return markers.map((marker, index) => (
            <Marker
                key={index}
                style={styles.marker}
                coordinate={marker.latlng}
                // image={{uri: '@/assets/images/favicon.png'}}
                image={require('@/assets/images/pin.png')}
            >
                <Callout
                    tooltip={true}
                >
                    <View style={styles.markerContainer}>
                        <Text style={styles.markerText}>{marker.title}</Text>
                    </View>
                </Callout>
            </Marker>
        ));
    }

    const renderChipFilters = (selected = "All") => {
        return (
            <ScrollView
                key={'_chipFilters_Map'}
                style={{
                    marginTop: insets.top,
                    marginHorizontal: 10
                }}
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
                        titleStyle={selected === title ?
                            styles.chipFilterTitle : styles.chipFilterTitleDisabled
                        }
                    />
                ))}
            </ScrollView>
        );
    }

    const handleChipClick = (title) => {
        setSelectedFilter(title);
    }

    const onRegionChange = (region) => {
        console.log(JSON.stringify(region));
        // setRegion(region);
    }

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
            <MapView
                style={styles.map}
                customMapStyle={silverMapStyle}
                initialRegion={region}
                onRegionChange={onRegionChange}
            >
                {renderMarkers(markers)}
            </MapView>
            <View
                style={{
                    position: 'absolute',
                }}
            >
                {renderChipFilters(selectedFilter)}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        flex: 1,
        flexDirection: "column",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    markerText: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: '400',
        fontSize: 12,
        color: 'black',
    },
    chipFilterContainer: {
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'green',
    },
    chipFilterTitle: {
        fontFamily: DefaultFont.fontFamily,
        color: 'white'
    },
    chipFilterTitleDisabled: {
        fontFamily: DefaultFont.fontFamily,
        color: 'gray'
    },
    chipFilterDisabled: {
        fontFamily: DefaultFont.fontFamily,
        marginVertical: 15,
        marginHorizontal: 2,
        color: 'white'
    },
});