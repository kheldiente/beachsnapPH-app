import React, { useState } from "react";
import {
    View,
    Pressable,
    Text,
    StyleSheet
} from "react-native";

export default function SegmentedButton(props) {
    const [selectedIndex = 0, setSelectedIndex] = useState(0);
    const { style, onPress, buttons = [] } = props;

    const handleOnButtonClick = (index) => {
        setSelectedIndex(index);
        if (onPress !== undefined) {
            onPress(index);
        }
    };

    const createButton = (title, index) => (
        <Pressable 
            style={[styles.button, 
                {backgroundColor: selectedIndex == index ? "gainsboro" : "transparent"}
            ]} 
            onPress={() => {
                handleOnButtonClick(index);
            }}
            key={index}
        >
            <Text style={[styles.text, {color: selectedIndex == index ? "black" : "gray"}]}>
                {title}
            </Text>
        </Pressable>
    );

    return (
        <View style={style}>
            {buttons.map((title, index) => createButton(title, index))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'gainsboro',
        minWidth: "45%",
        margin: 2
    },
    text: {
        fontSize:12,
        color: 'black',
    },
  });