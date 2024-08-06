export type Beach = {
    id: string, // E.g. "L-B-CN-D-Bag001". Stands for Luzon-Bicol-CamNorte-Daet-Bagasbas001 (001 is a random number)
    name: string, //  Beach name. E.g. Bagasbas beach
    municipality: string, // E.g. Daet
    province: string, // E.g. Camarines Norte
    region: string, // E.g. Bicol Region
    islandGroup: string, // Luzon, Visayas or Mindanao
}

export type BeachList = {
    data: Beach[];
}

export const gridProvinces = [
    ["Albay", "Camarines Norte", "Camarines Sur",],
    ["Catanduanes", "Masbate", "Sorsogon",],
    ["Batanes", "Cagayan", "Isabela",],
    ["Agusan del Norte", "Dinagat Islands", "Surigao del Norte"],
    ["Surigao del Sur", "Aurora", "Bataan"],
    ["Zambales", "Sarangani", "South Cotabato"],
    ["Sultan Kudarat", "Bohol", "Cebu"],
    ["Siquijor", "Davao del Norte", "Davao Occidental"],
    ["Davao Oriental", "Biliran", "Eastern Samar"],
    ["Leyte", "Northern Samar", "Samar"],
    ["Southern Leyte", "Ilocos Norte", "Ilocos Sur"],
    ["La Union", "Pangasinan", "Basilan"],
    ["Sulu", "Tawi-tawi", "Manila"],
    ["Negros Occidental", "Negros Oriental", "Camiguin"],
    ["Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
    ["Marinduque", "Occidental Mindoro", "Oriental Mindoro"],
    ["Palawan", "Romblon", "Batangas"],
    ["Cavite", "Quezon", "Aklan"],
    ["Antique", "Capiz", "Guimaras"],
    ["Iloilo", "Zamboanga del Norte", "Zamboanga del Sur"]
]

export const gridRegions = [
    ["Bicol", "Cagayan Valley", "Caraga"],
    ["Central Luzon", "Soccsksargen", "Central Visayas"],
    ["Davao", "Eastern Visayas", "Ilocos"],
    ["BARMM", "NCR", "Negros Island"],
    ["Northern Mindanao", "Mimaropa", "Calabarzon"],
    ["Western Visayas", "Zamboanga Peninsula", ""]
]

export const mockBeachListData: BeachList = {
    "data": [
        {
            id: "L-B-CN-D-Bag001",
            name: "Bagasbas",
            municipality: "Daet",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-ApuGra001",
            name: "Apuao Grande Island",
            municipality: "Mercedes",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-Car001",
            name: "Caringo Island",
            municipality: "Mercedes",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-Par001",
            name: "Maculabo Island",
            municipality: "Paracale",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-Par001",
            name: "Maculabo Island",
            municipality: "Paracale",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-Par001",
            name: "Maculabo Island",
            municipality: "Paracale",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },
        {
            id: "L-B-CN-M-Par001",
            name: "Maculabo Island",
            municipality: "Paracale",
            province: "Camarines Norte",
            region: "Bicol",
            islandGroup: "Luzon"
        },

    ]
}

export const getThumbnail = (regionKey) => {
    // Note: require() doesn't work with dynamic values. 
    // Hence, we're using static strings here
    console.log(`getThumbnail: ${regionKey}`)
    switch (regionKey) {
        case "Bicol":
            return require('@/assets/images/thumbnail/bicol-thumbnail.jpeg')
        case "Cagayan Valley":
            return require('@/assets/images/thumbnail/cagayan-valley-thumbnail.jpeg')
        case 'Caraga':
            return require('@/assets/images/thumbnail/caraga-thumbnail.jpeg')
        case 'Central Luzon':
            return require('@/assets/images/thumbnail/central-luzon-thumbnail.jpeg')
        case 'Soccsksargen':
            return require('@/assets/images/thumbnail/soccsksargen-thumbnail.jpeg')
        case 'Central Visayas':
            return require('@/assets/images/thumbnail/central-visayas-thumbnail.jpeg')
        case 'Davao':
            return require('@/assets/images/thumbnail/davao-thumbnail.jpeg')
        case 'Eastern Visayas':
            return require('@/assets/images/thumbnail/eastern-visayas-thumbnail.jpeg')
        case 'Ilocos':
            return require('@/assets/images/thumbnail/ilocos-thumbnail.jpeg')
        case 'BARMM':
            return require('@/assets/images/thumbnail/barmm-thumbnail.jpeg')
        case 'NCR':
            return require('@/assets/images/thumbnail/ncr-thumbnail.jpeg')
        case 'Negros Island':
            return require('@/assets/images/thumbnail/negros-island-thumbnail.jpeg')
        case 'Northern Mindanao':
            return require('@/assets/images/thumbnail/northern-mindanao-thumbnail.jpeg')
        case 'Mimaropa':
            return require('@/assets/images/thumbnail/mimaropa-thumbnail.jpeg')
        case 'Calabarzon':
            return require('@/assets/images/thumbnail/calabarzon-thumbnail.jpeg')
        default:
            return require('@/assets/images/thumbnail/beach-thumbnail.jpeg')
    }
}