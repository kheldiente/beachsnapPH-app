import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { snapsLayoutKeys } from "@/constants/Global";
import SnapsAlbumLayout from '@/app/snaps';
import { defaultHeaderWithRightBar } from '@/constants/SharedComponent';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import NewBeachSnapLayout from '../beach/addbeach-page';

const Stack = createNativeStackNavigator()

export default function SnapsLayout(props) {
    const navigation = useNavigation();

    const handleOnNewBeachSnapClick = () => {
        navigation.navigate({
            name: `${snapsLayoutKeys.NEW_BEACH_SNAP}`,
        });
    }

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={`${snapsLayoutKeys.SNAPS_ALBUM}`}
                component={SnapsAlbumLayout}
                options={defaultHeaderWithRightBar({
                    title: 'My snaps',
                    component: (<Ionicons
                        name="add-circle-outline"
                        size={25}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black'
                        }}
                        onPress={handleOnNewBeachSnapClick}
                    />)
                })} />
            <Stack.Screen
                name={`${snapsLayoutKeys.NEW_BEACH_SNAP}`}
                component={NewBeachSnapLayout}
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: 'white'
                    },
                    presentation: 'fullScreenModal',
                }}
            />
        </Stack.Navigator>
    )
}