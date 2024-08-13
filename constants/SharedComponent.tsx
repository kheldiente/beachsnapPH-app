import TabHeaderBar from "@/components/TabHeaderBar"
import { appName } from "./Global"
import { Ionicons } from "@expo/vector-icons";

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

export const defaultHeaderWithBackBar = (title = '') => {
    const tabHeaderOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0
            },
            headerShadowVisible: false,
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

export const defaultHeaderWithRightBar = ({ title = appName, component }) => {
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