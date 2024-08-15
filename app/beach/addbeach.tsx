import {
    View,
    Text,
    StyleSheet,
    Button,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import FullScreenModal from '@/components/FullScreenModal';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image } from 'react-native-elements';

export default function AddBeachModal({ isVisible, onClose }) {
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
        <FullScreenModal
            isVisible={isVisible}
            onClose={onClose}
        >
            {!image && renderAddPhotosCta()}
            {image &&
                <Image source={{ uri: image }} style={styles.imageUploaded} />
            }
        </FullScreenModal>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: DefaultFont.fontFamily,
        alignSelf: 'center',
    },
    imageUploaded: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
});

