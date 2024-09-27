import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { myProgressLayoutKeys, snapsLayoutKeys } from "@/constants/Global";
import ProgressListLayout from '@/app/progress';
import { defaultHeaderBar, noHeaderBar } from '@/constants/SharedComponent';
import GoalListLayout from '@/app/progress/goals';

const Stack = createNativeStackNavigator()

export default function MyProgressLayout(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${myProgressLayoutKeys.PROGRESS_LIST}`}
                component={ProgressListLayout}
                options={defaultHeaderBar('Track your progress')}
            />
        </Stack.Navigator>
    )
}