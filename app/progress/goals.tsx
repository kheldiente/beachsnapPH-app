import { DefaultFont } from '@/constants/Fonts';
import { secondaryHeaderBar } from '@/constants/SharedComponent';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import CreateGoalListLayout from './create-goal-list';

export default function GoalListLayout() {
    const headerTitle = 'Pick your next 5 beaches';
    const navigation = useNavigation();

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

    useEffect(() => {
        navigation.setOptions(
            secondaryHeaderBar(headerTitle)
        )
    }, []);

    const goalItems = [
        {
            title: 'Beach 1',
            list: [{
                beach: {
                    id: '1',
                    name: 'Description',
                },
            }]
        },
        {
            title: 'Beach 2',
            list: [{
                beach: {
                    id: '2',
                    name: 'Description',
                },
            }]
        },
        {
            title: 'Beach 3',
            list: [{
                beach: {
                    id: '3',
                    name: 'Description',
                },
            }]
        },
        {
            title: 'Beach 4',
            list: [{
                beach: {
                    id: '4',
                    name: 'Description',
                },
            }]
        },
        {
            title: 'Beach 5',
            list: [{
                beach: {
                    id: '5',
                    name: 'Description',
                },
            }]
        }
    ]

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
            {/* <Text style={{
                fontFamily: DefaultFont.fontFamily,
                fontSize: 15,
                color: 'black',
                marginLeft: 15,
            }}>{`Select 5 beaches to add to your goal list`}</Text> */}
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    // paddingVertical: 10,
                }}
            >
                {/* {goalItems.map((item) => renderStatCard(item))} */}

                <CreateGoalListLayout
                    navigation={navigation}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
    }
});