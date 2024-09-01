import { dbName, dbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

var db: SQLite.SQLiteDatabase;
var cachedRegions;

export const dbFileSystemUrl = () => {
    return `${FileSystem.documentDirectory}SQLite/beachsnap-v1.db`;
}

// Download db from assets to file system
export const importDbToFileSystem = async () => {

    try {
        const fileInfo = await FileSystem
            .getInfoAsync(`${FileSystem.documentDirectory}SQLite/beachsnap-v1.db`);

        if (fileInfo.exists) {
            console.log('DB is in the file system');
            return;
        }

        console.log('Importing db to file system...');
        const { uri } = await FileSystem.downloadAsync(
            Asset.fromModule(dbVersions[0].fileUrl).uri,
            `${FileSystem.documentDirectory}SQLite/beachsnap-v1.db`
        )
        console.log('Finished downloading to ', uri);
    } catch (e) {
        console.log(e)
    }
}

export const openDb = async () => {
    try {
        db = await SQLite.openDatabaseAsync(dbName);
        console.log('Database initialized!');
    } catch (e) {
        console.log(e);
    }
}

export const getAllRegions = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    try {
        cachedRegions = await db.getAllAsync('SELECT * FROM region');
        console.log(`regions available: ${cachedRegions.length}`)
    } catch (e) {
        console.log(e);
    }
}

export default async function initDb() {
    await importDbToFileSystem();
    await openDb();
    await getAllRegions();
}