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

        const pickContainerCrown = document.createElement("img")
        pickContainerCrown.setAttribute("src", "static/crown.png")
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
const eightStars = [
    {left: "363px", top: "78px"},
    {left: "420px", top: "53px"},
    {left: "479px", top: "78px"},
    {left: "487px", top: "139px"},
    {left: "451px", top: "189px"},
    {left: "392px", top: "189px"},
    {left: "355px", top: "139px"},
    {left: "410px", top: "113px"}
]
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

// Song Progress
const mapInformationSongProgressCircleEl = document.getElementById("mapInformationSongProgressCircle")
const mapInformationSongProgressTimerStartEl = document.getElementById("mapInformationSongProgressTimerStart")
const mapInformationSongProgressTimerEndEl = document.getElementById("mapInformationSongProgressTimerEnd")

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

// Automatically set winner of map
let resultsShown = false
let currentPickedTile

// Stars
let isStarVisible

// OBS Information
const sceneCollection = document.getElementById("sceneCollection")
let autoadvance_button = document.getElementById('autoAdvanceButton')
let autoadvance_timer_container = document.getElementById('autoAdvanceTimer')
let autoadvance_timer_label = document.getElementById('autoAdvanceTimerLabel')

let enableAutoAdvance = false
const gameplay_scene_name = "Gameplay"
const mappool_scene_name = "Mappool"
const tema_win_scene_name = "Winner"

function switchAutoAdvance() {
    enableAutoAdvance = !enableAutoAdvance
    if (enableAutoAdvance) {
        autoadvance_button.innerText = 'AUTO ADVANCE: ON'
        autoadvance_button.style.backgroundColor = '#9ffcb3'
        autoadvance_button.style.color = "black"
    } else {
        autoadvance_button.innerText = 'AUTO ADVANCE: OFF'
        autoadvance_button.style.backgroundColor = '#fc9f9f'
        autoadvance_button.style.color = "white"
    }
}

const obsGetCurrentScene = window.obsstudio?.getCurrentScene ?? (() => {})
const obsGetScenes = window.obsstudio?.getScenes ?? (() => {})
const obsSetCurrentScene = window.obsstudio?.setCurrentScene ?? (() => {})

obsGetScenes(scenes => {
    for (const scene of scenes) {
        let clone = document.getElementById("sceneButtonTemplate").content.cloneNode(true)
        let buttonNode = clone.querySelector('div')
        buttonNode.id = `scene__${scene}`
        buttonNode.textContent = `GO TO: ${scene}`
        buttonNode.onclick = function() { obsSetCurrentScene(scene); }
        sceneCollection.appendChild(clone)
    }

    obsGetCurrentScene((scene) => { document.getElementById(`scene__${scene.name}`).classList.add("activeScene") })
})

