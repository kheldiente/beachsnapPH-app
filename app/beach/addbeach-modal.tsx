import {
    StyleSheet,
} from 'react-native';
import { DefaultFont } from '@/constants/Fonts';
import FullScreenModal from '@/components/FullScreenModal';
import BeachSnapEditor from '@/app/editor/index';

export default function NewBeachSnapModal({ isVisible, onClose }) {
    return (
        <FullScreenModal
            title='New beach snap'
            isVisible={isVisible}
            onClose={onClose}
        >
            <BeachSnapEditor/>
        </FullScreenModal>
    )
}
