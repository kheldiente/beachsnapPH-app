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

export const mockData: BeachList = {
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
    ]
}

export const getThumbnail = (regionKey) => {
    // Note: require() doesn't work with dynamic values. 
    // Hence, we're using static strings here
    // console.log(`getThumbnail: ${regionKey}`)
    switch (regionKey) {
        case "REG1":
            return require('@/assets/images/thumbnail/bicol-thumbnail.jpeg')
        case "REG2":
            return require('@/assets/images/thumbnail/cagayan-valley-thumbnail.jpeg')
        case 'REG3':
            return require('@/assets/images/thumbnail/caraga-thumbnail.jpeg')
        case 'REG4':
            return require('@/assets/images/thumbnail/central-luzon-thumbnail.jpeg')
        case 'REG5':
            return require('@/assets/images/thumbnail/soccsksargen-thumbnail.jpeg')
        case 'REG6':
            return require('@/assets/images/thumbnail/central-visayas-thumbnail.jpeg')
        case 'REG7':
            return require('@/assets/images/thumbnail/davao-thumbnail.jpeg')
        case 'REG8':
            return require('@/assets/images/thumbnail/eastern-visayas-thumbnail.jpeg')
        case 'REG9':
            return require('@/assets/images/thumbnail/ilocos-thumbnail.jpeg')
        case 'REG10':
            return require('@/assets/images/thumbnail/barmm-thumbnail.jpeg')
        case 'REG11':
            return require('@/assets/images/thumbnail/ncr-thumbnail.jpeg')
        case 'REG12':
            return require('@/assets/images/thumbnail/negros-island-thumbnail.jpeg')
        case 'REG13':
            return require('@/assets/images/thumbnail/northern-mindanao-thumbnail.jpeg')
        case 'REG14':
            return require('@/assets/images/thumbnail/mimaropa-thumbnail.jpeg')
        case 'REG15':
            return require('@/assets/images/thumbnail/calabarzon-thumbnail.jpeg')
        case 'REG16':
            return require('@/assets/images/thumbnail/western-visayas-thumbnail.jpeg')
        case 'REG17':
            return require('@/assets/images/thumbnail/zamboanga-peninsula-thumbnail.jpeg')
        default:
            return require('@/assets/images/thumbnail/beach-emoji-hd.png')
    }
}