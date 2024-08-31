import { dbName } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';

var db: SQLite.SQLiteDatabase;

export const initDb = async () => {
    db = await SQLite.openDatabaseAsync(dbName);
    await db.execAsync('PRAGMA journal_mode = WAL');
    console.log('Database initialized!');
}

export const getAllRegions = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    // await db.runAsync('INSERT INTO region (id, name) VALUES (?, ?)', 'REGSAMPLE1', 'Sample Region');

    // `getAllAsync()` is useful when you want to get all results as an array of objects.
    const allRows = await db.getAllAsync('SELECT * FROM region');
    for (const row of allRows) {
        console.log(row.id, row.name);
    }
    console.log(`getAllRegions: ${allRows.length}`)
}