import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegionListLayout from '@/app/explore';
import BeachListLayout from '@/app/province';
import { exploreLayoutKeys } from "@/constants/Global";
import { defaultHeaderBar } from '@/constants/SharedComponent';

const Stack = createNativeStackNavigator()

export default function ExploreLayout(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${exploreLayoutKeys.REGION_LIST}`}
                component={RegionListLayout}
                options={defaultHeaderBar('Explore PH')} />
            <Stack.Screen
                name={`${exploreLayoutKeys.BEACH_LIST}`}
                component={BeachListLayout}
                options={defaultHeaderBar()} 
            />
        </Stack.Navigator>
    )
}