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
import { useEffect, useState } from 'react';
import { Divider, Image } from 'react-native-elements';
import { emptyBeachSnap } from '@/data/photos';
import { Ionicons } from '@expo/vector-icons';
import { Button, Switch } from '@rneui/themed';
import Animated, { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { addKeyboardListener } from '@/constants/Utils';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { items } from '@/constants/Global';

const imgDimension = 300;

export default function BeachSnapEditor(props) {
    const insets = useSafeAreaInsets();
    const maxCharacters = 100;
    var imageContainerH = 350; // Measured in console.logs

    const [caption, setCaption] = useState('');
    const [favorited, setFavorited] = useState(false);
    const [image, setImage] = useState(null);
    const [imageCtrOpacity, setImageCtrOpacity] = useState(1);
    const [showDate, setShowDate] = useState(false);

    const calcImageContainerH = useSharedValue(imageContainerH);

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

    const handleOnChangeFavorited = (value) => {
        setFavorited(value);
    }

    const handleOnCaptionChange = (text) => {
        setCaption(text);
    }

    const handleOnSelectDate = () => {
        setShowDate(false);
        props.onSelectDate
            ? props.onSelectDate()
            : null
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

    const renderListItemOptions = () => {
        const handleOnBeachNameItemClick = () => {
            // console.log('Beach name item clicked')
        }

        const handleOnDateVisitedItemClick = () => {
            console.log('Date visited item clicked');
            setShowDate(true);
        }

        return (
            <View
                style={{
                    marginVertical: 10,
                }}
            >
                {items.map((item, index) => (
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
                                    fontWeight: '400',
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
                                            <Text
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
                                            >{item.value}</Text>
                                            <Ionicons style={{ alignSelf: 'flex-end' }} name="chevron-forward" color="black" size={22} />
                                        </View>
                                    )
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
                        <Divider />
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    const renderDatePickerModal = () => {
        const onDateChange = (event, selectedDate) => {
            console.log(`onDateChange: ${event.type}`)
            if (Platform.OS === 'android') {
                if (event.type === 'dismissed'
                    || event.type === 'set'
                ) {
                    handleOnSelectDate();
                }
            }
        };

        if (Platform.OS === 'android') {
            return (
                <RNDateTimePicker
                    style={{
                        marginTop: 10,
                        backgroundColor: 'white',
                    }}
                    value={new Date()}
                    maximumDate={new Date()}
                    onChange={onDateChange}
                    positiveButton={{ label: 'Select', textColor: 'green' }}
                    negativeButton={{ label: 'Cancel', textColor: 'black' }}
                />
            )
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDate}
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
                    }}
                >
                    <RNDateTimePicker
                        style={{
                            marginTop: 10,
                            backgroundColor: 'white',
                        }}
                        display={'spinner'}
                        value={new Date()}
                        maximumDate={new Date()}
                        onChange={onDateChange}

                    />
                    {Platform.OS === 'ios'
                        ? (<Button
                            buttonStyle={{
                                backgroundColor: 'green',
                                borderRadius: 10,
                                width: '100%'
                            }}
                            titleStyle={{
                                fontFamily: DefaultFont.fontFamily,
                                fontWeight: 'bold',
                            }}
                            title='Select'
                            onPress={() => {
                                handleOnSelectDate();
                            }}
                        />)
                        : null
                    }
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

    useEffect(() => {
        const duration = Platform.OS === 'ios' ? 100 : 50;
        addKeyboardListener(
            () => { doOnShowKeyboard(duration) },
            () => { doOnHideKeyboard(duration) }
        )
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
                        {image !== null ? (
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
                {showDate && renderDatePickerModal()}
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
    },
    changePhoto: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: '600',
        color: 'blue',
        alignSelf: 'center',
    },
    addPhotoLabel: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: '600',
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
});

