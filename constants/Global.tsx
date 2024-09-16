// Put all configs here
export const appName = 'BeachSnap PH'
export const readOnlyDbName = 'beachsnap-v1.db'
export const readOnlyDbVersions = [
    {
        name: 'beachsnap-v1',
        version: '1.0.0',
        fileUrl: require('@/assets/db/beachsnap-v1.db'),
    }
]

export const userDbName = 'user-beachsnap-v1.db'
export const userDbVersions = [
    {
        name: 'user-beachsnap-v1',
        version: '1.0.0',
    }
]

export const exploreLayoutKeys = {
    REGION_LIST: "_RegionList",
    BEACH_LIST: "_BeachList",
}

export const snapsLayoutKeys = {
    SNAPS_ALBUM: "_SnapsAlbum",
    NEW_BEACH_SNAP: "_NewBeachSnap",
    BEACH_PROFILE: "_BeachProfile",
    PHOTO_POST: "_PhotoPost",
}

export const myProgressLayoutKeys = {
    PROGRESS_LIST: "_ProgressList",
}

export const editorLayoutKeys = {
    EDITOR: "_Editor"
}

export const items = [
    {
        title: 'Beach name',
        key: '_bchName',
        icon: 'footsteps',
        type: 'chevron',
        value: 'Bagasbas'
    },
    {
        title: 'Date visited',
        key: '_dateVstd',
        icon: 'calendar',
        type: 'chevron',
        value: 'Jan 1, 2024'
    },
    {
        title: 'Weather',
        key: '_weather',
        icon: 'cloudy',
        type: 'chip',
        value: 0,
    },
]

export const defaultWeather = {
    id: 'WEA1',
    name: 'Sunny',
}

