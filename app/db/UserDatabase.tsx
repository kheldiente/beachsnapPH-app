import { userDbName, userDbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as ReadOnlyDatabase from '@/app/db/ReadOnlyDatabase'

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
                "beachId"	TEXT NOT NULL,
                "provinceId"	TEXT NOT NULL,
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

    var uniqueBeachIds = {};
    var uniqueProvinceIds = {};
    try {
        const allSnaps = await db.getAllAsync('SELECT * FROM snap ORDER BY dateVisited DESC, beachId DESC');
        allSnaps.forEach((snap) => {
            if (uniqueProvinceIds[snap.provinceId] === undefined) {
                uniqueProvinceIds[snap.provinceId] = {
                    id: snap.provinceId,
                    snaps: [],
                    beaches: [],
                }
            }

            if (uniqueBeachIds[snap.beachId] === undefined) {
                uniqueBeachIds[snap.beachId] = {
                    id: snap.beachId,
                }
            }

            uniqueProvinceIds[snap.provinceId]['snaps'].push(snap);
        })

        await ReadOnlyDatabase.openDb()
        // const allProvinceDetails = await ReadOnlyDatabase.getProvincesWithDetails(Object.keys(uniqueProvinceIds))
        const allBeachDetails = await ReadOnlyDatabase.getBeachesWithIds(Object.keys(uniqueBeachIds))
        await ReadOnlyDatabase.closeDb()

        allBeachDetails?.forEach((beach) => {
            uniqueProvinceIds[beach.provinceId]['beaches'].push(beach);
        })

        // console.log(`provinces with snaps: ${allProvinceDetails.length}`)
        // console.log(`beaches with snaps: ${allBeachDetails.length}`)

        // console.log(`beachIds: ${JSON.stringify(uniqueBeachIds)}`)

        console.log(`snaps available: ${allSnaps.length}`)
        // console.log(`provinceIds: ${JSON.stringify(uniqueProvinceIds)}`)
    } catch (e) {
        console.log(e);
    }
    return uniqueProvinceIds;
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
            'INSERT INTO snap (beachId, provinceId, photoUrl, caption, dateVisited) VALUES (?, ?, ?, ?, ?)',
            [`${snap.beachId}`, `${snap.provinceId}`, `${snap.photoUrl}`, `${snap.caption}`, `${snap.dateVisited}`]
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
    await closeDb();
}