window.addEventListener('obsSceneChanged', function(event) {
    let activeButton = document.getElementById(`scene__${event.detail.name}`)
    for (const scene of sceneCollection.children) { scene.classList.remove("activeScene") }
    activeButton.classList.add("activeScene")
})

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

        // Set star positions
        let starPositions
        switch (currentFirstTo) {
            case 6: starPositions = sixStars; break;
            case 7: starPositions = sevenStars; break;
            case 8: starPositions = eightStars; break;
            default: starPositions = eightStars
        }

        // Create stars
        function createStar(i, starImage, starContainer) {
            const createStar = document.createElement("img")
            createStar.classList.add((i === currentFirstTo - 1)? "largeStar" : "smallStar")
            createStar.style.left = starPositions[i].left
            createStar.style.top = starPositions[i].top
            createStar.setAttribute("src", `../_shared/stars/${starImage}.png`)
            starContainer.append(createStar)
        }

        let i = 0
        for (i; i < currentRedStars; i++) createStar(i, "white_red_star", redTeamStarContainerEl)
        for (i; i < currentFirstTo; i++) createStar(i, "gray_star", redTeamStarContainerEl)

        i = 0
        for (i; i < currentBlueStars; i++) createStar(i, "white_blue_star", blueTeamStarContainerEl)
        for (i; i < currentFirstTo; i++) createStar(i, "gray_star", blueTeamStarContainerEl)

        // Set cookies
        if (currentRedStars >= currentFirstTo) {
            document.cookie = `winnerTeamName=${currentRedTeamName}; path=/`
            document.cookie = `winnerTeamColour=red; path=/`
        } else if (currentBlueStars >= currentFirstTo) {
            document.cookie = `winnerTeamName=${currentBlueTeamName}; path=/`
            document.cookie = `winnerTeamColour=blue; path=/`
        } else {
            document.cookie = `winnerTeamName=none; path=/`
            document.cookie = `winnerTeamColour=none; path=/`
        }
    }

    // Star visibility
    if (isStarVisible !== data.tourney.manager.bools.starsVisible) {
        isStarVisible = data.tourney.manager.bools.starsVisible

        if (isStarVisible) {
            redTeamStarContainerEl.style.opacity = 1
            blueTeamStarContainerEl.style.opacity = 1
        } else {
            redTeamStarContainerEl.style.opacity = 0
            blueTeamStarContainerEl.style.opacity = 0
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

            setTimeout(() => {
                if (enableAutoAdvance) {
                    obsGetCurrentScene((scene) => {
                        if (scene.name === gameplay_scene_name) return
                        if (enableAutoAdvance) obsSetCurrentScene(gameplay_scene_name)
                    })
                }
            }, 10000)
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
        if (currentIPCState === 2 || currentIPCState === 3) {
            obsGetCurrentScene((scene) => {
                if (scene.name === gameplay_scene_name) return
                if (enableAutoAdvance) obsSetCurrentScene(gameplay_scene_name)
            })
        } else if (currentIPCState === 4) {
            mapPicked = false
            currentlyPickingEl.style.display = "block"

            // Set winner from previous map
            if (!resultsShown) {
                resultsShown = true
                showPicking(true)

                let currentWinner
                if (data.tourney.manager.gameplay.score.left > data.tourney.manager.gameplay.score.right && currentPickedTile) {
                    currentWinner = "Red"
                } else if (data.tourney.manager.gameplay.score.left < data.tourney.manager.gameplay.score.right && currentPickedTile) {
                    currentWinner = "Blue"
                }

                if (currentWinner) {
                    currentPickedTile.children[1].classList.add(`pickContainerWinner${currentWinner}`)
                    currentPickedTile.children[3].classList.remove(`pickContainerBottomNone`)
                    currentPickedTile.children[3].classList.add(`pickContainerBottom${currentWinner}`)
                    currentPickedTile.children[4].style.display = "block"
                    currentPickedTile.children[5].style.color = "white"
                }

                if (enableAutoAdvance) {
                    setTimeout(() => {
                        if (currentRedStars === currentFirstTo || currentBlueStars === currentFirstTo) {
                            obsGetCurrentScene((scene) => {
                                if (scene.name === tema_win_scene_name) return
                                if (enableAutoAdvance) obsSetCurrentScene(tema_win_scene_name)
                            })
                        } else {
                            obsGetCurrentScene((scene) => {
                                if (scene.name === mappool_scene_name) return
                                if (enableAutoAdvance) obsSetCurrentScene(mappool_scene_name)
                            })
                        }
                    }, 20000)
                }
            }
        } else {
            resultsShown = false
        }
    }

    // Gameplay Song Progress
    if (currentIPCState === 2 || currentIPCState === 3) {
        mapInformationSongProgressTimerStartEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.firstObj)
        mapInformationSongProgressTimerEndEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.full)
        if (data.menu.bm.time.firstObj > data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "10%"
        } else if (data.menu.bm.time.full < data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "88%"
        } else if (data.menu.bm.time.firstObj <= data.menu.bm.time.current &&
            data.menu.bm.time.full >= data.menu.bm.time.current) {
            const timeDifference = data.menu.bm.time.full - data.menu.bm.time.firstObj
            const currentTime = data.menu.bm.time.current - data.menu.bm.time.firstObj
            const currentTimeDeltaPercentage = currentTime / timeDifference * 78 + 10
            mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
        }
    } else {
        mapInformationSongProgressTimerStartEl.innerText = "0:00"
        const currentTimeDeltaPercentage = data.menu.bm.time.current / data.menu.bm.time.mp3 * 76 + 10
        mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
        mapInformationSongProgressTimerEndEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.mp3)
    }
}

