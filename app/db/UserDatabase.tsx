import { userDbName, userDbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

var db: SQLite.SQLiteDatabase;

export const openDb = async () => {
    try {
        db = await SQLite.openDatabaseAsync(userDbName);
        console.log(`Database ${userDbName} opened!`);
    } catch (e) {
        console.log(e);
    }
}

export const createTables = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS "snap" (
                "id"	INTEGER NOT NULL,
                "beachId"	INTEGER NOT NULL,
                "photoUrl"	TEXT NOT NULL,
                "caption"	TEXT,
                "dateVisited"	TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );

            CREATE TABLE IF NOT EXISTS "goalList" (
                "id"	INTEGER NOT NULL,
                "name"	TEXT NOT NULL,
                PRIMARY KEY("id")
            );

            CREATE TABLE IF NOT EXISTS "goal" (
                "id"	INTEGER NOT NULL,
                "goalListId"	INTEGER NOT NULL,
                "beachId"	TEXT NOT NULL,
                "name"	TEXT,
                "dateVisited"	TEXT,
                "targetDateToVisit"	TEXT NOT NULL,
                "notes"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT),
                FOREIGN KEY("goalListId") REFERENCES "goalList"("id")
            )
        `);
        console.log(`User db - tables are ready!`)
    } catch (e) {
        console.log(e);
    }
}

export const getAllSnaps = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    try {
        const allRows = await db.getAllAsync('SELECT * FROM snap ORDER BY dateVisited DESC, beachId DESC');
        console.log(`snaps available: ${allRows.length}`)
    } catch (e) {
        console.log(e);
    }
}

export const getAllGoals = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    try {
        const allRows = await db.getAllAsync('SELECT * FROM goal');
        // console.log(`goals available: ${allRows.length}`)
    } catch (e) {
        console.log(e);
    }
}

export const saveSnap = async (snap) => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    console.log(`saving snap: ${JSON.stringify(snap)}`)
    var result = null;
    try {
        result = await db.runAsync(
            'INSERT INTO snap (beachId, photoUrl, caption, dateVisited) VALUES (?, ?, ?, ?)',
            [`${snap.beachId}`, `${snap.photoUrl}`, `${snap.caption}`, `${snap.dateVisited}`]
        )
        console.log(`inserted snap id: ${result.lastInsertRowId}`);
    } catch (e) {
        console.log(e);
    }
    return result;
}

export const removeAllSnaps = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    try {
        await db.runAsync('DELETE FROM snap');
    } catch (e) {
        console.log(e);
    }
}

export const closeDb = async () => {
    await db.closeAsync();
}

export const initDb = async () => {
    await openDb();
    await createTables();
    await getAllSnaps();
    await closeDb();
}