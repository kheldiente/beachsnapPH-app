import { readOnlyDbName, readOnlyDbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

var db: SQLite.SQLiteDatabase;

var cachedRegions = null;
var cachedProvinces = {};
var cachedBeaches = {}; // Key is Region Id

export const dbFileSystemUrl = () => {
    return `${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`;
}

// Download db from assets to file system
export const importDbToFileSystem = async () => {

    try {
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
            intermediates: true
        });

        try {
            const fileInfo = await FileSystem
                .getInfoAsync(`${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`);

            if (fileInfo.exists) {
                console.log(`DB ${readOnlyDbName} is in the file system`);
                return;
            }

            console.log(`Importing db ${readOnlyDbName} to file system...`);
            const { uri } = await FileSystem.downloadAsync(
                Asset.fromModule(readOnlyDbVersions[0].fileUrl).uri,
                `${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`
            )
            console.log(`Finished moving db ${readOnlyDbName} to `, uri);
        } catch (e) {

        }
    } catch (e) {
        console.log(e)
    }
}

export const openDb = async () => {
    try {
        db = await SQLite.openDatabaseAsync(readOnlyDbName);
        console.log(`Database ${readOnlyDbName} opened!`);
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
            cachedRegions = await db.getAllAsync('SELECT * FROM region ORDER BY name');
        } else {
            console.log('using cached regions')
        }
        // console.log(`regions available: ${cachedRegions.length}`)
    } catch (e) {
        console.log(e);
    }

    return cachedRegions;
}

export const getProvincesWithBeaches = async (regionId) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    try {
        const statement = await db.prepareAsync('SELECT * FROM province WHERE regionId = $regionId');

        if (regionId in cachedProvinces) {
            console.log(`using cached provinces for ${regionId}`);
        } else {
            const result = await statement.executeAsync({ $regionId: regionId });
            cachedProvinces[regionId] = await result.getAllAsync();
        }

        ///// GET BEACHES from REGIONS /////

        const statement2 = await db.prepareAsync(
            `SELECT beach.id, beach.name, beach.municipality, beach.regionId, 
            beach.provinceId, province.name as province
            FROM province
            INNER JOIN beach ON province.id = beach.provinceId  where beach.regionId = $regionId;`
        );

        if (regionId in cachedBeaches) {
            console.log(`using cached beaches for ${regionId}`);
        } else {
            const result = await statement2.executeAsync({ $regionId: regionId });
            cachedBeaches[regionId] = await result.getAllAsync();

            if (regionId in cachedBeaches) {
                cachedProvinces[regionId].forEach((province) => {
                    province[`beaches`] = cachedBeaches[regionId].filter((bch) => bch.provinceId === province.id);
                })
            }
        }
    } catch (e) {
        console.log(e);
    }

    return cachedProvinces[regionId];
}

export const getMatchingBeaches = async ({
    keyword = '',
    offset = 0,
    limit = 20,
    applyLimit = true
}) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    var beaches = [];
    try {
        var statement = `SELECT beach.id, beach.name, beach.municipality, province.name as province,
                beach.provinceId, beach.regionId
                FROM province
                INNER JOIN beach ON province.id = beach.provinceId 
                WHERE beach.name LIKE "${keyword}%" ORDER BY beach.name`

        if (applyLimit) {
            statement = statement + ` LIMIT ${limit} OFFSET ${offset}`
        }
        beaches = await db.getAllAsync(statement);

        console.log(`getMatchingBeaches: ${beaches.length}, 
            keyword: ${keyword}, 
            limit: ${limit}, 
            offset: ${offset},
            applyLimit: ${applyLimit}`)
    } catch (e) {
        console.log(e);
    }
    return beaches;
}

export const getProvincesWithDetails = async (ids) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    const createWhereClause = (ids) => {
        var output = '('
        output = output + ids.map((id) => `'${id}'`).join(',')
        output = output + ')'
        return output
    }

    var provinces = [];
    try {
        provinces = await db.getAllAsync(
            `SELECT * FROM province WHERE id in ${createWhereClause(ids)}`
        )
    } catch (e) {
        console.log(e);
    }
    return provinces;
}

export const getBeachesWithIds = async (ids) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    const createWhereClause = (beachIds) => {
        var output = '('
        output = output + beachIds.map((id) => `'${id}'`).join(',')
        output = output + ')'
        return output
    }

    var beaches = [];
    try {
        beaches = await db.getAllAsync(
            `SELECT beach.id, beach.name, beach.municipality, province.name as province,
            beach.provinceId, beach.regionId
            FROM province
            INNER JOIN beach ON province.id = beach.provinceId 
            WHERE beach.id in ${createWhereClause(ids)}`
        )
    } catch (e) {
        console.log(e);
    }
    return beaches;
}

export const closeDb = async () => {
    await db.closeAsync();
}

export const initDb = async () => {
    await importDbToFileSystem();
}