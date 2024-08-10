import MapView, { Callout, Marker } from 'react-native-maps';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {
    philippineCoords,
    visitedBeachesMarkers
} from '@/data/map';
import { useState } from 'react';
import { DefaultFont } from '@/constants/Fonts';

export default function MapLayout() {
    const [region, setRegion] = useState(philippineCoords);
    const [markers, setMarkers] = useState(visitedBeachesMarkers);

    const renderMarkers = (markers) => {
        return markers.map((marker, index) => (
            <Marker
                key={index}
                coordinate={marker.latlng}
            >
                <Callout
                    tooltip={true}
                >
                    <View style={styles.markerContainer}>
                        <Text style={styles.marker}>{marker.title}</Text>
                    </View>
                </Callout>
            </Marker>
        ));
    }

    const onRegionChange = (region) => {
        // console.log(JSON.stringify(region));
        // setRegion(region);
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChange={onRegionChange}
            >
                {renderMarkers(markers)}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    marker: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        color: 'black',
    }
});