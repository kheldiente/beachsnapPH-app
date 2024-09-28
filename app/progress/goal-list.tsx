import { DefaultFont } from '@/constants/Fonts';
import { items, myProgressLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { dateStringToMDY } from '@/constants/Utils';
import { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { secondaryHeaderBar } from '@/constants/SharedComponent';

export default function GoalListLayout({ navigation, route }) {
    const headerTitle = 'Current goal'
    const beachList = useRef(route.params.data);
    const [isLoading, setIsLoading] = useState(true);

    const renderBeachCardItem = (item) => {
        const handleOnClickCardItem = () => {
            navigation.navigate(snapsLayoutKeys.BEACH_PROFILE, {
                data: item.beach
            });
        }

        const renderRightCta = () => {
            return (item.photoCount !== undefined
                ? <Text style={{
                    fontFamily: DefaultFont.fontFamilyBold,
                    fontSize: 14,
                    alignSelf: 'center',
                    color: 'black',
                }}>
                    {item.photoCount === 1
                        ? '1 snap'
                        : `${item.photoCount} snaps`
                    }
                </Text>
                : (
                    <TouchableOpacity
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            handleOnClickCardItem(item)
                        }}
                    >
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 14,
                            color: 'darkviolet',
                        }}>Add snap</Text>
                    </TouchableOpacity>
                )
            )
        }

        return (
            <View
                key={`visited_bchList+${item.id}`}
                style={{
                    backgroundColor: 'papayawhip',
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    marginHorizontal: 10,
                    marginTop: 10,
                }}
            >
                <View
                    key={`_goal_bchList+${item.id}`}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingVertical: 20,
                    }}>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 20,
                            color: 'black',
                        }}>{item.beach.name}</Text>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 12,
                            color: 'gray'
                        }}>{item.beach.municipality}, {item.beach.province}</Text>
                    </View>
                    {renderRightCta()}
                </View>
            </View>
        )
    }

    const fetchData = async () => {
        setIsLoading(true);

        const beachIds = beachList.current.map((goal) => goal.beachId)
        const details = await DatabaseActions.getBeachesWithIds(beachIds);

        beachList.current = beachList.current.map((beach, index) => ({
            ...beach,
            beach: details.filter((detail) => beach.beachId === detail.id)[0]
        }))

        setIsLoading(false);
    }

    const setStyling = () => {
        navigation.setOptions(
            secondaryHeaderBar(headerTitle)
        )
    }

    useEffect(() => {
        setStyling();
        fetchData();
    }, [])

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
            {!isLoading &&
                <ScrollView>
                    {beachList.current.map((item) => renderBeachCardItem(item))}
                </ScrollView>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white',
    },
});