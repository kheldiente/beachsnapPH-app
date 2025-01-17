import { readOnlyDbName, readOnlyDbVersions } from '@/constants/Global';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as LocalStorage from '@/app/storage/LocalStorage';

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
            // DOESN'T WORK IN ANDROID FOR SOME REASON
            // const fileInfo = await FileSystem
            //     .getInfoAsync(`${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`);

            // if (fileInfo.exists) {
            // console.log(`DB ${readOnlyDbName} is in the file system`);
            // return;
            // }

            // ALWAYS IMPORT DB ON STARTUP!!!
            console.log(`Importing db ${readOnlyDbName} to file system...`);
            const { uri } = await FileSystem.downloadAsync(
                Asset.fromModule(readOnlyDbVersions[0].fileUrl).uri,
                `${FileSystem.documentDirectory}SQLite/${readOnlyDbName}`
            )
            console.log(`Finished moving db ${readOnlyDbName} to `, uri);
        } catch (e) {
            console.log(`Error importing db ${readOnlyDbName} to file system: ${e}`);
        }
    } catch (e) {
        console.log(`Error making directory for db ${readOnlyDbName}: ${e}`);
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

const createWhereClause = (ids) => {
    var output = '('
    output = output + ids.map((id) => `'${id}'`).join(',')
    output = output + ')'
    return output
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

export const getMunicipalitiesVisited = async (beachIds) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    console.log(`beachIds: ${JSON.stringify(beachIds)}`)
    var result = [];
    try {
        result = await db.getAllAsync(
            `SELECT COUNT(DISTINCT municipality) as count
            FROM beach WHERE id in ${createWhereClause(beachIds)}`
        );
    } catch (e) {
        console.log(e);
    }
    return result;
}

export const getTotalCounts = async () => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    var result = [];
    try {
        result = await db.getAllAsync(
            `SELECT (SELECT COUNT(*) FROM region) AS regionCount, 
            (SELECT COUNT(*) FROM province) AS provinceCount, 
            (SELECT COUNT(DISTINCT municipality) FROM beach) AS municipalityCount, 
            (SELECT COUNT(*) FROM beach) AS beachCount`
        );
    } catch (e) {
        console.log(e);
    }
    return result;
}

export const getBeachesCountForProvinces = async (provinceIds) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    // console.log(`beachesCount ids: ${provinceIds}`)
    var result = [];
    try {
        result = await db.getAllAsync(
            `SELECT beach.provinceId, COUNT(*) as count
            FROM province
            INNER JOIN beach ON province.id = beach.provinceId WHERE beach.provinceId in ${createWhereClause(provinceIds)} 
            GROUP BY beach.provinceId`
        );
    } catch (e) {
        console.log(e);
    }
    return result;
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
            beach.provinceId, province.name as province, beach.description
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
                beach.provinceId, beach.regionId, beach.description
                FROM province
                INNER JOIN beach ON province.id = beach.provinceId 
                WHERE beach.name LIKE "${keyword}%"
                OR province.name LIKE "${keyword}%"
                OR municipality LIKE "${keyword}%"
                ORDER BY beach.name`

        // var statement = `SELECT beach.id, beach.name, beach.municipality, province.name as province,
        //         beach.provinceId, beach.regionId, beach.description
        //         FROM province
        //         INNER JOIN beach ON province.id = beach.provinceId 
        //         WHERE beach.name LIKE "${keyword}%"
        //         OR WHERE province.name LIKE "${keyword}%"
        //         ORDER BY beach.name DESC, province.name`

        if (applyLimit) {
            statement = statement + ` LIMIT ${limit} OFFSET ${offset}`
        }
        beaches = await db.getAllAsync(statement);

        // console.log(`getMatchingBeaches: ${beaches.length}, 
        //     keyword: ${keyword}, 
        //     limit: ${limit}, 
        //     offset: ${offset},
        //     applyLimit: ${applyLimit}`)
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

    var beaches = [];
    try {
        beaches = await db.getAllAsync(
            `SELECT beach.id, beach.name, beach.municipality, province.name as province,
            beach.provinceId, beach.regionId, beach.description
            FROM province
            INNER JOIN beach ON province.id = beach.provinceId 
            WHERE beach.id in ${createWhereClause(ids)}`
        )
    } catch (e) {
        console.log(e);
    }
    return beaches;
}

export const getAllWeathers = async () => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    var weathers = [];
    try {
        weathers = await db.getAllAsync('SELECT * FROM WEATHER');
        console.log(`weathers available: ${weathers.length}`)
    } catch (e) {
        console.log(e);
    }

    return weathers;
}

export const getWeatherWithId = async (weatherId) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    var weathers = [];
    try {
        weathers = await db.getAllAsync(
            `SELECT * FROM WEATHER WHERE id = '${weatherId}' LIMIT 1`
        );
    } catch (e) {
        console.log(e);
    }

    return weathers[0];
}

export const getBeachesFromProvince = async (provinceId) => {
    if (!db) {
        console.log(`Database ${readOnlyDbName} not initialized!`);
        return;
    }

    var beaches = [];
    try {
        beaches = await db.getAllAsync(
            `SELECT beach.*, province.name as province
            FROM beach
            INNER JOIN province ON beach.provinceId = province.id
            WHERE provinceId = '${provinceId}'`
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

export const reimportDb = async () => {
    return await LocalStorage.isToReimportReadOnlyDb(readOnlyDbName)
}