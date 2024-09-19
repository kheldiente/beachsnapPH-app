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
                "regionId"  TEXT NOT NULL,
                "photoUrl"	TEXT NOT NULL,
                "caption"	TEXT,
                "dateVisited"	INTEGER NOT NULL,
                "metadata"  TEXT NOT NULL,
                "weatherId" TEXT NOT NULL,
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
                "dateVisited"	INTEGER NOT NULL,
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

export const getAllSnapFromBeach = async (beachId) => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    var results = []
    try {
        results = await db.getAllAsync(
            `SELECT *, 
            datetime(dateVisited, 'unixepoch', 'localtime') as dateVisited 
            FROM snap WHERE beachId = '${beachId}' ORDER BY dateVisited DESC`
        );

        await ReadOnlyDatabase.openDb()
        const allWeathers = await ReadOnlyDatabase.getAllWeathers();
        await ReadOnlyDatabase.closeDb()

        results = results.map((snap) => {
            return {
                ...snap,
                weather: allWeathers.filter((weather) => weather.id === snap.weatherId)[0]
            }
        })
    } catch (e) {
        console.log(e);
    }
    return results;
}

export const getAllSnaps = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    var uniqueBeachIds = {};
    var uniqueProvinceIds = {};
    try {
        const allSnaps = await db.getAllAsync(`
            SELECT *,
            datetime(dateVisited, 'unixepoch', 'localtime') as dateVisited 
            FROM snap ORDER BY metadata
        `);
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
        const beachesCountForProvinces = await ReadOnlyDatabase.getBeachesCountForProvinces(
            Object.keys(uniqueProvinceIds)
        );
        const allBeachDetails = await ReadOnlyDatabase.getBeachesWithIds(
            Object.keys(uniqueBeachIds)
        );
        const allWeathers = await ReadOnlyDatabase.getAllWeathers();
        await ReadOnlyDatabase.closeDb()

        // console.log(`beachesCount: ${beachesCountForProvinces?.length}`)

        allBeachDetails?.forEach((beach) => {
            const beachWithWeather = {
                ...beach,
                weather: allWeathers.filter((weather) => weather.id === beach.weatherId)[0]
            }
            uniqueProvinceIds[beachWithWeather.provinceId]['beaches'].push(beachWithWeather);
            if (uniqueProvinceIds[beachWithWeather.provinceId]['totalBeaches'] === undefined) {
                uniqueProvinceIds[beachWithWeather.provinceId]['totalBeaches'] =
                    beachesCountForProvinces.filter((info) =>
                        info.provinceId === beachWithWeather.provinceId
                    )[0].count
            }
        })

        console.log(`snaps available: ${allSnaps.length}`)
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

    var goals = [];
    try {
        goals = await db.getAllAsync(`
            SELECT *, 
            datetime(dateVisited, 'unixepoch', 'localtime') as dateVisited 
            FROM goal
        `);
        // console.log(`goals available: ${allRows.length}`)
    } catch (e) {
        console.log(e);
    }
    return goals;
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
            'INSERT INTO snap (beachId, provinceId, regionId, photoUrl, caption, dateVisited, metadata, weatherId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                `${snap.beachId}`,
                `${snap.provinceId}`,
                `${snap.regionId}`,
                `${snap.photoUrl}`,
                `${snap.caption}`,
                `${snap.dateVisited}`,
                `${snap.metadata}`,
                `${snap.weatherId}`
            ]
        )
        console.log(`inserted snap id: ${result.lastInsertRowId}`);
    } catch (e) {
        console.log(e);
    }
    return result;
}

