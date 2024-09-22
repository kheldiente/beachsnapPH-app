import { DefaultFont } from '@/constants/Fonts';
import { homeLayoutKeys, snapsLayoutKeys } from '@/constants/Global';
import { Button } from '@rneui/themed';
import { useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import {
    StyleSheet,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NewBeachSnapModal from '../beach/addbeach-modal';

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
        buttonTitle: "Let's start!",
        page: 3,
    },
];

export default function OnboardingLayout() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [showNewSnapModal, setShowNewSnapModal] = useState(false);
    const currentPageRef = useRef(0);
    const pagerViewRef = useRef();

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
            navigation.navigate(homeLayoutKeys.HOME)
        } else {
            pagerViewRef.current.setPage(nextPage);
            setCurrentPageIndex(nextPage);
        }
    }

    const renderOnboardingPage = () => {
        const renderStep = (pageIndex) => {
            return (
                <View style={styles.page} key={pageIndex + 1}>
                    <Text>Step {pageIndex + 1}</Text>
                </View>
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
                    {onboardingSteps.map((step, index) => renderStep(index))}
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
                        bottom: insets.bottom - 20,
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