// Add / Remove Wrap
function addRemoveTextWrap(element) {
    if (element.getBoundingClientRect().width > 397) element.classList.add("mapInformationRightWrap")
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

// Bracket Text
const bracketTextEl = document.getElementById("bracketText")

// Tournament Selection
const backgroundVideoMajorLeagueEl = document.getElementById("backgroundVideoMajorLeague")
const tournamentSelectionEl = document.getElementById("tournamentSelection")
let tournamentSelectionLeague = "minor"

function tournamentSelection(league) {
    document.cookie = `tournamentSelection=${league}; path=/`
    tournamentSelectionLeague = league

    if (league === "major") {
        // Text on sidebar
        tournamentSelectionEl.innerText = "Major League"
        
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

        // Bracket Text
        bracketTextEl.classList.add("bracketTextMajor")
        bracketTextEl.classList.remove("bracketTextMinor")
    } else if (league === "minor") {
        // Text on sidebar
        tournamentSelectionEl.innerText = "Minor League"

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

        // Bracket Text
        bracketTextEl.classList.remove("bracketTextMajor")
        bracketTextEl.classList.add("bracketTextMinor")
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
            currentTile.dataset.id &&
            currentTile.dataset.action) {
                currentTile = currentContainer.children[1]
            }
    
        // Get potential previous pick's information
        let previousTileId
        if (currentTile.hasAttribute("data-id")) {
            previousTileId = currentTile.dataset.id
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
        let previousTiles = document.querySelectorAll(`[data-id="${previousTileId}"]:not([data-action]), [data-id="${previousTileId}"][data-action=""]`);
        if (previousTiles.length !== 0) {
            previousTiles[0].classList.remove("banColourBackground")
            previousTiles[0].style.color = "white"
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
        currentTile.children[2].style.display = "block"
        currentTile.children[3].classList.add("pickContainerBottomNone")
        currentTile.children[5].innerText = `${currentMap.mod}${(checkNumberOfModsInModpoolIsOne(currentMap.mod))? "" : currentMap.order}`

        // Set background colour for current button
        this.style.color = "black"
        this.style.backgroundColor = "lightgreen"

        // Reset some elements
        mapPicked = true
        currentlyPickingEl.style.display = "none"

        // Set cookie for current picking team
        document.cookie = `currentPicker=${nextActionTeam.toLowerCase()}; path=/`
        currentPickedTile = currentTile
    }

    // Switch teams for next action
	let redTeamBanCount = 0
	let blueTeamBanCount = 0
	for (let i = 0; i < redTeamBanContainerEl.childElementCount; i++) if (redTeamBanContainerEl.children[i].dataset.id) redTeamBanCount++
	for (let i = 0; i < blueTeamBanContainerEl.childElementCount; i++) if (blueTeamBanContainerEl.children[i].dataset.id) blueTeamBanCount++
	
	if (redTeamBanCount === blueTeamBanCount && nextAction === "Ban") {}
    else if (nextActionTeam === "Red") nextActionTeam = "Blue"
    else if (nextActionTeam === "Blue") nextActionTeam = "Red"
    nextActionTextEl.innerText = `${nextActionTeam} ${nextAction}`
}

// Check number of mods in particular modpool
const checkNumberOfModsInModpoolIsOne = mod => allBeatmaps.filter(beatmap => beatmap.mod === mod).length === 1

const pickBanManagementSelectEl = document.getElementById("pickBanManagementSelect")
const sideBarColumn2El = document.getElementById("sideBarColumn2")
let selectedPickManagementOption
pickBanManagementSelectEl.addEventListener('change', function()  {
    selectedPickManagementOption = this.value
    while (sideBarColumn2El.childElementCount > 2) sideBarColumn2El.lastChild.remove()

    // Add mappool
    function addMappool() {
        // Create mappool title
        createPickBanManagementTitle("Which map?")
        // Create mappool button section
        const pickManagementMappoolButtonSection = document.createElement("div")

        pickManagementMappoolButtonSection.classList.add("pickManagementButtonSection")
        // Create mappool buttons
        for (let i = 0 ; i < allBeatmaps.length; i++) {
            const button = document.createElement("button")
            button.addEventListener("click", pickManagementSelectMap)
            button.classList.add("pickManagementButton", "pickManagementMappoolButton")
            button.innerText = `${allBeatmaps[i].mod}${allBeatmaps[i].order}`
            button.dataset.id = allBeatmaps[i].beatmapID
            pickManagementMappoolButtonSection.append(button)
        }
        sideBarColumn2El.append(pickManagementMappoolButtonSection)
    }

    // Add picks
    function addPicks() {
        // Create title
        createPickBanManagementTitle("Whose map?")

        // Select Pick Div
        const pickManagementPickButtonsSection = document.createElement("div")
        pickManagementPickButtonsSection.classList.add("pickManagementButtonSection")
        for (let i = 0; i < redPickSectionEl.childElementCount; i++) {
            const redPickButton = document.createElement("button")
            redPickButton.innerText = `Red P ${i + 1}`
            redPickButton.classList.add("pickManagementButton", "pickManagementPicksButton")
            redPickButton.addEventListener("click", pickManagementSelectPick)
            pickManagementPickButtonsSection.append(redPickButton)

            const bluePickButton = document.createElement("button")
            bluePickButton.innerText = `Blue P ${i + 1}`
            bluePickButton.addEventListener("click", pickManagementSelectPick)
            bluePickButton.classList.add("pickManagementButton", "pickManagementPicksButton")
            pickManagementPickButtonsSection.append(bluePickButton)
        }
        // Add tiebreaker pick
        const tiebreakerPickButton = document.createElement("button")
        tiebreakerPickButton.innerText = `Tiebreaker`
        tiebreakerPickButton.classList.add("pickManagementButton", "pickManagementPicksButton")
        tiebreakerPickButton.addEventListener("click", pickManagementSelectPick)
        pickManagementPickButtonsSection.append(tiebreakerPickButton)
        sideBarColumn2El.append(pickManagementPickButtonsSection)
    }

    
    // Set Ban and Remove Ban
    if (selectedPickManagementOption === "setBan" || selectedPickManagementOption === "removeBan") {
        // Create title
        createPickBanManagementTitle("Whose ban?")
        
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

        if (selectedPickManagementOption === "setBan") addMappool()
    }

    // Set Pick
    if (selectedPickManagementOption === "setPick" || selectedPickManagementOption === "removePick") {
        addPicks()
        if (selectedPickManagementOption === "setPick") addMappool()
    }

    if (selectedPickManagementOption === "winnerOptions") {
        addPicks()

        // Set winner of map
        // Create title
        createPickBanManagementTitle("Who won?")
        // Create select
        const select = document.createElement("select")
        select.classList.add("pickBanManagementSelect")
        select.setAttribute("id", "pickManagementWinnerSelect")
        sideBarColumn2El.append(select)
        
        // Create options
        const winnerOfMapOptions = ["No One", "Red", "Blue"]
        for (let i = 0; i < winnerOfMapOptions.length; i++) {
            const optionRed = document.createElement("option")
            optionRed.value = winnerOfMapOptions[i]
            optionRed.innerText = winnerOfMapOptions[i]
            select.append(optionRed)
        }
        select.setAttribute("size", select.childElementCount)
    }

    // Apply changes button
    const applyChangesButton = document.createElement("button")
    applyChangesButton.innerText = "Apply Changes"
    applyChangesButton.classList.add("sideBarButton")
    applyChangesButton.style.width = "200px"
    applyChangesButton.style.marginLeft = "10%"
    applyChangesButton.style.marginTop = "20px"
    sideBarColumn2El.append(applyChangesButton)

    switch (selectedPickManagementOption) {
        case "setBan": applyChangesButton.addEventListener("click", applyChangesSetBan); break;
        case "removeBan": applyChangesButton.addEventListener("click", applyChangesRemoveBan); break;
        case "setPick": applyChangesButton.addEventListener("click", applyChangesSetPick); break;
        case "removePick": applyChangesButton.addEventListener("click", applyChangesRemovePick); break;
        case "winnerOptions": applyChangesButton.addEventListener("click", applyChangesWinnerOptions); break;
    }
})

// Pick Ban Management title
function createPickBanManagementTitle(message) {
    const banTitle = document.createElement("h1")
    banTitle.innerText = message
    sideBarColumn2El.append(banTitle)
}

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

// Get current ban container
function applyChangesGetCurrentBanContainer() {
    const pickBanManagementBanSelectElValue = document.getElementById("pickBanManagementBanSelect").value
    const pickBanManagementBanSelectElValueSplit = pickBanManagementBanSelectElValue.split("_")
    const pickBanManagementBanColour = pickBanManagementBanSelectElValueSplit[0]
    const pickBanManagementBanNumber = pickBanManagementBanSelectElValueSplit[2]

    // Get current element we are replacing
    if (pickBanManagementBanColour === "red") return redTeamBanContainerEl.children[parseInt(pickBanManagementBanNumber)]
    else return blueTeamBanContainerEl.children[parseInt(pickBanManagementBanNumber)]
}

// Remove previous button ban colours
function removePreviousButtonStyles(previousBanId) {
    mappoolSectionButtonsEl.querySelectorAll("[data-id]")
    let previousButton = mappoolSectionButtonsEl.querySelector(`[data-id="${previousBanId}"]`)
    previousButton.classList.remove("banColourBackground")
    previousButton.style.backgroundColor = "transparent"
    previousButton.style.color = "white"
}

// Set Ban
function applyChangesSetBan() {
    let currentBanContainer = applyChangesGetCurrentBanContainer()

    // Save current element information we are replacing
    let previousBanId = currentBanContainer.dataset.id
    if (previousBanId) removePreviousButtonStyles(previousBanId)

    // Find current map details
    const currentMap = findMapInMappool(pickManagementSelectedMap)
    
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

// Remove Ban
function applyChangesRemoveBan() {
    let currentBanContainer = applyChangesGetCurrentBanContainer()

    // Save current element information we are replacing
    let previousBanId = currentBanContainer.dataset.id
    if (!previousBanId) return

    // Remove current element ban button colour if it is a ban colour only
    removePreviousButtonStyles(previousBanId)

    currentBanContainer.removeAttribute('data-id')
    currentBanContainer.removeAttribute('data-action')
    currentBanContainer.children[0].style.opacity = 0
    currentBanContainer.children[2].style.display = "none"
    currentBanContainer.children[3].innerText = ""
}

// Pick Management Select Pick
const pickManagementPicksButtonEls = document.getElementsByClassName("pickManagementPicksButton")
let pickManagementSelectedPick
let pickManagementTeam
let pickManagementNumber
function pickManagementSelectPick() {
    pickManagementSelectedPick = this.innerText
    pickManagementTeam = pickManagementSelectedPick.split(" ")[0]
    pickManagementNumber = pickManagementSelectedPick.split(" ")[2]

    // Set colour
    for (let i = 0; i < pickManagementPicksButtonEls.length; i++) {
        pickManagementPicksButtonEls[i].style.backgroundColor = "transparent"
        pickManagementPicksButtonEls[i].style.color = "white"
    }
    this.style.backgroundColor = "rgb(206,206,206)"
    this.style.color = "black"
}

// Apply changes get current pick container
function applyChangesGetCurrentPickContainer() {
    if (pickManagementTeam === "Tiebreaker") return tiebreakerPickContainerEl
    if (pickManagementTeam === "Red") return redPickSectionEl.children[parseInt(pickManagementNumber) - 1]
    return bluePickSectionEl.children[parseInt(pickManagementNumber) - 1]
}

// Set Pick
function applyChangesSetPick() {
    // Get current container
    let currentPickContainer = applyChangesGetCurrentPickContainer()

    // Save current element information we are replacing
    let previousPickId = currentPickContainer.dataset.id
    if (previousPickId) removePreviousButtonStyles(previousPickId)

    // Find current map details
    const currentMap = findMapInMappool(pickManagementSelectedMap)

    currentPickContainer.dataset.id = pickManagementSelectedMap
    currentPickContainer.dataset.action = "Pick"
    currentPickContainer.children[0].style.backgroundImage = `url("${currentMap.imgURL}")`
    currentPickContainer.children[0].style.opacity = 1
    if (!previousPickId ||  window.getComputedStyle(currentPickContainer.children[4]).display === "none") currentPickContainer.children[3].classList.add("pickContainerBottomNone")
    currentPickContainer.children[5].innerText = `${currentMap.mod}${(checkNumberOfModsInModpoolIsOne(currentMap.mod))? "" : currentMap.order}`

    // Set new colour element ban colour
    let currentButton = mappoolSectionButtonsEl.querySelector(`[data-id="${pickManagementSelectedMap}"]`)
    currentButton.style.backgroundColor = "lightgreen"
    currentButton.style.color = "black"
    currentPickContainer.children[2].style.display = "block"
}

// Remove pick
function applyChangesRemovePick() {
    // Get current container
    let currentPickContainer = applyChangesGetCurrentPickContainer()

    // Save current element information we are replacing
    let previousPickId = currentPickContainer.dataset.id
    if (previousPickId) removePreviousButtonStyles(previousPickId)

    currentPickContainer.removeAttribute('data-id')
    currentPickContainer.removeAttribute('data-action')
    currentPickContainer.children[0].style.backgroundImage = `none`
    currentPickContainer.children[0].style.opacity = 0
    currentPickContainer.children[2].style.display = "none"
    currentPickContainer.children[3].classList.remove("pickContainerBottomNone", "pickContainerBottomRed", "pickContainerBottomBlue")
    if (window.getComputedStyle(currentPickContainer.children[4]).display !== "none") {
        currentPickContainer.children[4].style.display = "none"
        currentPickContainer.children[1].classList.remove("pickContainerWinnerRed", "pickContainerWinnerBlue")
    }
    currentPickContainer.children[5].innerText = ""
}

// Winner options
function applyChangesWinnerOptions() {
    // Get current container
    let currentPickContainer = applyChangesGetCurrentPickContainer()

    const pickManagementWinnerSelectElValue = document.getElementById("pickManagementWinnerSelect").value
    switch (pickManagementWinnerSelectElValue) {
        case "No One":
            currentPickContainer.children[1].classList.remove("pickContainerWinnerRed", "pickContainerWinnerBlue")
            currentPickContainer.children[3].classList.remove("pickContainerBottomRed", "pickContainerBottomBlue")
            currentPickContainer.children[4].style.display = "none"
            if (currentPickContainer.children[5].innerText === "") currentPickContainer.children[3].classList.remove("pickContainerWinnerNone")
            else currentPickContainer.children[3].classList.add("pickContainerBottomNone")
            break
        case "Red": case "Blue":
            currentPickContainer.children[1].classList.remove("pickContainerWinnerNone", "pickContainerWinnerRed", "pickContainerWinnerBlue")
            currentPickContainer.children[1].classList.add(`pickContainerWinner${pickManagementWinnerSelectElValue}`)
            currentPickContainer.children[3].classList.remove("pickContainerBottomNone", "pickContainerBottomRed", "pickContainerBottomBlue")
            currentPickContainer.children[3].classList.add(`pickContainerBottom${pickManagementWinnerSelectElValue}`)
            currentPickContainer.children[4].style.display = "block"
            currentPickContainer.children[5].style.color = "white"
            break
    }
}

// Show or hide picking
function showPicking(showPicking) {
    if (nextAction === "Pick" && showPicking) {
        currentlyPickingEl.style.display = "block"
        currentlyPickingEl.innerText = `${nextActionTeam.toUpperCase()} IS CURRENTLY PICKING...`
        currentlyPickingEl.classList.add(`${nextActionTeam.toLowerCase()}TeamColor`)

        currentlyPickingEl.classList.remove("blueTeamColor")
        currentlyPickingEl.classList.remove("redTeamColor")
        if (nextActionTeam === "Red") currentlyPickingEl.classList.add("redTeamColor")
        else currentlyPickingEl.classList.add("blueTeamColor")
    } else if (nextAction === "Ban" || !showPicking) {
        currentlyPickingEl.style.display = "none"
    }
}

function getTimeStringFromMilliseconds(milliseconds) {
    let seconds = Math.round(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let secondsCounter = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${secondsCounter}`
}

// Bracket text
const bracketTextSpecfic = document.getElementById("bracketTextSpecfic")
function changeBracketText(text) {
    bracketTextSpecfic.innerText = text
    document.cookie = `bracket=${text}; path=/`
}