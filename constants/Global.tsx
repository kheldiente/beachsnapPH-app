// Put all configs here
export const appName = 'BeachSnap PH'
export const dbName = 'beachsnap.db'
export const dbVersions = [
    {
        name: 'beachsnap-v1',
        version: '1.0.0',
        fileUrl: require ('@/assets/db/beachsnap-v1.db'),
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
        icon: 'cloudy',
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
]

