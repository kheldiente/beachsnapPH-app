import { DefaultFont } from '@/constants/Fonts';
import { createWeatherLabel, dateStringToMDY } from '@/constants/Utils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface IProps { }

const PhotoPostLayout: React.FC<IProps> = () => {
    const route = useRoute();
    const { data, parentId, callback, from } = route.params;
    const navigation = useNavigation();

    console.log(`PHOTO_POST: ${JSON.stringify(route.params)}`)

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const gesture = Gesture.Pan()
        .onUpdate(value => {
            translateX.value = value.translationX * 0.8;
            translateY.value = value.translationY * 0.8;
            const distance = Math.sqrt(
                value.translationX * value.translationX +
                value.translationY * value.translationY,
            );
            const scaleValue = Math.min(Math.max(distance / 100, 1), 0.9);
            scale.value = withTiming(scaleValue, { duration: 300 });
        })
        .onEnd(() => {
            if (translateY.value > 50 || translateX.value > 90) {
                opacity.value = 0;
                callback && runOnJS(callback)();
                runOnJS(navigation.goBack)();
            } else {
                translateX.value = withTiming(0, { duration: 100 });
                translateY.value = withTiming(0, { duration: 100 });
                scale.value = withTiming(1, { duration: 300 });
                opacity.value = withTiming(1, { duration: 400 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        backgroundColor: interpolateColor(
            opacity.value,
            [0, 1],
            ['transparent', 'white'],
        ),
        borderRadius: 20,
        overflow: 'hidden',
    }));

    const parentTransitionTag = useMemo(() => {
        if (from) {
            return from + data.id.toString();
        }
        return data.id.toString();
    }, [data.id, from]);

    const childrenTransitionTag = useMemo(() => {
        if (from) {
            return from + data.id.toString() + parentId.toString();
        }
        return data.id.toString() + parentId.toString();
    }, [data.id, parentId, from]);

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[styles.container, animatedStyle]}
            // sharedTransitionTag={parentTransitionTag}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 14,
                                color: 'black',
                                backgroundColor: 'lightgray',
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                overflow: 'hidden',
                                marginBottom: 10,
                            }}
                        >{data.beachName}</Text>
                        <Ionicons
                            name='share-outline'
                            size={22}
                            color='gray'
                            style={{
                                marginRight: 5,
                            }}
                        />
                    </View>
                    <Animated.Image
                        // sharedTransitionTag={childrenTransitionTag}
                        // sharedTransitionStyle={customTransition}
                        source={{ uri: data.image }}
                        style={styles.image}
                    />
                    <View
                        style={{
                            marginHorizontal: 10,
                            paddingVertical: 5,
                        }}
                    >
                        {data.caption.length > 0 &&
                            <Text
                                style={{
                                    fontFamily: DefaultFont.fontFamily,
                                    fontSize: 18,
                                    color: 'black',
                                    alignSelf: 'flex-start',
                                    marginTop: 10,
                                }}
                            >
                                {data.caption}
                            </Text>
                        }
                        <View
                            style={{
                                marginTop: data.caption.length > 0 ? 5 : 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: DefaultFont.fontFamily,
                                    fontSize: 14,
                                    color: 'green',
                                    alignSelf: 'flex-start'
                                }}
                            >
                                {createWeatherLabel(data)}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: DefaultFont.fontFamily,
                                    fontSize: 12,
                                    color: 'gray',
                                    alignSelf: 'flex-start'
                                }}
                            >
                                {dateStringToMDY(data.dateVisited)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        aspectRatio: '1/1',
    },
});

export default PhotoPostLayout;
