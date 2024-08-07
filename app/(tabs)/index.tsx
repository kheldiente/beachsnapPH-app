import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegionListLayout from '@/app/explore/index';
import BeachListLayout from '@/app/province/index';
import TabHeaderBar from "@/components/TabHeaderBar";
import { appName, exploreLayoutKeys } from "@/constants/Global";

const Stack = createNativeStackNavigator()

export default function ExploreLayout(props) {
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
                    title={`${appName}`}
                    {...props}
                />
            )
        }
    }


    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${exploreLayoutKeys.REGION_LIST}`}
                component={RegionListLayout}
                options={tabHeaderOptions} />
            <Stack.Screen
                name={`${exploreLayoutKeys.BEACH_LIST}`}
                component={BeachListLayout}
                options={tabHeaderOptions} 
            />
        </Stack.Navigator>
    )
}