import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { myProgressLayoutKeys, snapsLayoutKeys } from "@/constants/Global";
import ProgressListLayout from '@/app/progress';
import { defaultHeaderBar, noHeaderBar } from '@/constants/SharedComponent';
import GoalListLayout from '../progress/goal-list';

const Stack = createNativeStackNavigator()

export default function MyProgressLayout(props) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${myProgressLayoutKeys.PROGRESS_LIST}`}
                component={ProgressListLayout}
                options={defaultHeaderBar('Track your progress')}
            />
            <Stack.Screen
                name={`${myProgressLayoutKeys.GOAL_LIST}`}
                component={GoalListLayout}
                options={defaultHeaderBar('Current goal')}
            />
        </Stack.Navigator>
    )
}