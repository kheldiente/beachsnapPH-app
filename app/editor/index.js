import {
    View,
    StyleSheet,
    Button,
    Text,
    ScrollView,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image } from 'react-native-elements';

export default function BeachSnapEditor(props: any) {
    const [image, setImage] = useState(null);

    const renderAddPhotosCta = () => {
        const pickImage = async () => {
            // No permissions request is necessary 
            // for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        };

        return (
            <Button
                title="Pick an image from camera roll"
                onPress={pickImage}
            />
        );
    }

    return (
        <ScrollView>
            <View
                style={{
                    ...props.style,
                    width: '100%',
                    height: '100%',
                }}
            >
                {!image && renderAddPhotosCta()}
                {image &&
                    <View
                        style={styles.imageContainer}
                    >
                        <Image source={{ uri: image }} style={styles.imageUploaded} />
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: DefaultFont.fontFamily,
        alignSelf: 'center',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageUploaded: {
        width: 200,
        height: 200,
    },
});

