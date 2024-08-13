import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { myProgressLayoutKeys } from "@/constants/Global";
import ProgressListLayout from '@/app/progress';
import { defaultHeaderBar } from '@/constants/SharedComponent';

const Stack = createNativeStackNavigator()

export default function MyProgressLayout(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${myProgressLayoutKeys.PROGRESS_LIST}`}
                component={ProgressListLayout}
                options={defaultHeaderBar('Track your progress')} />
        </Stack.Navigator>
    )
}