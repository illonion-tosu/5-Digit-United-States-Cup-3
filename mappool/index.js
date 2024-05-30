// Import mappool
const roundNametEl = document.getElementById("roundName")
let numberOfBans
let numberOfPicks
let allBeatmaps

// Bans
const redTeamBanContainerEl = document.getElementById("redTeamBanContainer")
const blueTeamBanContainerEl = document.getElementById("blueTeamBanContainer")

async function getMappool() {
    const response = await fetch("http://127.0.0.1:24050/5DUSC3/_data/beatmaps.json")
    const mappool = await response.json()
    allBeatmaps = mappool.beatmaps
    roundNametEl.innerText = mappool.roundName.toUpperCase()

    // Set number of bans and number of picks
    switch (mappool.roundName.toUpperCase()) {
        case "ROUND OF 32": case "ROUND OF 16":
            numberOfBans = 1
            numberOfPicks = 6
            break
        case "QUARTERFINALS": case "SEMIFINALS":
            numberOfBans = 2
            numberOfPicks = 6
            break
        case "FINALS": case "GRAND FINALS":
            numberOfBans = 2
            numberOfPicks = 7
    }
    
    // Reset bans
    redTeamBanContainerEl.innerHTML = ""
    blueTeamBanContainerEl.innerHTML = ""

    // Create ban elements
    function createBanElements(index, teamBanSize) {
        const teamBan = document.createElement("div")
        teamBan.classList.add("teamBan", teamBanSize)

        const teamBanImage = document.createElement("div")
        teamBanImage.classList.add("teamBanImage")

        const teamBanLayer = document.createElement("div")
        teamBanLayer.classList.add("teamBanImage")

        const bannedIcon = document.createElement("bannedIcon")
        bannedIcon.classList.add("bannedIcon")
        bannedIcon.setAttribute("src", "static/banned.png")

        const teamBanText = document.createElement("div")
        teamBanText.classList.add("teamBanText")

        // Set correct container
        let currentContainer
        if (index % 2 === 0) currentContainer = redTeamBanContainerEl
        else currentContainer = blueTeamBanContainerEl

        // Append everything
        teamBan.append(teamBanImage, teamBanLayer, bannedIcon, teamBanText)
        currentContainer.append(teamBan)
    }

    // Add ban elements
    let teamBanSize
    if (numberOfBans === 1) teamBanSize = "oneTeamBan"
    else teamBanSize = "multipleTeamBan"
    for (let i = 0; i < numberOfBans * 2; i++) createBanElements(i, teamBanSize)
}

// Star positions
const sevenStars = [
    {left: "370px", top: "66px"},
    {left: "420px", top: "45px"},
    {left: "472px", top: "66px"},
    {left: "370px", top: "174px"},
    {left: "420px", top: "193px"},
    {left: "472px", top: "174px"},
    {left: "408px", top: "111px"}
]
const sixStars = [
    {left: "381px", top: "67px"},
    {left: "360px", top: "130px"},
    {left: "418px", top: "176px"},
    {left: "475px", top: "130px"},
    {left: "450px", top: "67px"},
    {left: "408px", top: "111px"},
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
            createStar.classList.add((i === currentFirstTo - 1)? "largeStar" : "smallStar")
            createStar.style.left = starPositions[i].left
            createStar.style.top = starPositions[i].top
            createStar.setAttribute("src", `../_shared/stars/${starImage}.png`)
            starContainer.append(createStar)
        }

        let i = 0
        for (i; i < currentRedStars; i++) {
            createStar(i, "red_star", redTeamStarContainerEl)
        }
        for (i; i < currentFirstTo; i++) {
            createStar(i, "white_star", redTeamStarContainerEl)
        }

        i = 0
        for (i; i < currentBlueStars; i++) {
            createStar(i, "blue_star", blueTeamStarContainerEl)
        }
        for (i; i < currentFirstTo; i++) {
            createStar(i, "white_star", blueTeamStarContainerEl)
        }
    }
}