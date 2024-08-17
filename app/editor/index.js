import {
    View,
    StyleSheet,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Keyboard,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Divider, Image } from 'react-native-elements';
import { emptyBeachSnap } from '@/data/photos';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from '@rneui/themed';
import Animated, { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';

const imgDimension = 300;

export default function BeachSnapEditor(props: any) {
    const maxCharacters = 300;
    var imageContainerH = 350; // Measured in console.logs

    const [caption, setCaption] = useState('');
    const [favorited, setFavorited] = useState(false);
    const [image, setImage] = useState(null);
    const [imageCtrOpacity, setImageCtrOpacity] = useState(1);
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
                    <Image source={emptyBeachSnap.jpeg300} style={styles.imageUploaded} />
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

    const renderListItemWithChevron = () => {
        const items = [
            {
                title: 'Beach name',
                key: '_bchName',
                icon: 'cloudy',
                type: 'chevron'
            },
            {
                title: 'Date',
                key: '_addAsFave',
                icon: 'calendar',
                type: 'chevron'
            },
        ]
        return (
            <View
                style={{
                    marginVertical: 10,
                }}
            >
                {items.map((item, index) => (
                    <View
                        key={`_chevronList+${item.key}`}
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
                                    fontWeight: '400'
                                }}>{item.title}</Text>
                            </View>
                            {item.type === 'chevron' ?
                                <Ionicons style={{ alignSelf: 'flex-end' }} name="chevron-forward" color="black" size={22} />
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
                        <Divider />
                    </View>
                ))}
            </View>
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
        const duration = 100;
        Keyboard.addListener('keyboardWillShow', () => {
            doOnShowKeyboard(duration);
        });

        Keyboard.addListener('keyboardWillHide', () => {
            doOnHideKeyboard(duration);
        });
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
                    {renderListItemWithChevron()}
                </View>
            </View>
        </ScrollView >
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
        height: 100,
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'transparent',
        color: 'black',
    },
});

