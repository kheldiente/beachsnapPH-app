import { noHeaderBar, secondaryHeaderWithBackBar } from '@/constants/SharedComponent';
import { useEffect, useState } from 'react';
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
import { snapsLayoutKeys } from '@/constants/Global';
import { CheckBox, Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

export default function CreateGoalListLayout({ navigation }) {
    const estListSize = 500;
    const headerTitle = 'Beaches';

    const [matchedBeaches, setMatchedBeaches] = useState(null);
    const [selectedBeaches, setSelectedBeaches] = useState([]);

    const getBeachesFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const searchBeachFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const handleOnClickBeach = (item, isPrevSelected) => {
        // console.log('item', `${item.name} ${isPrevSelected}`);
        if (isPrevSelected) {
            setSelectedBeaches(
                selectedBeaches.filter((selected) => selected.id !== item.id)
            );
        } else {
            if (selectedBeaches.length < 5) {
                setSelectedBeaches([
                    ...selectedBeaches,
                    item
                ]);
            }
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
                        paddingHorizontal: 12,
                        marginHorizontal: 10,
                        marginVertical: 3,
                        borderColor: 'transparent',
                        borderWidth: 1,
                        borderRadius: 5,
                        backgroundColor: isPrevSelected ? 'papayawhip' : 'transparent',
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

    const setupStyling = () => {
        navigation.setOptions(
            secondaryHeaderWithBackBar(navigation, headerTitle)
        )
    }

    useEffect(() => {
        // setupStyling()
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
                    // paddingHorizontal: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        // backgroundColor: 'white',
                        alignItems: 'center',
                        paddingBottom: 10,
                    }}
                >
                    {/* <Ionicons
                        style={{ marginRight: 10 }}
                        name='chevron-back'
                        size={25}
                        onPress={() => { navigation.goBack() }}
                    />
                    <Text style={{
                        fontFamily: DefaultFont.fontFamily,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>Search</Text> */}
                </View>
                <View
                    style={{
                        paddingHorizontal: 10,
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
                            marginVertical: 5,
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        // backgroundColor: 'white'
    },
});