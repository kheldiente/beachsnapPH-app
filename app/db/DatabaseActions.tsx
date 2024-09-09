import * as UserDatabase from '@/app/db/UserDatabase';
import * as ReadOnlyDatabase from '@/app/db/ReadOnlyDatabase';

export const setupAllDbs = async () => {
    await ReadOnlyDatabase.initDb();
    await UserDatabase.initDb();
}

export const getBeachesFromDb = async (params) => {
    await ReadOnlyDatabase.openDb();
    const beaches = await ReadOnlyDatabase.getMatchingBeaches(params);
    await ReadOnlyDatabase.closeDb();
    
    return beaches;
}

export const getAllRegions = async () => {
    await ReadOnlyDatabase.openDb();
    const regions = await ReadOnlyDatabase.getAllRegions();
    await ReadOnlyDatabase.closeDb();

    return regions;
}

export const getAllProvinces = async (id) => {
    await ReadOnlyDatabase.openDb();
    const provinces = await ReadOnlyDatabase.getProvincesWithBeaches(id);
    await ReadOnlyDatabase.closeDb();

    return provinces
}

export const saveSnap = async (snap) => {
    // Expected format -- 9/9/2024, 5:40:19 PM
    const sanitizedDate = new Date(snap.dateVisited).toLocaleString()
    const snapParams = {
        ...snap,
        dateVisited: sanitizedDate
    }
    console.log(`saveSnap: ${JSON.stringify(snapParams)}`)

    await UserDatabase.openDb();
    const result = await UserDatabase.saveSnap(snapParams);
    await UserDatabase.closeDb();

    return result
}