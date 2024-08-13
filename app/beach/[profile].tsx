import { useState } from 'react';
import {
    Image,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DefaultFont } from '@/constants/Fonts';
import { Button } from '@rneui/themed';
import { Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const samplePhotoGrid = [
    {
        name: 'test',
        key: 1,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
    {
        name: 'test',
        key: 2,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
    {
        name: 'test',
        key: 3,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
]

export default function ProfileLayout() {
    const { name = "Province" } = useLocalSearchParams();
    const headerTitle = `${name}`
    const description = `
        Bagasbas Beach is a scenic strip of white sand located in Daet, Camarines Norte. It is known for its calm and clear waters, making it perfect for swimming and snorkeling. The beach is also a popular spot for fishing and sunset-watching, offering breathtaking views of the surrounding landscape.
    `

    const [image, setImage] = useState(null);

    const renderAddPhotosCta = () => {
        const pickImage = async () => {
            // No permissions request is necessary 
            // for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        };

        return (
            <Button title="Pick an image from camera roll" onPress={pickImage} />
        );
    }

    const renderPhoto = (item) => {
        return (
            <View
                key={`_phGrid_${item.key}`}
            >
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <View style={styles.card}>
                        {true &&
                            <View style={styles.gridItemImg}>
                                <Image
                                    source={item.img}
                                    style={styles.img}
                                />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPhotoGrid = (photos) => {
        var count = 6;
        const columns = photos.length / 3;
        const columnArr = [...Array(columns).keys()];
        const countArr = [...Array(count).keys()];

        console.log(`${photos.length}`)

        const gridRow = (photos) => {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {photos.map((photo) => renderPhoto(photo))}
                </View>
            )
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: 20,
                }}
            >
                {columnArr.map((column) => {
                    return countArr.map((count) => gridRow(photos))
                })}
            </View>
        )
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* {image && <Image source={{ uri: image }} style={styles.imageUploaded} />} */}

            <Text
                key={'_profBch_header'}
                style={styles.headerText}
            >
                {headerTitle}
            </Text>
            <Text
                key={'_profBch_location'}
                style={styles.location}
            >
                {`Daet, Camarines Norte`}ּ
            </Text>
            <Text
                key={'_profBch_photoCount'}
                style={styles.photoCount}
            >
                {`10 photos`}ּ
            </Text>
            <Text
                key={'_profBch_desc'}
                style={styles.description}
            >
                {description}
            </Text>
            <Button
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.button}
                title='Add photos'
            />
            {renderPhotoGrid(samplePhotoGrid)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    headerText: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    description: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        marginHorizontal: 15,
        alignSelf: 'center',
        flexWrap: 'wrap',
    },
    photoCount: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        marginHorizontal: 15,
        alignSelf: 'center',
        flexWrap: 'wrap',
    },
    location: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        marginHorizontal: 15,
        color: 'gray',
        alignSelf: 'center',
        flexWrap: 'wrap',
    },
    imageUploaded: {
        width: 200,
        height: 200,
    },
    img: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 30,
        alignSelf: 'center',
        backgroundColor: 'green',
    },
    buttonTitle: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
    },
    card: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 5,
        width: (Dimensions.get('window').width / 3) - 5,
        marginVertical: 2,
        marginHorizontal: 2,
    },
    gridItemImg: {
        width: '100%',
        height: 100,
        overflow: 'hidden',
        borderRadius: 5
    },
});
