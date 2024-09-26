import TabHeaderBar from "@/components/TabHeaderBar"
import { appName } from "./Global"
import { Ionicons } from "@expo/vector-icons";
import { DefaultFont } from "./Fonts";
import { SharedTransition, withSpring } from "react-native-reanimated";
import { Text, TouchableOpacity } from "react-native";

export const defaultHeaderBar = (title = appName) => {
    const tabHeaderOptions = ({ navigation }) => {
        return {
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0
            },
            headerTitle: (props) => (
                <TabHeaderBar
                    id="tabHeaderBar"
                    title={`${title}`}
                    {...props}
                />
            )
        }
    };
    return tabHeaderOptions;
}

export const secondaryHeaderBar = (title) => {
    return {
        headerBackVisible: false,
        headerTitle: (props) => (
            <TabHeaderBar
                id="tabHeaderBar"
                title={`${title}`}
                {...props}
            />
        )
    }
}

export const secondaryHeaderWithDoneButton = (navigation, title = '', onDonePress) => {
    return {
        headerBackVisible: false,
        headerShadowVisible: false,
        headerLeft: (props) => (
            <Text
                style={{
                    fontFamily: DefaultFont.fontFamilyBold,
                    fontSize: 15,
                    color: 'green',
                }}
            >{title}
            </Text>
        ),
        headerRight: (props) => (
            <TouchableOpacity onPress={onDonePress}>
                <Text
                    style={{
                        fontFamily: DefaultFont.fontFamilyBold,
                        fontSize: 15,
                        color: 'black',
                    }}
                >Done</Text>
            </TouchableOpacity>
        ),
    }
}

export const secondaryHeaderWithBackBar = (navigation, title = '') => {
    return {
        headerBackVisible: false,
        headerShadowVisible: false,
        // headerLeft: () => (
        //     <Ionicons
        //         name="chevron-back-outline"
        //         size={20}
        //         style={{
        //             backgroundColor: 'transparent',
        //             color: 'black'
        //         }}
        //         onPress={() => navigation.goBack()}
        //     />
        // ),
        headerTitleAlign: 'center',
        headerLeft: () => null,
        headerTitle: (props) => (
            <TabHeaderBar
                id="tabHeaderBar"
                title={`${title}`}
                toolbarStyle={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 30, // Adjust this value to move the title to the left
                }}
                titleStyle={{
                    fontFamily: DefaultFont.fontFamilyBold,
                    fontSize: 15,
                    color: 'black',
                }}
                {...props}
            />
        )
    }
}


export const noHeaderBar = () => {
    return {
        headerBackVisible: false,
        headerShown: false,
    }
}

export const defaultHeaderWithBackBar = (title = '') => {
    const tabHeaderOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0
            },
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTitle: (props) => (
                <TabHeaderBar
                    id="tabHeaderBar"
                    title={title}
                    {...props}
                />
            ),
            headerLeft: () => (
                <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'black'
                    }}
                    onPress={() => navigation.goBack()}
                />
            ),
        }
    };
    return tabHeaderOptions;
}

export const defaultHeaderWithRightBar = ({ title = appName, component = null }) => {
    const tabHeaderOptions = ({ navigation }) => {
        return {
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0
            },
            headerRight: () => component,
            headerTitle: (props) => (
                <TabHeaderBar
                    id="tabHeaderBar"
                    title={`${title}`}
                    {...props}
                />
            )
        }
    };
    return tabHeaderOptions;
}

/// SEARCH BAR HEADER ///
export const defaultHeaderWithSearchBar = (title, onSearchBarPress) => {
    const tabHeaderOptions = ({ navigation }) => {
        return {
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0
            },
            headerTitle: (props) => (
                <TabHeaderBar
                    id="tabHeaderBar"
                    title={`${title}`}
                    {...props}
                />
            ),
            headerRight: (props) => (
                <Ionicons
                    name="search-outline"
                    size={25}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'black'
                    }}
                    onPress={() => {
                        onSearchBarPress(navigation)
                    }}
                />
            )
        }
    };
    return tabHeaderOptions;
}

export const defaultModalHeader = (title) => {
    const modalHeaderOptions = ({ navigation }) => {
        return {
            headerTitle: title,
            headerBackVisible: false,
            headerShadowVisible: false,
            headerShown: false,
            headerTitleStyle: {
                fontFamily: DefaultFont.fontFamilyBold,
                fontSize: 20,
                textAlign: 'center',
                color: 'green'
            },
            headerLeft: (props) => (
                <Ionicons
                    name="chevron-back-outline"
                    size={22}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'black'
                    }}
                    onPress={() => navigation.goBack()}
                />
            ),
        }
    }
    return modalHeaderOptions;
}


export const customTransition = SharedTransition.custom((values) => {
    'worklet';
    return {
        height: withSpring(values.targetHeight),
        width: withSpring(values.targetWidth),
        originX: withSpring(values.targetOriginX),
        originY: withSpring(values.targetOriginY),
    };
});
