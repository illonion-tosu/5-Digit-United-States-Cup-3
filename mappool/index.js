// Import mappool
const roundNametEl = document.getElementById("roundName")
let numberOfBans
let numberOfPicks
let allBeatmaps

// Ban Containers
const redTeamBanContainerEl = document.getElementById("redTeamBanContainer")
const blueTeamBanContainerEl = document.getElementById("blueTeamBanContainer")
// Pick Containers
const redPickSectionEl = document.getElementById("redPickSection")
const bluePickSectionEl = document.getElementById("bluePickSection")
// Mappool bar chart buttons
const mappoolSectionButtonsEl = document.getElementById("mappoolSectionButtons")

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
            numberOfPicks = 7
            break
        case "FINALS": case "GRAND FINALS":
            numberOfBans = 2
            numberOfPicks = 8
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

    // Reset pick containers
    redPickSectionEl.innerHTML = ""
    bluePickSectionEl.innerHTML = ""
    
    // Add pick containers
    for (let i = 0; i < numberOfPicks * 2; i++) {
        const pickContainer = document.createElement("div")
        pickContainer.classList.add("pickContainer")

        const pickContainerBackgroundImage = document.createElement("div")
        pickContainerBackgroundImage.classList.add("pickContainerBackgroundImage")

        const pickContainerWinner = document.createElement("div")
        pickContainerWinner.classList.add("pickContainerWinner")

        const pickContainerGradient = document.createElement("div")
        pickContainerGradient.classList.add("pickContainerGradient")

        const pickContainerBottom = document.createElement("div")
        pickContainerBottom.classList.add("pickContainerBottom")

        const pickContainerCrown = document.createElement("div")
        pickContainerCrown.classList.add("pickContainerCrown")

        const pickContainerText = document.createElement("div")
        pickContainerText.classList.add("pickContainerText")

        pickContainer.append(pickContainerBackgroundImage, pickContainerWinner,
            pickContainerGradient, pickContainerBottom, pickContainerCrown, pickContainerText) 
            
        if (i % 2 === 0) redPickSectionEl.append(pickContainer)
        else bluePickSectionEl.append(pickContainer)
    }

    // Add mappool side bar elements
    for (let i = 0; i < allBeatmaps.length; i++) {
        if (Object.keys(allBeatmaps[i]).length === 0) continue
        const mappoolSideBarButton = document.createElement("button")
        mappoolSideBarButton.classList.add("sideBarButton")
        mappoolSideBarButton.innerText = `${allBeatmaps[i].mod}${allBeatmaps[i].order}`
        mappoolSectionButtonsEl.append(mappoolSideBarButton)
    }
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

// Chat Display
const chatDisplayEl = document.getElementById("chatDisplay")
let chatLength = 0

// Map Information Left Container
const mapInformationLeftContainerEl = document.getElementById("mapInformationLeftContainer")

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

// Logos
const logoMajorEl = document.getElementById("logoMajor")
const logoMinorEl = document.getElementById("logoMinor")

// Tournament Selection
const backgroundVideoMajorLeagueEl = document.getElementById("backgroundVideoMajorLeague")
const tournamentSelectionEl = document.getElementById("tournamentSelection")
let tournamentSelectionLeague = "minor"

function tournamentSelection(league) {
    document.cookie = `tournamentSelection=${league}; path=/`

    if (league === "major") {
        // Text on sidebar
        tournamentSelectionEl.innerText = "Major League"
        tournamentSelectionLeague = "major"

        // Video
        backgroundVideoMajorLeagueEl.style.opacity = 1

        // Logos
        logoMajorEl.style.opacity = 1
        logoMinorEl.style.opacity = 0

        // Round Name
        roundNametEl.classList.add("roundNameMajor")
        roundNametEl.classList.remove("roundNameMinor")

        // Chat Display
        chatDisplayEl.classList.add("chatDisplayMajor")
        chatDisplayEl.classList.remove("chatDisplayMinor")
        // Chat Message Containers
        const chatMessageContainerElements = document.getElementsByClassName("chatMessageContainer")
        for (let i = 0; i < chatMessageContainerElements.length; i++) {
            chatMessageContainerElements[i].classList.add("chatMessageContainerMajor")
            chatMessageContainerElements[i].classList.remove("chatMessageContainerMinor")
        }
        // Chat Message Time
        const chatMessageTimeElements = document.getElementsByClassName("chatMessageTime")
        for (let i = 0; i < chatMessageTimeElements.length; i++) {
            chatMessageTimeElements[i].classList.add("chatMessageTimeMajor")
            chatMessageTimeElements[i].classList.remove("chatMessageTimeMinor")
        }

        // Left Container
        mapInformationLeftContainerEl.classList.add("mapInformationLeftContainerMajor")
        mapInformationLeftContainerEl.classList.remove("mapInformationLeftContainerMinor")
    } else if (league === "minor") {
        // Text on sidebar
        tournamentSelectionEl.innerText = "Minor League"
        tournamentSelectionLeague = "minor"

        // Video
        backgroundVideoMajorLeagueEl.style.opacity = 0

        // Logos
        logoMajorEl.style.opacity = 0
        logoMinorEl.style.opacity = 1

        // Round Name
        roundNametEl.classList.remove("roundNameMajor")
        roundNametEl.classList.add("roundNameMinor")

        // Chat Display
        chatDisplayEl.classList.remove("chatDisplayMajor")
        chatDisplayEl.classList.add("chatDisplayMinor")
        // Chat Message Containers
        const chatMessageContainerElements = document.getElementsByClassName("chatMessageContainer")
        for (let i = 0; i < chatMessageContainerElements.length; i++) {
            chatMessageContainerElements[i].classList.remove("chatMessageContainerMajor")
            chatMessageContainerElements[i].classList.add("chatMessageContainerMinor")
        }
        // Chat Message times
        const chatMessageTimeElements = document.getElementsByClassName("chatMessageTime")
        for (let i = 0; i < chatMessageTimeElements.length; i++) {
            chatMessageTimeElements[i].classList.remove("chatMessageTimeMajor")
            chatMessageTimeElements[i].classList.add("chatMessageTimeMinor")
        }

        // Left Container
        mapInformationLeftContainerEl.classList.remove("mapInformationLeftContainerMajor")
        mapInformationLeftContainerEl.classList.add("mapInformationLeftContainerMinor")
    }
}

// Next Action
const nextActionTextEl = document.getElementById("nextActionText")
const setNextAction = (team, action) => nextActionTextEl.innerText = `${team} ${action}`

// Map Click
function mapClickEvent() {

}