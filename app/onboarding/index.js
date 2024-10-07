import { DefaultFont } from '@/constants/Fonts';
import { homeLayoutKeys, myProgressLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { Button, CheckBox } from '@rneui/themed';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NewBeachSnapModal from '../beach/addbeach-modal';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { Ionicons } from '@expo/vector-icons';
import { dateToUnixTimestamp } from '@/constants/Utils';
import * as LocalStorage from '@/app/storage/LocalStorage';

const minBeachesToSelect = 5;
const onboardingSteps = [
    {
        page: 0,
        buttonTitle: "Let's start!",
        imageRes: require('@/assets/images/onboarding/onboarding-step-1.png'),
        header: "Welcome to BeachSnap PH!",
        text: "Almost 500 beaches in the Philippines\r\nare waiting to be discovered!"
    },
    {
        page: 1,
        buttonTitle: "Let me add my first snap!",
        imageRes: require('@/assets/images/onboarding/onboarding-step-2.png'),
        text: "Collect, save your beach photos\r\nand keep track of them!"
    },
    {
        page: 2,
        buttonTitle: "Yes, I've been here!",
        actionKey: snapsLayoutKeys.NEW_BEACH_SNAP,
    },
    {
        page: 3,
        buttonTitle: "Yes, I want to go there!",
        imageRes: require('@/assets/images/onboarding/onboarding-step-4.png'),
        text: `Pick your next ${minBeachesToSelect} beaches to visit!`,
        actionKey: myProgressLayoutKeys.BEACH_GOAL_PICKER,
    },
    {
        page: 4,
        buttonTitle: "Let's go see some beaches!",
        imageRes: require('@/assets/images/onboarding/onboarding-step-4.png'),
        header: "You are all set!",
        text: "Enjoy your time exploring\r\nthe beaches of the Philippines!"
    },
];

const skipListItem = {
    id: 'skip-list-item',
    name: 'None of the above',
    province: 'Skip province',
}


const topFiveFamousBeacheIds = [
    'VRPMAWHI47FB', // White Beach, Boracay
    'LRPELNAC8EC6', // Nacpan, El Nido
    'VRPPAALO0BEF', // Alona, Panglao
    'MCSGESIA52F1', // Siargao Islad
    'LRPCOMAL2D40', // Malcapuya Island
    'LBCVICALF8C4', // Calaguas
    'VRPLAMAC7F0B', // Mactan Island
    'VRPCAGIG7F7A', // Gigantes Norte
    'VRPCAGIGE410', // Gigantes Sur
    'VRPPAPAN138C', // Panglao Island
]

export default function OnboardingLayout() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [showNewSnapModal, setShowNewSnapModal] = useState(false);
    const [showPickBeaches, setShowPickBeaches] = useState(false);
    const [visitedBeachIndex, setVisitedBeachIndex] = useState(0);
    const [selectedBeaches, setSelectedBeaches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentPageRef = useRef(0);
    const pagerViewRef = useRef();
    const beaches = useRef([]);
    const selectedBeachesRef = useRef([]);
    const selectedBeachWithSnap = useRef(null);

    const marginBottom = Platform.select({
        ios: insets.bottom - 20,
        android: insets.bottom + 10,
    });

    const handleOnboardingAction = (actionKey) => {
        const nextPage = currentPageRef.current + 1;

        if (actionKey === snapsLayoutKeys.NEW_BEACH_SNAP) {
            setShowNewSnapModal(true);
        } else if (actionKey === snapsLayoutKeys.PICK_BEACHES) {
            setShowPickBeaches(true);
        } else {
            pagerViewRef.current.setPage(nextPage);
            setCurrentPageIndex(nextPage);
        }
    }

    const handleOnboardingCtaClick = () => {
        const currentPageData = onboardingSteps[currentPageRef.current];

        if (currentPageData.actionKey === myProgressLayoutKeys.BEACH_GOAL_PICKER) {
            handleSaveGoal();
            return;
        }

        if (currentPageData.actionKey !== undefined) {
            const skippedAddingBeachSnap = currentPageData.actionKey === snapsLayoutKeys.NEW_BEACH_SNAP
                && selectedBeachWithSnap.current.id === skipListItem.id;

            if (skippedAddingBeachSnap) {
                goToNextPage();
            } else {
                handleOnboardingAction(currentPageData.actionKey);
            }
            return;
        }

        goToNextPage();
    }

    const handleSaveGoal = async () => {
        const goal = {
            name: `My goal+${new Date().toLocaleDateString()}`,
            createdAt: dateToUnixTimestamp(new Date()),
            items: selectedBeachesRef.current.map((beach) => (
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
        goToNextPage();
    }

    const goToNextPage = async () => {
        const nextPage = currentPageRef.current + 1;
        if (nextPage >= onboardingSteps.length) {
            await LocalStorage.setOnboardingCompleted();
            navigation.replace(homeLayoutKeys.HOME)
        } else {
            pagerViewRef.current.setPage(nextPage);
            setCurrentPageIndex(nextPage);
        }
    }

    const renderBeachCheckboxPage = (step) => {
        const only5Beaches = [
            ...beaches.current.slice(0, minBeachesToSelect),
            skipListItem,
        ]

        const handleOnBeachCheckboxChange = (index) => {
            selectedBeachWithSnap.current = only5Beaches[index];
            setVisitedBeachIndex(index);
        }

        return (
            <View
                key={step.page + 1}
                style={{
                    justifyContent: 'center',
                    paddingRight: 20,
                    marginHorizontal: 5,
                }}
            >
                <View>
                    <Text
                        style={{
                            ...styles.text,
                            textAlign: 'left',
                            marginHorizontal: 10,
                            marginBottom: 10,
                        }}
                    >
                        {`Now, these are the top visited beaches in the Philippines!`}
                    </Text>

                    <Text
                        style={{
                            ...styles.textBold,
                            fontSize: 18,
                            textAlign: 'left',
                            marginHorizontal: 10,
                            marginBottom: 10,
                        }}
                    >Select if you've been to one of them 😎</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        {only5Beaches.map((beach, index) => (
                            <CheckBox
                                containerStyle={{
                                    backgroundColor: visitedBeachIndex === index ? 'papayawhip' : 'white',
                                    paddingVertical: 5,
                                    width: '100%',
                                    borderColor: 'lightgray',
                                    borderWidth: 0.5,
                                    borderRadius: 5,
                                }}
                                titleProps={{
                                    style: {
                                        fontFamily: DefaultFont.fontFamily,
                                        fontSize: 18,
                                        marginLeft: 10,
                                    }
                                }}
                                title={beach.id === skipListItem.id
                                    ? skipListItem.name
                                    : `${beach.name}, ${beach.province}`
                                }
                                key={`beach_checkbox+${beach.id}`}
                                checked={visitedBeachIndex === index}
                                checkedIcon={
                                    <Ionicons
                                        name="radio-button-on-outline"
                                        color="darkviolet"
                                        size={20}
                                    />
                                }
                                uncheckedIcon={
                                    <Ionicons
                                        name="radio-button-off-outline"
                                        color="grey"
                                        size={20}
                                    />
                                }
                                onPress={() => handleOnBeachCheckboxChange(index)}
                            />
                        ))}
                    </View>
                </View>
            </View>
        )
    }

    const renderPickBeachesPage = (step) => {
        const handleOnSelectBeach = (beach) => {
            var bchs = selectedBeachesRef.current;

            if (selectedBeachesRef.current.find((bch) => bch.id === beach.id)) {
                bchs = bchs.filter((bch) => bch.id !== beach.id)
            } else {
                if (bchs.length === minBeachesToSelect) {
                    return;
                }
                bchs = [...bchs, beach]
            }

            selectedBeachesRef.current = bchs;
            setSelectedBeaches(bchs);
        }

        return (
            <View
                key={step.page + 1}
                style={{
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                }}
            >
                <Text
                    style={{
                        ...styles.text,
                        fontSize: 14,
                        color: 'green',
                        textAlign: 'left',
                        marginHorizontal: 12,
                    }}
                >Now, let's list down your beach bucket list...</Text>
                <Text
                    style={{
                        ...styles.textBold,
                        fontSize: 20,
                        color: 'black',
                        textAlign: 'left',
                        marginHorizontal: 12,
                        marginTop: 25,
                    }}
                >{`Let's pick ${minBeachesToSelect} beaches for you to visit 😎`}</Text>
                <Text
                    style={{
                        ...styles.text,
                        fontSize: 12,
                        color: 'gray',
                        textAlign: 'left',
                        marginHorizontal: 12,
                    }}
                >Instruction: Press a beach below to select/deselect</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 8,
                        marginTop: 10,
                        paddingVertical: 5,
                        flexWrap: 'wrap',
                    }}
                >
                    {beaches.current.map((beach) => {
                        const isPrevSelected = selectedBeachesRef.current.find((bch) => bch.id === beach.id);
                        return (
                            <TouchableOpacity
                                key={`selected_beach_${beach.id}`}
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'lightgray',
                                    paddingVertical: 4,
                                    paddingHorizontal: 10,
                                    marginHorizontal: 2,
                                    marginVertical: 4,
                                    borderRadius: 5,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    opacity: isPrevSelected ? 1 : 0.3,
                                }}
                                onPress={() => handleOnSelectBeach(beach)}
                            >
                                <Text
                                    style={{
                                        fontFamily: DefaultFont.fontFamily,
                                        fontSize: 18,
                                        alignSelf: 'center',
                                    }}
                                >{`${beach.name} - ${beach.province}`}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {/* <CreateGoalListLayout /> */}
            </View>
        )
    }

    const renderOnboardingPage = () => {
        const renderStep = (step) => {
            const selectBeachPage = step.actionKey === snapsLayoutKeys.NEW_BEACH_SNAP;
            const pickBeachesPage = step.actionKey === myProgressLayoutKeys.BEACH_GOAL_PICKER;

            return (
                selectBeachPage ? renderBeachCheckboxPage(step)
                    : pickBeachesPage ? renderPickBeachesPage(step)
                        : (
                            <View
                                style={{
                                    ...styles.page,
                                    paddingHorizontal: 30,
                                }}
                                key={step.page + 1}
                            >
                                <Image
                                    source={
                                        step.imageRes ? step.imageRes
                                            : require('@/assets/images/onboarding/onboarding-step-1.png')
                                    }
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'contain',
                                    }}
                                />
                                {step.header &&
                                    <Text
                                        style={{
                                            fontFamily: DefaultFont.fontFamilyBold,
                                            fontSize: 18,
                                            color: 'black',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {`${step.header}\r\n`}
                                    </Text>
                                }
                                <Text
                                    style={{
                                        ...styles.text,
                                        textAlign: 'center',
                                        fontSize: 18,
                                    }}
                                >
                                    {step.text ? step.text : `Step ${step.page + 1}`}
                                </Text>
                            </View>
                        )
            )
        }

        return (
            <View>
                <PagerView
                    style={{
                        height: 600,
                    }}
                    initialPage={0}
                    scrollEnabled={false}
                    ref={pagerViewRef}
                    onPageSelected={(e) => {
                        currentPageRef.current = e.nativeEvent.position;
                    }}
                >
                    {onboardingSteps.map((step) => renderStep(step))}
                </PagerView>
            </View>
        )
    }

    const handleOnAddBeachSnapFinish = () => {
        currentPageRef.current = currentPageRef.current + 1;
        setShowNewSnapModal(false);

        setTimeout(() => {
            pagerViewRef.current.setPage(currentPageRef.current);
            setCurrentPageIndex(currentPageRef.current);
        }, 300);
    }

    const renderOnboardingCta = () => {
        const isSettingGoalList = onboardingSteps[currentPageIndex].actionKey === myProgressLayoutKeys.BEACH_GOAL_PICKER;
        const isBeachGoalSet = selectedBeachesRef.current.length === 5;
        const noBeachWithSnap = onboardingSteps[currentPageIndex].actionKey === snapsLayoutKeys.NEW_BEACH_SNAP
            && selectedBeachWithSnap.current.id === skipListItem.id;
        var buttonTitle = onboardingSteps[currentPageIndex].buttonTitle

        if (noBeachWithSnap) {
            buttonTitle = 'Skip for now'
        }

        return (
            <Button
                titleStyle={styles.buttonTitle}
                buttonStyle={{
                    ...styles.button,
                    // opacity: (isSettingGoalList && !isBeachGoalSet) ? 0.5 : 1,
                }}
                title={buttonTitle}
                onPress={handleOnboardingCtaClick}
                disabled={isSettingGoalList && !isBeachGoalSet}
            />
        )
    }

    const fetchData = async () => {
        setIsLoading(true);

        const data = await DatabaseActions.getBeachesWithIds(topFiveFamousBeacheIds);
        const sortedData = topFiveFamousBeacheIds.map((id) =>
            data.filter((beach) => beach.id === id)[0]
        );

        beaches.current = sortedData;

        // Preselect 5 beaches
        selectedBeachesRef.current = sortedData.slice(0, minBeachesToSelect);
        // Preselect first beach to add snap
        selectedBeachWithSnap.current = sortedData[0];

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <SafeAreaView
            style={styles.container}
            edges={['right', 'left']}
        >
            {!isLoading &&
                <View style={{
                    ...styles.content,
                    marginTop: insets.top,
                    marginBottom: insets.bottom,
                }}>
                    {renderOnboardingPage()}
                    <View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            paddingHorizontal: 20,
                            bottom: marginBottom,
                        }}
                    >
                        {renderOnboardingCta()}
                    </View>
                    <NewBeachSnapModal
                        showSkipButton={true}
                        isVisible={showNewSnapModal}
                        onClose={handleOnAddBeachSnapFinish}
                        onSave={handleOnAddBeachSnapFinish}
                        onSkip={handleOnAddBeachSnapFinish}
                        preselectedBeach={beaches.current[visitedBeachIndex]}
                    />
                </View>
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
    content: {
        flex: 1,
        flexDirection: "column",
    },
    text: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 16,
    },
    textBold: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
    },
    buttonTitle: {
        fontFamily: DefaultFont.fontFamilyBold,
        fontSize: 16,
    },
    button: {
        color: 'white',
        backgroundColor: 'green',
        width: '100%',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});