import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegionListLayout from '@/app/explore';
import BeachListLayout from '@/app/province';
import { exploreLayoutKeys } from "@/constants/Global";
import { defaultHeaderBar, defaultHeaderWithSearchBar } from '@/constants/SharedComponent';
import SearchLayout from '@/app/search';

const Stack = createNativeStackNavigator()

export default function ExploreLayout(props) {

    const showSearchPage = (navigation) => {
        navigation.navigate(`${exploreLayoutKeys.SEARCH}`)
    }

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${exploreLayoutKeys.REGION_LIST}`}
                component={RegionListLayout}
                options={defaultHeaderWithSearchBar('Explore PH', showSearchPage)}
            />
            <Stack.Screen
                name={`${exploreLayoutKeys.BEACH_LIST}`}
                component={BeachListLayout}
                options={defaultHeaderBar()}
            />
            <Stack.Screen
                name={`${exploreLayoutKeys.SEARCH}`}
                component={SearchLayout}
                options={defaultHeaderBar()}
            />
        </Stack.Navigator>
    )
}