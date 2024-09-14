import { useCallback, useEffect, useState } from 'react';
import {
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
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { RefreshControl } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

const cardCalcWidth = Dimensions.get('window').width / 3;
const cardMargin = 5;

export default function ProfileLayout({ navigation, route }) {
    const { name, id, municipality, province } = route.params.data;
    const headerTitle = `${name}`
    const address = `${municipality}, ${province}`

    const [snaps, setSnaps] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    var photoSizeLabel = `${snaps.length}`;
    if (snaps.length === 1) {
        photoSizeLabel = photoSizeLabel + ' photo'
    } else {
        if (snaps.length === 0) {
            photoSizeLabel = 'No photos'
        } else {
            photoSizeLabel = photoSizeLabel + ' photos'
        }
    }

    const [showModal, setShowModal] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchData();
            setRefreshing(false);
        }, 500)
    })

    const fetchData = async () => {
        const result = await DatabaseActions.getAllSnapFromBeach(id);
        console.log(`profile snaps: ${result?.length}`)
        setSnaps(result);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onNavigateDetail = useCallback((currentData: { id: number; img: string }) => {
        navigation.navigate(snapsLayoutKeys.PHOTO_POST, {
            data: {
                ...currentData,
                image: currentData.photoUrl,
            },
            parentId: id,
            callback: null,
            from: 'Profile',
        });
    },
        [id, navigation],
    );

    const parentTransitionTag = (item) => {
        return 'Profile' + item.id.toString();
    }

    const childTransitionTag = (item) => {
        return 'Profile' + item.id.toString() + id.toString();
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
                                    source={{ uri: item.photoUrl }}
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

    const renderPhotoGrid = (data) => {
        var count = 3;
        var startIdx = 0;

        const photos = [...data];
        const columns = Math.ceil(photos.length / 3);
        const columnArr = [...Array(columns).keys()];

        const remaining = (columnArr.length * count) - photos.length
        if (remaining !== 0) {
            [...Array(remaining).keys()].forEach((index) => {
                photos.push({
                    id: `empty_${index}+snap+${new Date().toDateString()}`
                })
            })
        }

        const gridRow = (column, photos) => {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                    key={`photoGrid_${column}+row`}
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
                    var endIdx = startIdx + count
                    const row = gridRow(column, photos.slice(startIdx, endIdx))

                    startIdx = endIdx;
                    return row;
                })}
            </View>
        )
    }

    const renderTabs = (selectedIndex: number) => {
        const tabIconNames = ['grid-outline', 'reorder-four-outline', 'information-circle-outline'];
        const selectedTabIconNames = ['grid', 'reorder-four', 'information-circle'];
        const color = 'gray';
        const selectedColor = 'black';
        const sizes = [26, 28, 28];
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 30,
                }}
            >
                {tabIconNames.map((tabName, index) => (
                    <TabBarIcon
                        key={tabName}
                        name={index === selectedIndex ? selectedTabIconNames[index] : tabName}
                        color={index === selectedIndex ? selectedColor : color}
                        size={sizes[index]}
                        onPress={() => setSelectedTab(index)}
                    />
                ))}
            </View>
        )
    }

    const renderTabPag = (selectedIndex: number) => {
        if (selectedIndex === 0) {
            return (
                snaps.length > 0
                    ? renderPhotoGrid(snaps)
                    : <View />
            )
        }
        return <View />
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
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
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
                {address}ּ
            </Text>
            <Button
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.button}
                onPress={handleAddPhotosCtaClick}
                title='Add photo'
            />
            {renderTabs(selectedTab)}
            {renderTabPag(selectedTab)}
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
