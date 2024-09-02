import { readOnlyDbName, readOnlyDbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

var db: SQLite.SQLiteDatabase;
var cachedRegions = null;

export const dbFileSystemUrl = () => {
    return `${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`;
}

// Download db from assets to file system
export const importDbToFileSystem = async () => {

    try {
        const fileInfo = await FileSystem
            .getInfoAsync(`${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`);

        if (fileInfo.exists) {
            console.log('DB is in the file system');
            return;
        }

        console.log('Importing db to file system...');
        const { uri } = await FileSystem.downloadAsync(
            Asset.fromModule(readOnlyDbVersions[0].fileUrl).uri,
            `${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`
        )
        console.log('Finished downloading to ', uri);
    } catch (e) {
        console.log(e)
    }
}

export const openDb = async () => {
    try {
        db = await SQLite.openDatabaseAsync(readOnlyDbName);
        console.log(`Database ${readOnlyDbName} initialized!`);
    } catch (e) {
        console.log(e);
    }
}

export const getAllRegions = async () => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    try {
        if (cachedRegions === null) {
            cachedRegions = await db.getAllAsync('SELECT * FROM region');
        } else {
            console.log('using cached regions')
        }
        console.log(`regions available: ${cachedRegions.length}`)
    } catch (e) {
        console.log(e);
    }

    return cachedRegions;
}

export const closeDb = async () => {
    await db.closeAsync();
}

export const initDb = async() => {
    await importDbToFileSystem();
    await openDb();
    await getAllRegions();
    await closeDb();
}