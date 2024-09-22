import { DefaultFont } from '@/constants/Fonts';
import { homeLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { Button, CheckBox } from '@rneui/themed';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NewBeachSnapModal from '../beach/addbeach-modal';
import * as DatabaseActions from '@/app/db/DatabaseActions';
import { Ionicons } from '@expo/vector-icons';

const onboardingSteps = [
    {
        buttonTitle: "Next",
        page: 0,
    },
    {
        buttonTitle: "Next",
        page: 1,
    },
    {
        buttonTitle: "Let's add your first snap!",
        actionKey: snapsLayoutKeys.NEW_BEACH_SNAP,
        page: 2,
    },
    {
        buttonTitle: "Let's start our beach adventure!",
        page: 3,
    },
];

export default function OnboardingLayout() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [showNewSnapModal, setShowNewSnapModal] = useState(false);
    const [visitedBeachIndex, setVisitedBeachIndex] = useState(0);

    const currentPageRef = useRef(0);
    const pagerViewRef = useRef();
    const beaches = useRef([]);

    const marginBottom = Platform.select({
        ios: insets.bottom - 20,
        android: insets.bottom + 10,
    });

    const handleOnboardingAction = (actionKey) => {
        if (actionKey === snapsLayoutKeys.NEW_BEACH_SNAP) {
            setShowNewSnapModal(true);
        } else {
            pagerViewRef.current.setPage(nextPage);
            setCurrentPageIndex(nextPage);
        }
    }

    const handleOnboardingCtaClick = () => {
        const currentPageData = onboardingSteps[currentPageRef.current];
        if (currentPageData.actionKey !== undefined) {
            handleOnboardingAction(currentPageData.actionKey);
            return;
        }

        const nextPage = currentPageRef.current + 1;
        if (nextPage >= onboardingSteps.length) {
            navigation.replace(homeLayoutKeys.HOME)
        } else {
            pagerViewRef.current.setPage(nextPage);
            setCurrentPageIndex(nextPage);
        }
    }

    const renderBeachCheckboxPage = (step) => {
        const handleOnBeachCheckboxChange = (index) => {
            setVisitedBeachIndex(index);
        }

        return (
            <View
                style={{
                    justifyContent: 'center',
                }}
                key={step.page + 1}
            >
                <View>
                    <Text
                        style={{
                            ...styles.text,
                            textAlign: 'left',
                            marginHorizontal: 20,
                        }}
                    >
                        {`These are the top visited beaches in the Philippines!\r\n\r\nSelect if you have been to one of them 😎`}
                    </Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        {beaches.current.map((beach, index) => (
                            <CheckBox
                                containerStyle={{
                                    backgroundColor: 'white',
                                    paddingVertical: 5,
                                    width: '100%',
                                }}
                                titleProps={{
                                    style: {
                                        fontFamily: DefaultFont.fontFamilyBold,
                                        fontSize: 20,
                                        marginLeft: 10,
                                    }
                                }}
                                title={beach.name}
                                key={beach.id}
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

    const renderOnboardingPage = () => {
        const renderStep = (step) => {
            const selectBeachPage = step.actionKey === snapsLayoutKeys.NEW_BEACH_SNAP;

            return (
                selectBeachPage ? renderBeachCheckboxPage(step)
                    : (
                        <View style={styles.page} key={step.page + 1}>
                            <Text style={styles.text}>Step {step.page + 1}</Text>
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

    const fetchData = async () => {
        const topFiveFamousBeacheIds = [
            'LBABACAB87D2',
            'LBABACOREA14',
            'LBABAHINA255',
            'LBABAPAN80AE',
            'LBABAPIN4C51',
        ]
        const data = await DatabaseActions.getBeachesWithIds(topFiveFamousBeacheIds);
        beaches.current = data;
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <SafeAreaView
            style={styles.container} edges={['right', 'left']}
        >
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
                    <Button
                        titleStyle={styles.buttonTitle}
                        buttonStyle={{
                            ...styles.button,
                        }}
                        title={onboardingSteps[currentPageIndex].buttonTitle}
                        onPress={handleOnboardingCtaClick}
                    />
                </View>
                <NewBeachSnapModal
                    showSkipButton={true}
                    isVisible={showNewSnapModal}
                    onClose={handleOnAddBeachSnapFinish}
                    onSave={handleOnAddBeachSnapFinish}
                    onSkip={handleOnAddBeachSnapFinish}
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
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});