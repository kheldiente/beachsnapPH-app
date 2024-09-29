import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { moreLayoutKeys } from "@/constants/Global";
import { defaultHeaderBar } from '@/constants/SharedComponent';
import SettingsLayout from '@/app/settings';

const Stack = createNativeStackNavigator()

export default function MyProgressLayout(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${moreLayoutKeys.SETTINGS}`}
                component={SettingsLayout}
                options={defaultHeaderBar('Settings')}
            />
        </Stack.Navigator>
    )
}