import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { snapsLayoutKeys } from "@/constants/Global";
import SnapsAlbumLayout from '@/app/snaps';
import { defaultHeaderWithRightBar } from '@/constants/SharedComponent';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const Stack = createNativeStackNavigator()

export default function SnapsLayout(props) {
    const navigation = useNavigation();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${snapsLayoutKeys.SNAPS_ALBUM}`}
                component={SnapsAlbumLayout}
                options={defaultHeaderWithRightBar({
                    component: (<Ionicons
                        name="add-circle-outline"
                        size={25}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black'
                        }}
                        onPress={() => console.log("Add album")}
                    />)
                })} />
        </Stack.Navigator>
    )
}