export const getGeneralGoalStats = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    var result = {
        visitedBeaches: 0,
        visitedRegions: 0,
        visitedProvinces: 0,
        visitedMunicipalities: 0,
        totalBeaches: 500,
        totalRegions: 500,
        totalProvinces: 500,
        totalMunicipalities: 500,
    }

    try {
        const output = await db.getAllAsync(
            `SELECT COUNT(DISTINCT provinceId) as provinceCount,
            COUNT(DISTINCT regionId) as regionCount
            FROM snap`
        );
        const visBeaches = await db.getAllAsync(
            `SELECT DISTINCT beachId
            FROM snap`
        );

        await ReadOnlyDatabase.openDb()
        const visMunicipalities = await ReadOnlyDatabase.getMunicipalitiesVisited(
            visBeaches.map((snap) => snap.beachId));
        const totalCounts = await ReadOnlyDatabase.getTotalCounts();
        await ReadOnlyDatabase.closeDb()

        result = {
            visitedBeaches: visBeaches.length,
            visitedRegions: output[0].regionCount,
            visitedProvinces: output[0].provinceCount,
            visitedMunicipalities: visMunicipalities[0].count,
            totalBeaches: totalCounts[0].beachCount,
            totalRegions: totalCounts[0].regionCount,
            totalProvinces: totalCounts[0].provinceCount,
            totalMunicipalities: totalCounts[0].municipalityCount,
        }

        console.log(`generalGoalStats: ${JSON.stringify(result)}`)
    } catch (e) {
        console.log(e);
    }
    return result;
}

export const getRecentVisitedBeaches = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    var visitedBeaches = [];
    try {
        visitedBeaches = await db.getAllAsync(`
            SELECT DISTINCT(beachId), COUNT(*) as photoCount, 
            datetime(MAX(dateVisited), 'unixepoch', 'localtime') as dateVisited 
            FROM snap
            GROUP BY beachId
            ORDER BY dateVisited DESC LIMIT 5
        `);

        const beachIds = visitedBeaches.map((beach) => beach.beachId)

        await ReadOnlyDatabase.openDb();
        const beachDetails = await ReadOnlyDatabase.getBeachesWithIds(beachIds);
        await ReadOnlyDatabase.closeDb();

        visitedBeaches.forEach((beach, index) => {
            visitedBeaches[index] = {
                ...visitedBeaches[index],
                beach: beachDetails?.filter((details) => details.id === beach.beachId)[0]
            }
            console.log(`visitedBeaches: ${JSON.stringify(visitedBeaches[index])}`)
        })
    } catch (e) {
        console.log(e);
    }
    return visitedBeaches;
}

export const getTopBeachesWithManyPhotos = async () => {
    if (!db) {
        console.log('Database not initialized!');
        return;
    }

    var beaches = [];
    try {
        beaches = await db.getAllAsync(`
            SELECT DISTINCT(beachId), COUNT(*) as photoCount, 
            datetime(MAX(dateVisited), 'unixepoch', 'localtime') as dateVisited
            FROM snap
            GROUP BY beachId
            HAVING photoCount > 1
            ORDER BY photoCount DESC LIMIT 5
        `);

        // console.log(`beachesWithManyPhotos: ${beaches.length}`)
        const beachIds = beaches.map((beach) => beach.beachId)

        await ReadOnlyDatabase.openDb();
        const beachDetails = await ReadOnlyDatabase.getBeachesWithIds(beachIds);
        await ReadOnlyDatabase.closeDb();

        beaches.forEach((beach, index) => {
            beaches[index] = {
                ...beaches[index],
                beach: beachDetails?.filter((details) => details.id === beach.beachId)[0]
            }
            // console.log(`beachesWithManyPhotos: ${JSON.stringify(beaches[index])}`)
        })
    } catch (e) {
        console.log(e);
    }
    return beaches;
}


////////// DANGER!!! //////////

// export const removeAllSnaps = async () => {
//     if (!db) {
//         console.log('Database not initialized!');
//         return;
//     }

//     try {
//         await db.runAsync('DELETE FROM snap');
//     } catch (e) {
//         console.log(e);
//     }
// }

export const closeDb = async () => {
    await db.closeAsync();
}

export const initDb = async () => {
    await openDb();
    await createTables();
    await closeDb();
}