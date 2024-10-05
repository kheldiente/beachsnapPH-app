import * as UserDatabase from '@/app/db/UserDatabase';
import * as ReadOnlyDatabase from '@/app/db/ReadOnlyDatabase';
import { dateToUnixTimestamp } from '@/constants/Utils';
import * as LocalStorage from '@/app/storage/LocalStorage';
import { readOnlyDbName } from '@/constants/Global';

export const setupAllDbs = async () => {
    await ReadOnlyDatabase.initDb();
    await UserDatabase.initDb();

    await LocalStorage.setNewReadOnlyDbName(readOnlyDbName)
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
    const snapParams = {
        ...snap,
        dateVisited: dateToUnixTimestamp(new Date(snap.dateVisited)),
        createdAt: dateToUnixTimestamp(new Date()),
    }
    await UserDatabase.openDb();
    const result = await UserDatabase.saveSnap(snapParams);
    await UserDatabase.closeDb();

    return result
}

export const getAllSnaps = async () => {
    await UserDatabase.openDb();
    const snaps = await UserDatabase.getAllSnaps();
    await UserDatabase.closeDb();   

    return snaps;
}

export const getAllSnapFromBeach = async (beachId) => {
    await UserDatabase.openDb();
    const snaps = await UserDatabase.getAllSnapFromBeach(beachId);
    await UserDatabase.closeDb();   

    return snaps;
}

export const getGeneralGoalStats = async () => {
    await UserDatabase.openDb();
    const goalStats = await UserDatabase.getGeneralGoalStats();
    await UserDatabase.closeDb();   

    return goalStats;
}

export const getRecentVisitedBeaches = async () => {
    await UserDatabase.openDb();
    const visitedBeaches = await UserDatabase.getRecentVisitedBeaches();
    await UserDatabase.closeDb();   

    return visitedBeaches;
}

export const getTopBeachesWithManyPhotos = async () => {
    await UserDatabase.openDb();
    const beaches = await UserDatabase.getTopBeachesWithManyPhotos();
    await UserDatabase.closeDb();   

    return beaches;
}

export const getAllWeathers = async () => {
    await ReadOnlyDatabase.openDb();
    const weathers = await ReadOnlyDatabase.getAllWeathers();
    await ReadOnlyDatabase.closeDb();

    return weathers;
}

export const deleteSnap = async (snapId) => {
    await UserDatabase.openDb();
    const result = await UserDatabase.deleteSnap(snapId);
    await UserDatabase.closeDb();

    return result;
}

export const getBeachesWithIds = async (ids) => {
    await ReadOnlyDatabase.openDb();
    const beaches = await ReadOnlyDatabase.getBeachesWithIds(ids);
    await ReadOnlyDatabase.closeDb();

    return beaches;
}

export const saveGoal = async (goal) => {
    await UserDatabase.openDb();
    const result = await UserDatabase.saveGoal(goal);
    await UserDatabase.closeDb();

    return result;
}

export const getLatestGoal = async () => {
    await UserDatabase.openDb();
    const goal = await UserDatabase.getLatestGoal();
    await UserDatabase.closeDb();

    return goal;
}

export const getRemainingBeachesToVisit = async () => {
    await UserDatabase.openDb();
    const beaches = await UserDatabase.getRemainingBeachesToVisit();
    await UserDatabase.closeDb();

    return beaches;
}

export const getVisitedAndNotVisitedBeaches = async (provinceId) => {
    await UserDatabase.openDb();
    const beaches = await UserDatabase.getVisitedAndNotVisitedBeaches(provinceId);
    await UserDatabase.closeDb();

    return beaches;
}
