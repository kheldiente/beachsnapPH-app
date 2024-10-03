import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import DeviceInfo from 'react-native-device-info';

export const isEmulatorSync = async () => {
    return await DeviceInfo.isEmulator();
}

export const askMediaLbraryPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
        return { 
            granted: true, 
            title: "Media library permission not granted!"
        }
    }
    return { 
        granted: true, 
        title: "Media library permission granted!"
    }
}

export const saveImageToAndroidDevice = async (imageUri) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
        return null
    }

    var resultUri = null;
    try {
        const baseImgDir = 'BS+PH_1001';
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${baseImgDir}`, {
            intermediates: true
        });
        // const { uri } = await FileSystem.copyAsync({
        //     from: imageUri,
        //     to: `${FileSystem.documentDirectory}${baseImgDir}/${dateToUnixTimestamp(new Date())}.jpg`
        // })

        const imgFileName = imageUri.split("/").pop();
        console.log(`saveImageToDevice directory exists -- ${FileSystem.documentDirectory}${baseImgDir}`)
        console.log(`saveImageToDevice imgFileName: ${imgFileName}`)
        // const imgFile = await FileSystem.downloadAsync(
        //     imageUri,
        //     `${FileSystem.documentDirectory}${baseImgDir}/${dateToUnixTimestamp(new Date())}.jpg`
        // )
        const newImgFile = await FileSystem.copyAsync({
            from: imageUri,
            to: `${FileSystem.documentDirectory}${baseImgDir}/${imgFileName}`
        })

        // const newImgFile = await FileSystem.downloadAsync(
        //     imageUri,
        //     `${FileSystem.documentDirectory}${baseImgDir}/${imgFileName}`
        // )

        // const newImgFile = await MediaLibrary.createAssetAsync(imageUri);
        // const assets = await MediaLibrary.getAssetsAsync();


        console.log(`saveImageToDevice newImgFile: ${newImgFile}`)
        // console.log(`saveImageToDevice: ${JSON.stringify(assets)}`)
        // console.log(`saveImageToDevice: ${JSON.stringify(newImgFile)}`)

        resultUri = newImgFile.uri;
    } catch (error) {
        console.log(error)
    }
    return resultUri;
}

// export const saveImageToDevice = async (imageUri) => {
//     const permission = await MediaLibrary.requestPermissionsAsync();
//     if (permission.status !== 'granted') {
//         return null
//     }
    
//     var resultUri = null;
//     try {
//         const baseImgDir = 'BS+PH_1001';
//         await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${baseImgDir}`, {
//             intermediates: true
//         });
//         // const { uri } = await FileSystem.copyAsync({
//         //     from: imageUri,
//         //     to: `${FileSystem.documentDirectory}${baseImgDir}/${dateToUnixTimestamp(new Date())}.jpg`
//         // })

//         const imgFileName = imageUri.split("/").pop();
//         console.log(`saveImageToDevice directory exists -- ${FileSystem.documentDirectory}${baseImgDir}`)
//         console.log(`saveImageToDevice imgFileName: ${imgFileName}`)
//         // const imgFile = await FileSystem.downloadAsync(
//         //     imageUri,
//         //     `${FileSystem.documentDirectory}${baseImgDir}/${dateToUnixTimestamp(new Date())}.jpg`
//         // )
//         // const newImgFile = await FileSystem.copyAsync({
//         //     from: imageUri,
//         //     to: `${FileSystem.documentDirectory}${baseImgDir}/${imgFileName}`
//         // })

//         // const newImgFile = await FileSystem.downloadAsync(
//         //     imageUri,
//         //     `${FileSystem.documentDirectory}${baseImgDir}/${imgFileName}`
//         // )

//         // const newImgFile = await MediaLibrary.createAssetAsync(imageUri);
//         const assets = await MediaLibrary.getAssetsAsync();


//         console.log(`saveImageToDevice original: ${imageUri}`)
//         console.log(`saveImageToDevice: ${JSON.stringify(assets)}`)
//         // console.log(`saveImageToDevice: ${JSON.stringify(newImgFile)}`)

//         resultUri = newImgFile.uri;
//     } catch (error) {
//         console.log(error)
//     }
//     return resultUri;
// }