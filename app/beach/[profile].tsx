import { useCallback, useState } from 'react';
import {
    Image,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { Button } from '@rneui/themed';
import { Dimensions } from 'react-native';
import NewBeachSnapModal from './addbeach-modal';
import { snapsLayoutKeys } from '@/constants/Global';
import Animated from 'react-native-reanimated';

const cardCalcWidth = Dimensions.get('window').width / 3;
const cardMargin = 5;

const samplePhotoGrid = [
    {
        name: 'test',
        id: 1,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
    {
        name: 'test',
        id: 2,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
    {
        name: 'test',
        id: 3,
        img: require('@/assets/images/thumbnail/bicol-thumbnail.jpeg'),
    },
]

export default function ProfileLayout({ navigation, route }) {
    const { name } = route.params;
    const headerTitle = `${name}`
    const description = `Bagasbas Beach is a scenic strip of white sand located in Daet, Camarines Norte. It is known for its calm and clear waters, making it perfect for swimming and snorkeling. The beach is also a popular spot for fishing and sunset-watching, offering breathtaking views of the surrounding landscape.`

    const [showModal, setShowModal] = useState(false);
    const data = {
        id: 20020,
        image: 'https://plus.unsplash.com/premium_photo-1676750395664-3ac0783ae2c2?q=80&w=474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    }

    const onNavigateDetail = useCallback(
        (currentData: { id: number; img: string }) => {
            navigation.navigate(snapsLayoutKeys.PHOTO_POST, {
                data: {
                    ...currentData,
                    image: 'https://picsum.photos/id/39/200',
                },
                parentId: data.id,
                callback: null,
                from: 'Profile',
            });
        },
        [data.id, navigation],
    );

    const parentTransitionTag = (item) => {
        return 'Profile' + item.id.toString();
    }

    const childTransitionTag = (item) => {
        return 'Profile' + item.id.toString() + data.id.toString();
    }

    const renderPhoto = (item) => {
        return (
            <View
                key={`_phGrid_${item.id}`}
            >
                <TouchableOpacity
                    onPress={() => {
                        onNavigateDetail(item)
                    }}
                >
                    <Animated.View
                        style={styles.card}
                        // sharedTransitionTag={parentTransitionTag(item)}
                    >
                        {true &&
                            <View style={styles.gridItemImg}>
                                <Animated.Image
                                    source={{ uri: 'https://picsum.photos/id/39/200' }}
                                    style={styles.img}
                                    // sharedTransitionTag={childTransitionTag(item)}
                                    // sharedTransitionStyle={customTransition}
                                />
                            </View>
                        }
                    </Animated.View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPhotoGrid = (photos) => {
        var count = 6;
        const columns = photos.length / 3;
        const columnArr = [...Array(columns).keys()];
        const countArr = [...Array(count).keys()];

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

    const handleAddPhotosCtaClick = () => {
        setShowModal(true);
    }

    const handleOnModalClose = () => {
        setShowModal(false);
    }

    const handleOnSaveClick = () => {
        setShowModal(false);
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <NewBeachSnapModal
                isVisible={showModal}
                onClose={handleOnModalClose}
                onSave={handleOnSaveClick}
            />

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
            {/* <Text
                key={'_profBch_desc'}
                style={styles.description}
                numberOfLines={3}
                ellipsizeMode='tail'
            >
                {description}
            </Text> */}
            <Button
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.button}
                onPress={handleAddPhotosCtaClick}
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
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 25,
        alignSelf: 'center',
    },
    description: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        marginHorizontal: 20,
        marginTop: 10,
        color: 'gray',
        alignSelf: 'center',
        textAlign: 'center',
    },
    photoCount: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 12,
        marginTop: 10,
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
    img: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 30,
        marginTop: 10,
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
        width: cardCalcWidth - cardMargin,
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
