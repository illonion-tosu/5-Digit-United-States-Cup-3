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
// Pick Container Lengths
const pickContainerWidths = ["174.19px", "146.16px", "126.89px"]
const minimumNumberOfPicks = 6
// Tiebreaker pick container
const tiebreakerPickContainerEl = document.getElementById("tiebreakerPickContainer")

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
        teamBanLayer.classList.add("teamBanLayer")

        const bannedIcon = document.createElement("img")
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

    // Set pick container width
    const pickContainerWidth = pickContainerWidths[numberOfPicks - minimumNumberOfPicks]
    
    // Add pick containers
    for (let i = 0; i < numberOfPicks * 2 - 2; i++) {
        const pickContainer = document.createElement("div")
        pickContainer.classList.add("pickContainer")
        pickContainer.style.width = pickContainerWidth

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

    // Set width and left of tiebreaker
    tiebreakerPickContainerEl.style.width = pickContainerWidth
    let redPickSectionLeft = window.getComputedStyle(redPickSectionEl).left
    redPickSectionLeft = redPickSectionLeft.substring(0, redPickSectionLeft.length - 2)
    tiebreakerPickContainerEl.style.left = `${parseInt(redPickSectionLeft) + redPickSectionEl.getBoundingClientRect().width + 15}px`

    // Add mappool side bar elements
    for (let i = 0; i < allBeatmaps.length; i++) {
        if (Object.keys(allBeatmaps[i]).length === 0) continue
        const mappoolSideBarButton = document.createElement("button")
        mappoolSideBarButton.classList.add("sideBarButton")
        mappoolSideBarButton.innerText = `${allBeatmaps[i].mod}${allBeatmaps[i].order}`
        mappoolSideBarButton.dataset.id = allBeatmaps[i].beatmapID
        mappoolSideBarButton.addEventListener("click", mapClickEvent)
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

// Song Progress Circle
const mapInformationSongProgressCircleEl = document.getElementById("mapInformationSongProgressCircle")

// IPC State 
let currentIPCState

// Current map information
// Left container
const mapInformationLeftContainerMapBackgroundEl = document.getElementById("mapInformationLeftContainerMapBackground")
const mapInformationLeftContainerMapperImageEl = document.getElementById("mapInformationLeftContainerMapperImage")
// Right container - Artist / Song Name / Difficulty / Mapper
const mapInformationRightSongNameDifficultyEl = document.getElementById("mapInformationRightSongNameDifficulty")
const mapInformationRightArtistEl = document.getElementById("mapInformationRightArtist")
const mapInformationRightMappedByNameEl = document.getElementById("mapInformationRightMappedByName")
// Right container - stats
const mapInformationRightSREl = document.getElementById("mapInformationRightSR")
const mapInformationRightBPMEl = document.getElementById("mapInformationRightBPM")
const mapInformationRightCSEl = document.getElementById("mapInformationRightCS")
const mapInformationRightAREl = document.getElementById("mapInformationRightAR")
const mapInformationRightODEl = document.getElementById("mapInformationRightOD")
let currentId, currentMd5
let foundMapInMappool = false

// Has map been picked yet
let mapPicked = false

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

    if (chatLength !== data.tourney.manager.chat.length) {
        // Chat stuff
        // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
        (chatLength === 0 || chatLength > data.tourney.manager.chat.length) ? (chatDisplayEl.innerHTML = "", chatLength = 0) : null;
        const fragment = document.createDocumentFragment()

        for (let i = chatLength; i < data.tourney.manager.chat.length; i++) {
            const chatColour = data.tourney.manager.chat[i].team

            // Chat message container
            const chatMessageContainer = document.createElement("div")
            chatMessageContainer.classList.add("chatMessageContainer", (tournamentSelectionLeague === "minor")? "chatMessageContainerMinor": "ChatMessageContainerMajor")

            // Time
            const chatMessageTime = document.createElement("div")
            chatMessageTime.classList.add("chatMessageTime", (tournamentSelectionLeague === "minor")? "chatMessageTimeMinor": "chatMessageTimeMajor")
            chatMessageTime.innerText = data.tourney.manager.chat[i].time

            // Whole Message
            const chatMessageContent = document.createElement("div")
            chatMessageContent.classList.add("chatMessageContent")  
            
            // Name
            const chatMessageName = document.createElement("div")
            chatMessageName.classList.add(chatColour, "chatMessageUser")
            chatMessageName.innerText = data.tourney.manager.chat[i].name + ": "

            // Message
            const chatMessageText = document.createElement("div")
            chatMessageText.classList.add("chatMessageText")
            chatMessageText.innerText = data.tourney.manager.chat[i].messageBody

            chatMessageContent.append(chatMessageName, chatMessageText)
            chatMessageContainer.append(chatMessageTime, chatMessageContent)
            fragment.append(chatMessageContainer)
        }

        chatDisplayEl.append(fragment)
        chatLength = data.tourney.manager.chat.length
        chatDisplayEl.scrollTo({
            top: chatDisplayEl.scrollHeight,
            behavior: 'smooth'
        })
    }

    // Beatmap changes
    if ((currentId !== data.menu.bm.id || currentMd5 !== data.menu.bm.md5) && allBeatmaps) {
        currentId = data.menu.bm.id
        currentMd5 = data.menu.bm.md5
        foundMapInMappool = false

        // Left side changes - Background Image and Mapper Profile Picture
        mapInformationLeftContainerMapBackgroundEl.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover.jpg")`
        fetch(`https://osu.ppy.sh/api/get_user?k=0501452af051a7c75928ab9775d5381bd4745a08&u=${data.menu.bm.metadata.mapper}`)
            .then(response => response.json())
            .then(data => {
                let userData = data[0];
                mapInformationLeftContainerMapperImageEl.style.backgroundImage = `url("https://a.ppy.sh/${userData.user_id}")`;
            })
            .catch(error => console.error('Error fetching user data:', error));

        // Right hand side - Artist / Title / Difficulty / Mapper
        mapInformationRightSongNameDifficultyEl.innerText = `${data.menu.bm.metadata.title} [${data.menu.bm.metadata.difficulty}]`
        mapInformationRightArtistEl.innerText = `${data.menu.bm.metadata.artist}`
        mapInformationRightMappedByNameEl.innerText = data.menu.bm.metadata.mapper
        addRemoveTextWrap(mapInformationRightSongNameDifficultyEl)
        addRemoveTextWrap(mapInformationRightArtistEl)

        // Right hand side - backgrounds
        for (const stylesheet of document.styleSheets) {
            try {
                for (const rule of stylesheet.cssRules || stylesheet.rules) {
                    if (rule.selectorText && rule.selectorText.includes('.mapInformationRightContainers::before')) {
                        rule.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover.jpg")`
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }

        // Put in correct stats for mappool map
        const currentMapDetails = findMapInMappool(currentId)
        if (currentMapDetails) {
            foundMapInMappool = true
            mapInformationRightSREl.innerText = `SR: ${Math.round(parseFloat(currentMapDetails.difficultyrating) * 100) / 100}`
            mapInformationRightCSEl.innerText = `CS: ${Math.round(parseFloat(currentMapDetails.cs) * 10) / 10}`
            mapInformationRightAREl.innerText = `AR: ${Math.round(parseFloat(currentMapDetails.ar) * 10) / 10}`
            mapInformationRightODEl.innerText = `OD: ${Math.round(parseFloat(currentMapDetails.od) * 10) / 10}`
            mapInformationRightBPMEl.innerText = `BPM: ${Math.round(parseFloat(currentMapDetails.bpm) * 10) / 10}`

            if (!mapPicked && nextAction === "Pick" && nextActionTeam) {
                // Find correct button
                const buttons = document.querySelectorAll("[data-id]")
                let currentButton
                buttons.forEach(button => {
                    if (button.dataset.id == currentId && !button.dataset.action) {
                        currentButton = button
                        return
                    }
                })
                
                if (currentButton) {
                    currentButton.click()
                    mapPicked = true
                    currentlyPickingEl.style.display = "none"
                }
            }
        }
    }

    // Mappool stats
    if (!foundMapInMappool && allBeatmaps) {
        mapInformationRightSREl.innerText = `SR: ${data.menu.bm.stats.fullSR}`
        mapInformationRightCSEl.innerText = `CS: ${data.menu.bm.stats.CS}`
        mapInformationRightAREl.innerText = `AR: ${data.menu.bm.stats.AR}`
        mapInformationRightODEl.innerText = `OD: ${data.menu.bm.stats.OD}`
        if (data.menu.bm.stats.BPM.min === data.menu.bm.stats.BPM.max) {
            mapInformationRightBPMEl.innerText = `BPM: ${data.menu.bm.stats.BPM.min}`
        } else {
            mapInformationRightBPMEl.innerText = `BPM: ${data.menu.bm.stats.BPM.min}-${data.menu.bm.stats.BPM.max} (${data.menu.bm.stats.BPM.common})`
        }
    }

    // IPC State
    if (currentIPCState !== data.tourney.manager.ipcState) {
        currentIPCState = data.tourney.manager.ipcState
        if (currentIPCState === 4) {
            mapPicked = false
            currentlyPickingEl.style.display = "block"
        }
    }

    // Gameplay Song Progress Circle
    if (currentIPCState === 2 || currentIPCState === 3) {
        if (data.menu.bm.time.firstObj > data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "0%"
        } else if (data.menu.bm.time.full < data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "95%"
        } else if (data.menu.bm.time.firstObj <= data.menu.bm.time.current &&
            data.menu.bm.time.full >= data.menu.bm.time.current) {
            const timeDifference = data.menu.bm.time.full - data.menu.bm.time.firstObj
            const currentTime = data.menu.bm.time.current - data.menu.bm.time.firstObj
            const currentTimeDeltaPercentage = currentTime / timeDifference * 95
            mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
        }
    } else {
        const currentTimeDeltaPercentage = data.menu.bm.time.current / data.menu.bm.time.mp3 * 95
        mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
    }
}

// Add / Remove Wrap
function addRemoveTextWrap(element) {
    if (element.getBoundingClientRect().width > 372) element.classList.add("mapInformationRightWrap")
    else element.classList.remove("mapInformationRightWrap")
}

// Map Information Right Container Transitions
const mapInformationRightSongNameDifficultyWrapperEl = document.getElementById("mapInformationRightSongNameDifficultyWrapper")
const mapInformationRightMappedByTextEl = document.getElementById("mapInformationRightMappedByText")
const mapInformationRightSRandBPMEl = document.getElementById("mapInformationRightSRandBPM")
const mapInformationRightArtistWrapperEl = document.getElementById("mapInformationRightArtistWrapper")
const mapInformationRightCSandARandODEl = document.getElementById("mapInformationRightCSandARandOD")
const mapInformationLeftContainerEl = document.getElementById("mapInformationLeftContainer")
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
// Move Elements
async function moveElements(moveOutElement1, moveOutElement2, moveInElement1, moveInElement2, stationaryElement1, stationaryElement2) {
    // Reset stationary and moveIn elements opacity to make sure they can get to the right position
    stationaryElement1.style.opacity = 0
    stationaryElement2.style.opacity = 0
    moveInElement1.style.opacity = 0
    moveInElement2.style.opacity = 0
    await sleep(750)
    // Move stationary and moveIn elements to the right position
    stationaryElement1.style.top = "-22.5px"
    stationaryElement2.style.top = "-22.5px"
    moveInElement1.style.top = "22.5px"
    moveInElement2.style.top = "22.5px"
    await sleep(750)
    // Move in elemnts opacity = 1
    moveInElement1.style.opacity = 1
    moveInElement2.style.opacity = 1
    await sleep(750)
    // Move correct elements
    moveOutElement1.style.top = "-22.5px"
    moveOutElement2.style.top = "-22.5px"
    moveInElement1.style.top = "0px"
    moveInElement2.style.top = "0px"
    // Left container
    if (moveInElement1 === mapInformationRightMappedByTextEl || moveInElement2 === mapInformationRightMappedByTextEl) {
        mapInformationLeftContainerEl.style.width = "102px"
        mapInformationLeftContainerMapperImageEl.style.opacity = 1
    } else {
        mapInformationLeftContainerEl.style.width = "170px"
        mapInformationLeftContainerMapperImageEl.style.opacity = 0
    }
}
let animationCounter = 0
setInterval(() => {
    animationCounter++
    if (animationCounter % 3 === 1) {
        moveElements(mapInformationRightSongNameDifficultyWrapperEl, mapInformationRightArtistWrapperEl,
            mapInformationRightMappedByTextEl,mapInformationRightMappedByNameEl,
            mapInformationRightSRandBPMEl,mapInformationRightCSandARandODEl)    
    } else if (animationCounter % 3 === 2) {
        moveElements(mapInformationRightMappedByTextEl, mapInformationRightMappedByNameEl,
            mapInformationRightSRandBPMEl, mapInformationRightCSandARandODEl,
            mapInformationRightSongNameDifficultyWrapperEl, mapInformationRightArtistWrapperEl)
    } else if (animationCounter % 3 === 0) {
        moveElements(mapInformationRightSRandBPMEl, mapInformationRightCSandARandODEl,
            mapInformationRightSongNameDifficultyWrapperEl, mapInformationRightArtistWrapperEl,
            mapInformationRightMappedByTextEl, mapInformationRightMappedByNameEl)
    }
}, 12000)

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
const currentlyPickingEl = document.getElementById("currentlyPicking")
let nextActionTeam
let nextAction
const setNextAction = (team, action) => {
    nextActionTextEl.innerText = `${team} ${action}`
    nextActionTeam = team
    nextAction = action
    if (action === "Pick" && !mapPicked) {
        currentlyPickingEl.style.display = "block"
        currentlyPickingEl.innerText = `${team.toUpperCase()} IS CURRENTLY PICKING...`
        currentlyPickingEl.classList.add(`${team.toLowerCase()}TeamColor`)
        if (team === "Red") currentlyPickingEl.classList.remove("blueTeamColor")
        else currentlyPickingEl.classList.remove("redTeamColor")
    } else if (action === "Ban") {
        currentlyPickingEl.style.display = "none"
    }
}

// Map Click
function mapClickEvent() {
    // Get current ID
    let currentId = this.dataset.id
    // Find map information
    const currentMap = findMapInMappool(currentId)
    if (!currentMap) return
    // Check if the actions extist
    if (!nextAction || !nextActionTeam) return

    // Check if map has been banned or picked before
    const elements = document.querySelectorAll("[data-id]")
    let mapFound = false
    elements.forEach(element => {
        if (element.dataset.id === currentId && (element.dataset.action === "Ban" || element.dataset.action === "Pick")) {
            mapFound = true
            return
        }
    })
    if (mapFound) return

    // Bans
    if (nextAction === "Ban") {
        // Cannot ban TB
        if (currentMap.mod === "TB") return

        // Set current tile
        let currentContainer = (nextActionTeam === "Red") ? redTeamBanContainerEl : blueTeamBanContainerEl
        let currentTile = currentContainer.children[0]
        if (currentContainer.childElementCount > 1 && 
            currentContainer.dataset.id &&
            currentContainer.dataset.action) {
                currentTile = currentContainer.children[1]
            }
    
        // Get potential previous pick's information
        let previousTileId
        if (currentTile.hasAttribute("id")) {
            previousTileId = currentTile.id
            previousTileId = previousTileId.split("-")[0]
        }
        
        // Set information for that tile
        currentTile.dataset.id = currentId
        currentTile.dataset.action = "Ban"
        currentTile.children[0].style.backgroundImage = `url("${currentMap.imgURL}")`
        currentTile.children[0].style.opacity = 1
        currentTile.children[2].style.display = "block"
        currentTile.children[3].innerText = `${currentMap.mod}${(checkNumberOfModsInModpoolIsOne(currentMap.mod))? "" : currentMap.order}`

        // Set background colour for current button
        this.setAttribute("class", "banColourBackground sideBarButton")
        this.style.color = "black"

        // Remove background colour for previous button
        let previousTile = document.getElementById(previousTileId)
        if (document.contains(previousTile)) {
            previousTile.classList.remove("banColourBackground")
            previousTile.style.color = "white"
        }
    }

    // Picks
    if (nextAction === "Pick") {
        // Set current tile container
        let currentContainer = (nextActionTeam === "Red") ? redPickSectionEl : bluePickSectionEl
        
        // Find correct tile
        let currentTile

        // Check if mod is tb first
        if (currentMap.mod === "TB") currentTile = tiebreakerPickContainerEl
        // Go through all the tiles if the current map is not tb
        if (!currentTile) {
            for (let i = 0; i < currentContainer.childElementCount; i++) {
                if (currentContainer.children[i].dataset.id) continue
                currentTile = currentContainer.children[i]
                break
            }
        }

        if (!currentTile) return

        // Set information on tile
        currentTile.dataset.id = currentId
        currentTile.dataset.action = "Pick"
        currentTile.children[0].style.backgroundImage = `url("${currentMap.imgURL}")`
        currentTile.children[0].style.opacity = 1
        currentTile.children[3].classList.add("pickContainerBottomNone")
        currentTile.children[5].innerText = `${currentMap.mod}${(checkNumberOfModsInModpoolIsOne(currentMap.mod))? "" : currentMap.order}`

        // Set colour of text on current tile
        getAverageColor(currentMap.imgURL, function(brightness) {
            if (brightness > 140) currentTile.children[5].style.color = "black"
            else currentTile.children[5].style.color = "white"
        })

        // Set background colour for current button
        this.style.color = "black"
        this.style.backgroundColor = "lightgreen"

        // Reset some elements
        mapPicked = true
        currentlyPickingEl.style.display = "none"
    }

    // Switch teams for next action
    if (nextActionTeam === "Red") nextActionTeam = "Blue"
    else if (nextActionTeam === "Blue") nextActionTeam = "Red"
    nextActionTextEl.innerText = `${nextActionTeam} ${nextAction}`
}

// Get average background color
function getAverageColor(imageUrl, callback) {
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl

    img.onload = function() {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var width = canvas.width = img.width
        var height = canvas.height = img.height

        context.drawImage(img, 0, 0, width, height)
        var imageData = context.getImageData(0, 0, width, height)
        var data = imageData.data

        var r = 0, g = 0, b = 0

        for (var i = 0; i < data.length; i += 4) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
        }

        var pixelCount = data.length / 4
        r = Math.floor(r / pixelCount)
        g = Math.floor(g / pixelCount)
        b = Math.floor(b / pixelCount)

        var brightness = (r + g + b) / 3
        callback(brightness)
    }
}

// Check number of mods in particular modpool
const checkNumberOfModsInModpoolIsOne = mod => allBeatmaps.filter(beatmap => beatmap.mod === mod).length === 1

const pickBanManagementSelectEl = document.getElementById("pickBanManagementSelect")
const sideBarColumn2El = document.getElementById("sideBarColumn2")
let selectedPickManagementOption
pickBanManagementSelectEl.addEventListener('change', function()  {
    selectedPickManagementOption = this.value
    while (sideBarColumn2El.childElementCount > 2) sideBarColumn2El.lastChild.remove()
    
    // Set Ban
    if (selectedPickManagementOption === "setBan") {
        // Create title
        const banTitle = document.createElement("h1")
        banTitle.innerText = "Whose ban?"
        sideBarColumn2El.append(banTitle)
        
        // Create select
        const select = document.createElement("select")
        select.classList.add("pickBanManagementSelect")
        select.setAttribute("id", "pickBanManagementBanSelect")
        sideBarColumn2El.append(select)

        // Create options
        for (let i = 0; i < redTeamBanContainerEl.childElementCount; i++) {
            const optionRed = document.createElement("option")
            optionRed.value = `red_ban_${i}`
            optionRed.innerText = `Red Ban ${i + 1}`
            select.append(optionRed)

            const optionBlue = document.createElement("option")
            optionBlue.value = `blue_ban_${i}`
            optionBlue.innerText = `Blue Ban ${i + 1}`
            select.append(optionBlue)
        }
        select.setAttribute("size", select.childElementCount)

        // Create mappool title
        const mappoolTitle = document.createElement("h1")
        mappoolTitle.innerText = "Which map?"
        sideBarColumn2El.append(mappoolTitle)

        // Create mappool button section
        const pickManagementMappool = document.createElement("div")
        pickManagementMappool.classList.add("pickManagementMappool")

        // Create mappool buttons
        for (let i = 0 ; i < allBeatmaps.length - 1; i++) {
            const button = document.createElement("button")
            button.addEventListener("click", pickManagementSelectMap)
            button.classList.add("pickManagementMappoolButton")
            button.innerText = `${allBeatmaps[i].mod}${allBeatmaps[i].order}`
            button.dataset.id = allBeatmaps[i].beatmapID
            pickManagementMappool.append(button)
        }
        sideBarColumn2El.append(pickManagementMappool)

        // Apply changes button
        const applyChangesButton = document.createElement("button")
        applyChangesButton.innerText = "Apply Changes"
        applyChangesButton.classList.add("sideBarButton")
        applyChangesButton.style.width = "200px"
        applyChangesButton.style.marginLeft = "10%"
        applyChangesButton.addEventListener("click", applyChangesSetBan)
        sideBarColumn2El.append(applyChangesButton)
    }
})

const pickManagementMappoolButtonEls = document.getElementsByClassName("pickManagementMappoolButton")
let pickManagementSelectedMap
// Pick the current map
function pickManagementSelectMap() {
    // Set current map
    pickManagementSelectedMap = this.dataset.id

    // Set colour
    for (let i = 0; i < pickManagementMappoolButtonEls.length; i++) {
        pickManagementMappoolButtonEls[i].style.backgroundColor = "transparent"
        pickManagementMappoolButtonEls[i].style.color = "white"
    }
    this.style.backgroundColor = "rgb(206,206,206)"
    this.style.color = "black"
}

function applyChangesSetBan() {
    const pickBanManagementBanSelectElValue = document.getElementById("pickBanManagementBanSelect").value
    const pickBanManagementBanSelectElValueSplit = pickBanManagementBanSelectElValue.split("_")
    const pickBanManagementBanColour = pickBanManagementBanSelectElValueSplit[0]
    const pickBanManagementBanNumber = pickBanManagementBanSelectElValueSplit[2]

    // Get current element we are replacing
    let currentBanContainer
    if (pickBanManagementBanColour === "red") currentBanContainer = redTeamBanContainerEl.children[parseInt(pickBanManagementBanNumber)]
    else currentBanContainer = blueTeamBanContainerEl.children[parseInt(pickBanManagementBanNumber)]

    // Save current element information we are replacing
    let previousBanId = currentBanContainer.dataset.id
    if (previousBanId) {
        // Remove current element ban button colour if it is a ban colour only
        mappoolSectionButtonsEl.querySelectorAll("[data-id]")
        let previousButton = mappoolSectionButtonsEl.querySelector(`[data-id="${previousBanId}"]`)
        previousButton.classList.remove("banColourBackground")
        previousButton.style.color = "white"
    }

    // Find current map details
    const currentMap = findMapInMappool(pickManagementSelectedMap)
    console.log(currentMap)
    console.log(currentBanContainer)
    
    // Set new element
    currentBanContainer.dataset.id = pickManagementSelectedMap
    currentBanContainer.dataset.action = "Ban"
    currentBanContainer.children[0].style.backgroundImage = `url("${currentMap.imgURL}")`
    currentBanContainer.children[0].style.opacity = 1
    currentBanContainer.children[2].style.display = "block"
    currentBanContainer.children[3].innerText = `${currentMap.mod}${currentMap.order}`

    // Set new colour element ban colour
    let currentButton = mappoolSectionButtonsEl.querySelector(`[data-id="${pickManagementSelectedMap}"]`)
    currentButton.classList.add("banColourBackground")
    currentButton.style.color = "white"
}