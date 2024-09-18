import { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Pressable,
    Platform,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import { Button } from '@rneui/themed';
import { Dimensions } from 'react-native';
import NewBeachSnapModal from './addbeach-modal';
import { snapsLayoutKeys } from '@/constants/Global';
import Animated from 'react-native-reanimated';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import PagerView from 'react-native-pager-view';
import { FlashList } from '@shopify/flash-list';
import { createWeatherLabel, dateStringToMDY, dateStringToTime } from '@/constants/Utils';

const cardCalcWidth = Dimensions.get('window').width / 3;
const listCalcHeight = Dimensions.get('window').height;
const listOffset = Platform.OS === 'ios' ? 250 : 210;
const cardMargin = 0;

export default function ProfileLayout({ navigation, route }) {
    const { name, id, municipality, province, description } = route.params.data;
    const headerTitle = `${name}`
    const address = `${municipality}, ${province}`

    const [snaps, setSnaps] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const isLoading = useRef(true);
    const isReloadingData = useRef(false);
    const pagerViewRef = useRef<PagerView>();

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

    const reloadData = () => {
        isReloadingData.current = true;
        setTimeout(async () => {
            console.log('Reloading data in beach profile page...');
            await fetchData();
            isReloadingData.current = false;
        }, 500)
    }

    const fetchData = async () => {
        isLoading.current = true;

        const result = await DatabaseActions.getAllSnapFromBeach(id);
        console.log(`profile snaps: ${result?.length}`)

        isLoading.current = false;
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

    const renderPhotoGridItem = (item) => {
        const disabled = typeof item.id !== 'number';
        return (<View
            key={`_phGrid_${item.id}`}
        >
            <TouchableOpacity
                onPress={() => {
                    onNavigateDetail(item)
                }}
                disabled={disabled}
            >
                <Animated.View
                    style={styles.card}
                // sharedTransitionTag={parentTransitionTag(item)}
                >
                    {true &&
                        <View style={styles.gridItemImg}>
                            {item.photoUrl &&
                                <Animated.Image
                                    source={{ uri: item.photoUrl }}
                                    style={styles.img}
                                // sharedTransitionTag={childTransitionTag(item)}
                                // sharedTransitionStyle={customTransition}
                                />
                            }
                        </View>
                    }
                </Animated.View>
            </TouchableOpacity>
        </View>)
    }

    const renderPhotoListItem = (item) => {
        return (
            <View style={{ marginBottom: 0 }}>
                <Image
                    key={`_phList_${item.id}`}
                    source={{ uri: item.photoUrl }}
                    style={styles.imgListItem}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginVertical: 10,
                        marginHorizontal: 10,
                        borderRadius: 5,
                    }}
                >
                    {item.caption.length > 0 &&
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 14,
                                color: 'black',
                                alignSelf: 'flex-start'
                            }}
                        >
                            {item.caption}
                        </Text>
                    }
                    <View
                        style={{
                            marginTop: item.caption.length > 0 ? 5 : 0,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 12,
                                color: 'green',
                                alignSelf: 'flex-start'
                            }}
                        >
                            {createWeatherLabel(item)}
                        </Text>
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 10,
                                color: 'gray',
                                alignSelf: 'flex-start'
                            }}
                        >
                            {`${dateStringToMDY(item.dateVisited)}`}
                        </Text>
                    </View>
                </View>
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
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                    key={`photoGrid_${column}+row`}
                >
                    {photos.map((photo) => renderPhotoGridItem(photo))}
                </View>
            )
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
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
        const sizes = [24, 32, 30];
        const disableListTab = snaps.length === 0;

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    alignItems: 'center',
                    alignContent: 'center',
                }}
            >
                {tabIconNames.map((tabName, index) => (
                    <Pressable
                        key={tabName}
                        onPress={() => {
                            handleOnTabChange(index);
                        }}
                        disabled={index === 1 && disableListTab}
                    >
                        <TabBarIcon
                            name={index === selectedIndex ? selectedTabIconNames[index] : tabName}
                            color={index === selectedIndex ? selectedColor : color}
                            size={sizes[index]}
                        />
                    </Pressable>
                ))}
            </View>
        )
    }

    const renderTabPage = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <PagerView
                    style={{
                        ...styles.pagerView,
                        height: listCalcHeight - listOffset,
                    }}
                    initialPage={0}
                    scrollEnabled={true}
                    ref={pagerViewRef}
                    onPageSelected={(e) => {
                        setSelectedTab(e.nativeEvent.position)
                    }}
                >
                    <View style={{
                        ...styles.page,
                        flex: 1,
                    }} key="1">
                        {renderPhotoGridPage()}
                    </View>
                    <View style={{
                        ...styles.page,
                        flex: 1,
                        flexDirection: 'column',
                        marginTop: 20,
                    }} key="2">
                        {renderPhotoList()}
                    </View>
                    <View style={styles.page} key="3">
                        {renderInfoPage()}
                    </View>
                </PagerView>
            </View>
        )
    }

    const renderPhotoGridPage = () => {
        return (
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {snaps.length === 0
                        ? (
                            <View
                                style={{
                                    height: 400,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={styles.pageText}
                                >No snaps to show</Text>
                            </View>
                        )
                        : renderPhotoGrid(snaps)
                    }
                </View>
            </ScrollView>
        )
    }

    const renderPhotoList = () => {
        return snaps.length === 0
            ? (
                <View
                    style={{
                        height: 400,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={styles.pageText}
                    >No snaps to show</Text>
                </View>
            )
            : <FlashList
                showsVerticalScrollIndicator={false}
                data={snaps}
                renderItem={({ item }) => renderPhotoListItem(item)}
                estimatedItemSize={snaps.length + 20} // Allowance of 20 items
            />
    }

    const renderInfoPage = () => {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    margin: 20,
                }}
            >
                <Text style={
                    styles.pageTextHeader
                }>Overview</Text>
                <Text
                    style={{
                        ...styles.pageText,
                        marginTop: 10,
                    }}
                >{description}</Text>
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
        reloadData();
        setShowModal(false);
    }

    const handleOnTabChange = (index: number) => {
        setSelectedTab(index)
        pagerViewRef.current?.setPage(index)
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <NewBeachSnapModal
                preselectedBeach={route.params.data}
                isVisible={showModal}
                onClose={handleOnModalClose}
                onSave={handleOnSaveClick}
            />

            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                }}
            >
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
                {renderTabPage()}
            </View>
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
        aspectRatio: '1/1',
    },
    imgListItem: {
        aspectRatio: '1/1',
        width: '100%',
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
    },
    gridItemImg: {
        width: '100%',
        overflow: 'hidden',
    },
    pagerView: {
        height: listCalcHeight
    },
    page: {
        flex: 1,
    },
    pageText: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 13,
        color: 'gray',
    },
    pageTextHeader: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 15,
        color: 'black',
    },
});
