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

// Star positions
const sevenStars = [
    {left: "408px", top: "111px"},
    {left: "472px", top: "174px"},
    {left: "420px", top: "193px"},
    {left: "370px", top: "174px"},
    {left: "472px", top: "66px"},
    {left: "420px", top: "45px"},
    {left: "370px", top: "66px"},
]
const sixStars = [
    {left: "408px", top: "111px"},
    {left: "450px", top: "67px"},
    {left: "475px", top: "130px"},
    {left: "418px", top: "176px"},
    {left: "360px", top: "130px"},
    {left: "381px", top: "67px"},
]

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

// Stars
const redTeamStarContainerEl = document.getElementById("redTeamStarContainer")
const blueTeamStarContainerEl = document.getElementById("blueTeamStarContainer")
let currentBestOf, currentFirstTo, currentRedStars, currentBlueStars

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

    // Stars
    if (currentBestOf !== data.tourney.manager.bestOF ||
        currentRedStars !== data.tourney.manager.stars.left ||
        currentBlueStars !== data.tourney.manager.stars.right) {
        
        // Set details
        currentBestOf = data.tourney.manager.bestOF
        currentFirstTo = Math.ceil(currentBestOf / 2)
        currentRedStars = data.tourney.manager.stars.left
        currentBlueStars = data.tourney.manager.stars.right

        // Reset stars
        redTeamStarContainerEl.innerHTML = ""
        blueTeamStarContainerEl.innerHTML = ""

        let starPositions
        switch (currentFirstTo) {
            case 6: starPositions = sixStars; break;
            case 7: starPositions = sevenStars; break;
        }

        function createStar(i, starImage, starContainer) {
            const createStar = document.createElement("img")
            createStar.classList.add((i === 0)? "largeStar" : "smallStar")
            createStar.style.left = starPositions[i].left
            createStar.style.top = starPositions[i].top
            createStar.setAttribute("src", `../_shared/stars/${starImage}.png`)
            starContainer.append(createStar)
        }

        let i = 0
        for (i; i < currentRedStars; i++) {
            createStar(i, "white_star", redTeamStarContainerEl)
        }
        for (i; i < currentFirstTo; i++) {
            createStar(i, "red_star", redTeamStarContainerEl)
        }

        i = 0
        for (i; i < currentBlueStars; i++) {
            createStar(i, "white_star", blueTeamStarContainerEl)
        }
        for (i; i < currentFirstTo; i++) {
            createStar(i, "blue_star", blueTeamStarContainerEl)
        }
    }
}