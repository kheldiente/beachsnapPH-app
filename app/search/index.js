import { noHeaderBar } from '@/constants/SharedComponent';
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
import { Ionicons } from '@expo/vector-icons';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { DefaultFont } from '@/constants/Fonts';
import { snapsLayoutKeys } from '@/constants/Global';

export default function SearchLayout({ navigation, route }) {
    const estListSize = 500;
    const insets = useSafeAreaInsets();

    const [matchedBeaches, setMatchedBeaches] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const getBeachesFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const searchBeachFromDb = async (keyword = '') => {
        const beaches = await DatabaseActions.getBeachesFromDb({ keyword: keyword, applyLimit: false });
        setMatchedBeaches(beaches);
    }

    const handleOnClickBeach = (item) => {
        navigation.push(`${snapsLayoutKeys.BEACH_PROFILE}`, {
            data: item
        })
    }

    const handleSearchInputChange = (text) => {
        setTimeout(() => {
            searchBeachFromDb(text)
        }, 200)
    }

    const renderBeachList = () => {
        const renderItem = (item) => (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    handleOnClickBeach(item)
                }}
            >
                <View style={{
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
                contentContainerStyle={{
                    paddingTop: 5,
                }}
                showsVerticalScrollIndicator={false}
                data={matchedBeaches}
                renderItem={({ item }) => renderItem(item)}
                estimatedItemSize={estListSize}
            />
        )
    }

    const setupStyling = () => {
        navigation.setOptions(noHeaderBar())
    }

    useEffect(() => {
        setupStyling()
        getBeachesFromDb()
    }, []);

    return (
        <SafeAreaView
            style={{
                ...styles.container,
                paddingTop: insets.top + 20,
            }}
            edges={['right', 'left']}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        alignItems: 'center',
                        paddingBottom: 10,
                    }}
                >
                    <Ionicons
                        style={{ marginRight: 10 }}
                        name='chevron-back'
                        size={25}
                        onPress={() => { navigation.goBack() }}
                    />
                    <TextInput
                        style={{
                            height: 40,
                            width: '85%',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: 'lightgray',
                            padding: 10,
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
        backgroundColor: 'white'
    },
});