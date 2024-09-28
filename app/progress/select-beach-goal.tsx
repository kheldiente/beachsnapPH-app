import { DefaultFont } from '@/constants/Fonts';
import { secondaryHeaderWithDoneButton } from '@/constants/SharedComponent';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchSelectBeachLayout } from './search-select-beach';
import { Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { dateToUnixTimestamp } from '@/constants/Utils';
import * as DatabaseActions from '@/app/db/DatabaseActions';

export default function SelectBeachGoalListLayout() {
    const headerTitle = 'Pick your next 5 beaches';
    const navigation = useNavigation();

    const [selectedBeaches, setSelectedBeaches] = useState([])
    const createGoalListRef = useRef(null);

    const handleOnDonePress = async () => {
        const goal = {
            name: `My goal+${new Date().toLocaleDateString()}`,
            createdAt: dateToUnixTimestamp(new Date()),
            items: selectedBeaches.map((beach) => (
                {
                    ...beach,
                    dateVisited: dateToUnixTimestamp(new Date()),
                    targetDateToVisit: dateToUnixTimestamp(new Date()),
                    createdAt: dateToUnixTimestamp(new Date()),
                    notes: '',
                }
            )),
        }
        await DatabaseActions.saveGoal(goal);

        navigation.goBack()
    }

    const handleOnUpdateSelectedBeaches = (beaches) => {
        setSelectedBeaches(beaches)

        const headerOptions = {
            ...secondaryHeaderWithDoneButton(navigation, headerTitle, handleOnDonePress)
        }
        if (beaches.length === 5) {
            navigation.setOptions(headerOptions)
        } else {
            navigation.setOptions({
                ...headerOptions,
                headerRight: () => null
            })
        }
    }

    const setupStyling = () => {
        const headerOptions = {
            ...secondaryHeaderWithDoneButton(navigation, headerTitle, handleOnDonePress),
            headerRight: () => null
        }
        navigation.setOptions(headerOptions)
    }

    useEffect(() => {
        setupStyling()
    }, []);

    const renderSeletedBeaches = (beaches) => {
        const handleOnClickBeach = (beach) => {
            if (createGoalListRef.current) {
                const beaches = selectedBeaches.filter((b) => b.id !== beach.id)

                createGoalListRef.current.forceUpdateBeaches(beaches)
                handleOnUpdateSelectedBeaches(beaches)
            }
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginHorizontal: 8,
                    paddingVertical: 5,
                    flexWrap: 'wrap',
                }}
            >
                {beaches.map((beach) => (
                    <TouchableOpacity
                        key={`selected_beach_${beach.id}`}
                        style={{
                            flexDirection: 'row',
                            backgroundColor: 'lightgray',
                            paddingVertical: 4,
                            paddingHorizontal: 10,
                            marginHorizontal: 2,
                            marginVertical: 2,
                            borderRadius: 5,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            handleOnClickBeach(beach)
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 12,
                                alignSelf: 'center',
                                // paddingVertical: 4,
                                // paddingHorizontal: 10,
                                // marginHorizontal: 2,
                                // marginVertical: 2,
                                // borderRadius: 5,
                                // overflow: 'hidden',
                            }}
                        >{`${beach.name} - ${beach.province}`}</Text>
                        <Ionicons
                            name="close"
                            color="black"
                            size={14}
                            style={{
                                marginLeft: 5,
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                ...styles.container,
                // paddingTop: insets.top,
                // paddingBottom: insets.bottom,
            }}
            edges={['right', 'left']}
        >
            <Divider />
            <Text style={{
                fontFamily: DefaultFont.fontFamily,
                fontSize: 11,
                color: 'gray',
                alignSelf: 'flex-start',
                marginTop: 10,
                marginHorizontal: 14,
            }}>{`Instruction: Click on the beach to select/deselect`}</Text>
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                }}
            >
                {renderSeletedBeaches(selectedBeaches)}
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    // paddingVertical: 10,
                }}
            >
                <SearchSelectBeachLayout
                    onChangeSelectedBeaches={handleOnUpdateSelectedBeaches}
                    ref={createGoalListRef}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
    }
});