import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from '@shopify/flash-list';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { DefaultFont } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';

export const CreateGoalListLayout = forwardRef((props: any, ref) => {
    const estListSize = 500;

    const [matchedBeaches, setMatchedBeaches] = useState(null);
    const [selectedBeaches, setSelectedBeaches] = useState([]);
    var selectedBeachesRef = useRef([]);

    const getBeachesFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const searchBeachFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const forceUpdateBeaches = (beaches) => {
        selectedBeachesRef.current = beaches
        setSelectedBeaches(beaches)
    }

    const handleOnClickBeach = (item, isPrevSelected) => {
        var beaches = [...selectedBeachesRef.current]
        if (isPrevSelected) {
            beaches = beaches.filter((selected) => selected.id !== item.id)
        } else {
            if (beaches.length < 5) {
                beaches = [
                    ...beaches,
                    item
                ]
            }
        }

        selectedBeachesRef.current = beaches
        setSelectedBeaches(beaches)

        if (props !== undefined && props.onChangeSelectedBeaches) {
            props.onChangeSelectedBeaches(beaches)
        }
    }

    const handleSearchInputChange = (text) => {
        setTimeout(() => {
            searchBeachFromDb(text)
        }, 200)
    }

    const renderBeachList = () => {
        const renderItem = (item, extraData) => {
            const isPrevSelected = extraData.filter((selected) => selected.id === item.id).length > 0;
            return (
                <TouchableOpacity
                    key={item.id}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        marginHorizontal: 5,
                        marginVertical: 2,
                        borderRadius: 5,
                        backgroundColor: isPrevSelected ? 'papayawhip' : 'transparent',
                        borderWidth: 0.2,
                        borderColor: 'lightgray',
                    }}
                    onPress={() => {
                        handleOnClickBeach(item, isPrevSelected)
                    }}
                >
                    <View style={{
                        borderRadius: 5,
                        shadowColor: "transparent",
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: 'center'
                    }}>
                        <View style={{
                            // marginHorizontal: 5,
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
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons
                            name="checkmark-circle"
                            color="green"
                            size={20}
                            opacity={isPrevSelected ? 1 : 0}
                        />
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <FlashList
                contentContainerStyle={{
                    // paddingTop: 5,
                }}
                showsVerticalScrollIndicator={false}
                data={matchedBeaches}
                renderItem={({ item, index, target, extraData }) => renderItem(item, extraData)}
                estimatedItemSize={estListSize}
                extraData={selectedBeaches}
            />
        )
    }

    useImperativeHandle(ref, () => ({
        forceUpdateBeaches
    }));

    useEffect(() => {
        getBeachesFromDb()
    }, []);

    return (
        <SafeAreaView
            style={{
                ...styles.container,
                // paddingTop: insets.top + 20,
            }}
            edges={['right', 'left']}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    paddingHorizontal: 5,
                }}
                // {...props}
                // ref={ref}
            >
                <View
                    style={{
                        paddingHorizontal: 5,
                    }}
                >
                    <TextInput
                        style={{
                            height: 40,
                            width: '100%',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: 'lightgray',
                            padding: 10,
                            marginBottom: 5,
                        }}
                        placeholder={`Search for a beach...`}
                        cursorColor={'black'}
                        onChangeText={handleSearchInputChange}
                    />
                </View>
                {renderBeachList()}
            </View>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        // backgroundColor: 'white'
    },
});