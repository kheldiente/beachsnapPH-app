import { DefaultFont } from '@/constants/Fonts';
import { secondaryHeaderBar, secondaryHeaderWithBackBar, secondaryHeaderWithDoneButton } from '@/constants/SharedComponent';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateGoalListLayout } from './create-goal-list';
import { Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

export default function GoalListLayout() {
    const headerTitle = 'Pick your next 5 beaches';
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [selectedBeaches, setSelectedBeaches] = useState([])
    const createGoalListRef = useRef(null);

    const renderStatCard = (data) => {
        return (
            <View
                key={`goal_list+${data.key}`}
                style={{
                    backgroundColor: 'papayawhip',
                    borderRadius: 10,
                    padding: 15,
                    marginHorizontal: 10,
                    marginVertical: 5,
                }}
            >
                <Text style={styles.headerText}>{data.title}</Text>
                {data.list.map((item) => (
                    <View
                        key={`_visited_bchList+${data.key}+${item.beach.id}}`}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginTop: 10,
                        }}>
                            <Text style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 15,
                                color: 'black',
                            }}>{item.beach.name}</Text>
                            <Text style={{
                                fontFamily: DefaultFont.fontFamily,
                                fontSize: 10,
                                color: 'gray'
                            }}>Date</Text>
                        </View>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamilyBold,
                            fontSize: 12,
                            alignSelf: 'center',
                            color: 'black',
                        }}>{item.photoCount === 1
                            ? '1 snap'
                            : `${item.photoCount} snaps`
                            }</Text>
                    </View>
                ))}
            </View>
        )
    }

    const handleOnDonePress = () => {
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
                {/* {goalItems.map((item) => renderStatCard(item))} */}

                <CreateGoalListLayout
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