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

// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
const socket = new ReconnectingWebSocket("ws://" + location.host + "/ws")
socket.onopen = () => { console.log("Successfully Connected") }
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!") }
socket.onerror = error => { console.log("Socket Error: ", error) }

// Team Information
const redTeamSectionFlagEl = document.getElementById("redTeamSectionFlag")
const redTeamNameEl = document.getElementById("redTeamName")
const blueTeamSectionFlagEl = document.getElementById("blueTeamSectionFlag")
const blueTeamNameEl = document.getElementById("blueTeamName")
let currentRedTeamName, currentBlueTeamName

socket.onmessage = async (event) => {
    const data = JSON.parse(event.data)

    // Team Name
    if (currentRedTeamName !== data.tourney.manager.teamName.left) {
        currentRedTeamName = data.tourney.manager.teamName.left
        redTeamNameEl.innerText = currentRedTeamName
        redTeamSectionFlagEl.setAttribute("src", `../flags/${currentRedTeamName}.png`)
    }
    if (currentBlueTeamName !== data.tourney.manager.teamName.right) {
        currentBlueTeamName = data.tourney.manager.teamName.right
        blueTeamNameEl.innerText = currentBlueTeamName
        blueTeamSectionFlagEl.setAttribute("src", `../flags/${currentBlueTeamName}.png`)
    }
}