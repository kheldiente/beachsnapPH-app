import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { myProgressLayoutKeys, snapsLayoutKeys } from "@/constants/Global";
import ProgressListLayout from '@/app/progress';
import { defaultHeaderBar } from '@/constants/SharedComponent';
import NewBeachSnapLayout from '../beach/addbeach-page';
import { useEffect } from 'react';
import { getAllRegions } from '@/app/db/DatabaseHandler';

const Stack = createNativeStackNavigator()

export default function MyProgressLayout(props) {
    useEffect(() => {
        getAllRegions();
    }, []);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${myProgressLayoutKeys.PROGRESS_LIST}`}
                component={ProgressListLayout}
                options={defaultHeaderBar('Track your progress')}
            />
            {/* Putting this here so that this screen is loaded on app INIT */}
            {/* <Stack.Screen
                name={`${snapsLayoutKeys.NEW_BEACH_SNAP}`}
                component={NewBeachSnapLayout}
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    presentation: 'fullScreenModal',
                }}
            /> */}
        </Stack.Navigator>
    )
}