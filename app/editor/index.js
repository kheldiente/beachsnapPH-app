import {
    View,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Modal,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Divider, Image } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Button, Switch, Chip } from '@rneui/themed';
import Animated, { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { addKeyboardListener, dateStringToTime, dateToMDY } from '@/constants/Utils';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultWeather, items } from '@/constants/Global';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { FlashList } from '@shopify/flash-list';
import { askMediaLbraryPermission } from '../directory';

const imgDimension = 300;
const modalBorderRadius = 10;
const maxCharacters = 200;

export const generateParams = (currSnapData) => {
    return {
        beachId: currSnapData.current?.beach.id,
        provinceId: currSnapData.current?.beach.provinceId,
        regionId: currSnapData.current?.beach.regionId,
        photoUrl: currSnapData.current?.image,
        caption: currSnapData.current?.caption,
        dateVisited: currSnapData.current?.dateVisited,
        weatherId: currSnapData.current?.weather.id,
        metadata: currSnapData.current?.beach.province + `+${currSnapData.current?.beach.name}` + `_${new Date().getMilliseconds()}`
    }
};

export default function BeachSnapEditor(props) {
    const preselectedBeach = props.preselectedBeach
        ? props.preselectedBeach
        : { name: '' }
    const insets = useSafeAreaInsets();
    const estListSize = 20;
    var imageContainerH = 350; // Measured in console.logs

    const beachPageDisplayed = useRef(false);
    const dateVisited = useRef(new Date());
    const selectedBeach = useRef(preselectedBeach);
    const imageRef = useRef(null);
    const selectedWeatherRef = useRef(defaultWeather);
    const datePickerMode = useRef('date');

    const [caption, setCaption] = useState('');
    const [favorited, setFavorited] = useState(false);
    const [imageCtrOpacity, setImageCtrOpacity] = useState(1);

    const calcImageContainerH = useSharedValue(imageContainerH);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [showSearchBeachPage, setShowSearchBeachPage] = useState(false);
    const [image, setImage] = useState(null);
    const [matchedBeaches, setMatchedBeaches] = useState(null);
    const [weathers, setWeathers] = useState(null);
    const [selectedWeather, setSelectedWeather] = useState(null);
    const [showiOStimePicker, setShowiOStimePicker] = useState(false);

    const pickImage = async () => {
        const checkIfDiffImg = (result) => {
            return imageRef === null
                || imageRef.current !== result.assets[0].uri;
        }

        // No permissions request is necessary 
        // for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });
        const isValid = !result.canceled;

        if (isValid) {
            const isImage = result.assets[0].type === 'image';
            if (isImage && checkIfDiffImg(result)) {
                await askMediaLbraryPermission();

                var img = Platform.select({
                    ios: `ph://${result.assets[0].assetId}`,
                    default: result.assets[0].uri,
                })

                imageRef.current = img;
                setImage(imageRef.current);
                handleOnUpdatedBeachData();
            }
        } else {
            if (result.assets) {
                console.log(`Selected file is ${result.assets[0].type}`)
            } else {
                console.log('No file selected')
            }
        }
    };

    const handleOnChangeFavorited = (value) => {
        setFavorited(value);
    }

    const handleOnCaptionChange = (text) => {
        setCaption(text);

        handleOnUpdatedBeachData();
    }

    const handleOnSelectDate = () => {
        datePickerMode.current = 'time';

        if (Platform.OS === 'android') {
            setShowDateTimePicker(false)
            setTimeout(() => {
                setShowDateTimePicker(true);
            }, 100)
        } else {
            setShowiOStimePicker(true);
        }
    }

    const handleOnSelectTime = () => {
        if (Platform.OS === 'ios') {
            setShowiOStimePicker(false);
            setShowDateTimePicker(false);
        } else {
            setShowDateTimePicker(false);
        }

        props.onSelectDate
            ? props.onSelectDate()
            : null

        handleOnUpdatedBeachData();

        datePickerMode.current = 'date'; // Reset to date mode
    }

    const handleDateTimeAndroidPickerDismissed = () => {
        datePickerMode.current = 'date';
        setShowDateTimePicker(false);
    }

    const handleOnUpdatedBeachData = () => {
        props.onUpdatedBeachData
            ? props.onUpdatedBeachData({
                image: imageRef.current,
                beach: selectedBeach.current,
                dateVisited: dateVisited.current,
                caption: caption,
                favorited: favorited,
                weather: selectedWeatherRef.current,
            }) : null
    }

    const handleOnChangeBeachName = (item) => {
        console.log(`changeBeachName: ${JSON.stringify(item)}`)

        if (item === null) {
            return;
        }

        beachPageDisplayed.current = false;
        selectedBeach.current = item;

        setShowSearchBeachPage(false);
        props.onChangeBeachName
            ? props.onChangeBeachName(item)
            : null

        handleOnUpdatedBeachData();
    }

    const renderAddPhotosCta = () => {
        return (
            <View
                style={{
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity onPress={pickImage}>
                    <View style={{
                        ...styles.imageUploaded,
                        backgroundColor: 'gainsboro',
                    }} />
                    <View
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Text style={styles.addPhotoLabel}>Click to add photo</Text>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }

    const renderPhotoWithChangeCta = (image) => {
        return (
            <View>
                <Image source={{ uri: image }} style={styles.imageUploaded} />
                <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.changePhoto}>Change photo</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const getBeachesFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const searchBeachFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const handleSearchInputChange = (text) => {
        setTimeout(() => {
            searchBeachFromDb(text)
        }, 200)
    }

    const handleOnWeatherItemClick = (item) => {
        selectedWeatherRef.current = item;

        setSelectedWeather(item);
        handleOnUpdatedBeachData();
    }

    const renderListItemOptions = () => {
        const handleOnBeachNameItemClick = () => {
            beachPageDisplayed.current = true;
            setShowSearchBeachPage(true);

            getBeachesFromDb();
        }

        const handleOnDateVisitedItemClick = () => {
            console.log(`handleOnDateVisitedItemClick showDateTimePicker: ${showDateTimePicker}`)
            setShowDateTimePicker(true);
        }

        const renderWeatherChipFilter = () => {
            const markAsSelected = selectedWeather ? selectedWeather : defaultWeather;
            return (
                <ScrollView
                    key={'_chipFilters'}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        paddingHorizontal: 10,
                    }}
                >
                    {weathers.map((item) => (
                        <Chip
                            title={item.name}
                            key={`_chip_${item.id}`}
                            color={
                                item.id === markAsSelected.id
                                    ? styles.chipSelected.color
                                    : styles.chipUnselected.color
                            }
                            containerStyle={styles.chipFilterContainer}
                            titleStyle={styles.chipFilterTitle}
                            onPress={() => handleOnWeatherItemClick(item)}
                        />
                    ))}
                </ScrollView>
            )
        }
        const renderItemValue = (key) => {
            var value = ''
            if (key === '_bchName') {
                value = selectedBeach.current.name
            } else if (key === '_dateVstd') {
                value = dateToMDY(dateVisited.current) + ' - ' + dateStringToTime(dateVisited.current)
            } else if (key === '_weather') {
                value = selectedWeather
                    ? selectedWeather.name
                    : defaultWeather.name
            }

            if (!value || value.length === 0) {
                return null;
            }

            return (
                <Text
                    key={key}
                    style={{
                        fontFamily: DefaultFont.fontFamily,
                        fontSize: 12,
                        alignSelf: 'center',
                        backgroundColor: 'lightgray',
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        marginHorizontal: 8,
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >{value}</Text>
            )
        }

        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginVertical: 10,
                }}
            >
                {items.map((item, index) => {
                    return (
                        <View
                            key={`_listItem+${item.key}`}
                        >
                            <TouchableOpacity
                                key={`_chevronList+${item.key}`}
                                onPress={() => {
                                    if (item.key === '_bchName') {
                                        handleOnBeachNameItemClick();
                                    } else if (item.key === '_dateVstd') {
                                        handleOnDateVisitedItemClick();
                                    }

                                    props.onSelectItem ? props.onSelectItem(
                                        `_chevronList+${item.key}`
                                    ) : null
                                }}
                                disabled={item.key === '_weather'}
                            >
                                {index === 0 && <Divider />}
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        paddingHorizontal: 12,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Ionicons name={`${item.icon}-outline`} color="black" size={22} />
                                        <Text style={{
                                            marginLeft: 10,
                                            fontFamily: DefaultFont.fontFamily,
                                            alignSelf: 'center',
                                        }}>{item.title}</Text>
                                    </View>
                                    <View>
                                        {item.type === 'chevron' ?
                                            (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    {renderItemValue(item.key)}
                                                    <Ionicons style={{ alignSelf: 'flex-end' }} name="chevron-forward" color="black" size={22} />
                                                </View>
                                            )
                                            : item.type === 'chip' ? renderItemValue(item.key)
                                                : <Switch
                                                    style={{
                                                        alignSelf: 'flex-end',
                                                        padding: 0,
                                                        transform: Platform.OS === 'ios'
                                                            ? [{ scaleX: .7 }, { scaleY: .7 }]
                                                            : [{ scaleX: 1 }, { scaleY: 1 }],
                                                    }}
                                                    value={favorited}
                                                    trackColor={'green'}
                                                    thumbColor={'white'}
                                                    onValueChange={handleOnChangeFavorited}
                                                />
                                        }
                                    </View>
                                </View>
                                {item.type !== 'chip' && <Divider />}
                            </TouchableOpacity>
                            {item.type === 'chip' && (
                                <View>
                                    {weathers && renderWeatherChipFilter()}
                                </View>
                            )}
                        </View>
                    )
                })}
            </View>
        )
    }

    const renderDatePickerModal = () => {
        const pickerMode = datePickerMode.current;
        const pickerCta = pickerMode === 'time' ? 'Select time' : 'Select date';

        const onDateChangeDefault = (event, selectedDate) => {
            console.log(`onDateChange: ${JSON.stringify(event.type)}, selected: ${selectedDate}`)
            dateVisited.current = selectedDate;
        }

        const onDateChangeOnAndroid = (event, selectedDate) => {
            if (event.type === 'set') {
                console.log(`onDateChange: ${JSON.stringify(event.type)}, selected: ${selectedDate}`)
                dateVisited.current = selectedDate;

                if (pickerMode === 'date') {
                    handleOnSelectDate();
                } else {
                    handleOnSelectTime();
                }
            } else if (event.type === 'dismissed') {
                handleDateTimeAndroidPickerDismissed();
            }
        };

        if (Platform.OS === 'android') {
            return (<RNDateTimePicker
                style={{
                    marginTop: 10,
                    backgroundColor: 'white',
                }}
                mode={pickerMode}
                value={dateVisited.current}
                maximumDate={new Date()}
                onChange={onDateChangeOnAndroid}
                positiveButton={{ label: pickerCta, textColor: 'green' }}
                negativeButton={{ label: 'Cancel', textColor: 'black' }}
            />)
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDateTimePicker}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        padding: 10,
                        paddingBottom: insets.bottom + 5,
                        borderRadius: modalBorderRadius,
                    }}
                >
                    <RNDateTimePicker
                        style={{
                            marginTop: 10,
                            backgroundColor: 'white',
                        }}
                        mode={pickerMode}
                        display={'spinner'}
                        value={dateVisited.current}
                        maximumDate={new Date()}
                        onChange={onDateChangeDefault}

                    />
                    {Platform.OS === 'ios'
                        ? (<Button
                            buttonStyle={{
                                backgroundColor: 'green',
                                borderRadius: 10,
                                width: '100%'
                            }}
                            titleStyle={{
                                fontFamily: DefaultFont.fontFamilyBold,
                            }}
                            title={pickerCta}
                            onPress={() => {
                                if (showiOStimePicker) {
                                    handleOnSelectTime();
                                } else {
                                    handleOnSelectDate();
                                }
                            }}
                        />)
                        : null
                    }
                </View>
            </Modal>
        )
    }

    const renderSearchBeachModal = () => {
        const renderBeachList = () => {
            const renderItem = (item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                        handleOnChangeBeachName(item)
                    }}
                >
                    <View style={{
                        // backgroundColor: 'red',
                        borderColor: "white",
                        borderRadius: 5,
                        shadowColor: "transparent",
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: 'center'
                    }}>
                        <View style={{
                            marginHorizontal: 5,
                        }}>
                            <Text style={{
                                fontFamily: DefaultFont.fontFamily,
                            }}>{item.name}</Text>
                            <Text style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 10,
                                color: 'gray'
                            }}>
                                {item.municipality}, {item.province}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )

            return (
                <FlashList
                    showsVerticalScrollIndicator={false}
                    data={matchedBeaches}
                    renderItem={({ item }) => renderItem(item)}
                    estimatedItemSize={estListSize}
                />
            )
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSearchBeachPage}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        width: '100%',
                        height: '80%',
                        position: 'absolute',
                        bottom: 0,
                        paddingHorizontal: 10,
                        paddingBottom: insets.bottom + 5,
                        borderRadius: modalBorderRadius,
                    }}
                >
                    <Ionicons
                        style={{
                            alignSelf: 'flex-end',
                            margin: 10,
                        }}
                        name='close'
                        size={25}
                        onPress={() => { handleOnChangeBeachName(preselectedBeach ? preselectedBeach : null) }}
                    />
                    <TextInput
                        style={{
                            width: '100%',
                            height: 40,
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: 'lightgray',
                            padding: 10,
                        }}
                        placeholder={`Search for a beach...`}
                        cursorColor={'black'}
                        onChangeText={handleSearchInputChange}
                    />
                    {renderBeachList()}
                </View>
            </Modal>
        )
    }

    const doOnShowKeyboard = (duration) => {
        calcImageContainerH.value = withTiming(0, {
            duration: duration,
            easing: Easing.linear,
            reduceMotion: ReduceMotion.System,
        });
        setImageCtrOpacity(0);
    }

    const doOnHideKeyboard = (duration) => {
        calcImageContainerH.value = withTiming(imageContainerH, {
            duration: duration,
            easing: Easing.linear,
            reduceMotion: ReduceMotion.System,
        });
        setImageCtrOpacity(1);
    }

    const fetchData = async () => {
        const availWeathers = await DatabaseActions.getAllWeathers();
        setWeathers(availWeathers);
    }

    const subscribeToKeyboardEvents = () => {
        const duration = Platform.OS === 'ios' ? 100 : 50;
        addKeyboardListener(
            () => {
                if (beachPageDisplayed.current) {
                    return;
                }

                doOnShowKeyboard(duration)
            },
            () => {
                if (beachPageDisplayed.current) {
                    return;
                }

                doOnHideKeyboard(duration)
            }
        )
    }

    useEffect(() => {
        fetchData();
        subscribeToKeyboardEvents();
    }, []);

    return (
        <ScrollView>
            <View
                style={{
                    ...props.style,
                }}
            >
                <View
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        // imageContainerH = height;
                        // console.log(`imageContainerH: ${height}`)
                    }}
                >
                    <Animated.View
                        style={{
                            ...styles.imageContainer,
                            opacity: imageCtrOpacity,
                            height: calcImageContainerH
                        }}
                    >
                        {image ? (
                            renderPhotoWithChangeCta(image)
                        ) : (
                            renderAddPhotosCta()
                        )}
                    </Animated.View>
                </View>
                <View>
                    <Text style={styles.inputLabel}>{caption.length}/{maxCharacters}</Text>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        selectionColor={'black'}
                        maxLength={maxCharacters}
                        value={caption}
                        onChangeText={handleOnCaptionChange}
                        placeholder='Write a caption...'
                        placeholderTextColor={'darkgray'}
                    />
                    {renderListItemOptions()}
                </View>
                {showDateTimePicker && renderDatePickerModal()}
                {showSearchBeachPage && renderSearchBeachModal()}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: DefaultFont.fontFamily,
        alignSelf: 'center',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageUploaded: {
        marginVertical: 10,
        width: imgDimension,
        height: imgDimension,
        borderRadius: 5,
        // resizeMode: 'contain', // Keeping this as commented for now. Because it's not working as expected.
    },
    changePhoto: {
        fontFamily: DefaultFont.fontFamilyMedium,
        color: 'blue',
        alignSelf: 'center',
    },
    addPhotoLabel: {
        fontFamily: DefaultFont.fontFamilyMedium,
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    inputLabel: {
        marginTop: 12,
        marginLeft: 12,
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
    },
    input: {
        height: 80,
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'transparent',
        color: 'black',
    },
    chipFilterContainer: {
        marginHorizontal: 1,
    },
    chipSelected: {
        color: 'dodgerblue',
    },
    chipUnselected: {
        color: 'lightgray',
    },
    chipFilterTitle: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
    },
});

