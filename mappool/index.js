// Import mappool
const roundNametEl = document.getElementById("roundName")
let allBeatmaps
async function getMappool() {
    const response = await fetch("http://127.0.0.1:24050/5DUSC3/_data/beatmaps.json")
    const mappool = await response.json()
    console.log(mappool)
    allBeatmaps = mappool.beatmaps
    roundNametEl.innerText = mappool.roundName.toUpperCase()
}

getMappool()

// Find mappool map
const findMapInMappool = (beatmapID) => allBeatmaps.find(beatmap => beatmap.beatmapID == beatmapID) || null