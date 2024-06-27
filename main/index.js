// Import mappool
const roundTextEl = document.getElementById("roundText")
let allBeatmaps
async function getMappool() {
    const response = await fetch("http://127.0.0.1:24050/5DUSC3/_data/beatmaps.json")
    const mappool = await response.json()
    console.log(mappool)
    allBeatmaps = mappool.beatmaps
    roundTextEl.innerText = mappool.roundName.toUpperCase()
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
const redTeamFlagEl = document.getElementById("redTeamFlag")
const blueTeamFlagEl = document.getElementById("blueTeamFlag")
const redTeamNameEl = document.getElementById("redTeamName")
const blueTeamNameEl = document.getElementById("blueTeamName")
const redTeamStarsEl = document.getElementById("redTeamStars")
const blueTeamStarsEl = document.getElementById("blueTeamStars")
let currentRedTeamName, currentBlueTeamName
let currentBestOf, currentFirstTo, currentRedStars, currentBlueStars

// Score Visibility
let isScoreVisible

// Current Score
const redCurrentScoreEl = document.getElementById("redCurrentScore")
const redCurrentUnderlineEl = document.getElementById("redCurrentUnderline")
const blueCurrentScoreEl = document.getElementById("blueCurrentScore")
const blueCurrentUnderlineEl = document.getElementById("blueCurrentUnderline")
const scoreDifferenceNumberEl = document.getElementById("scoreDifferenceNumber")
const scoreDifferenceTextEl = document.getElementById("scoreDifferenceText")
let currentScoreRed, currentScoreBlue, currentScoreDelta
const scoreAnimation = {
    redCurrentScore: new CountUp(redCurrentScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ", ", decimal: "." }),
    blueCurrentScore: new CountUp(blueCurrentScoreEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ", ", decimal: "." }),
    scoreDifferenceNumber: new CountUp(scoreDifferenceNumberEl, 0, 0, 0, 0.2, { useEasing: true, useGrouping: true, separator: ", ", decimal: "." })
}

// Team RGBs
const redTeamRedColour = 244
const redTeamGreenColour = 98
const redTeamBlueColour = 98
const blueTeamRedColour = 99
const blueTeamGreenColour = 121
const blueTeamBlueColour = 219
const redTeamRedColourInverse = 255 - redTeamRedColour
const redTeamGreenColourInverse = 255 - redTeamGreenColour
const redTeamBlueColourInverse = 255 - redTeamBlueColour
const blueTeamRedColourInverse = 255 - blueTeamRedColour
const blueTeamGreenColourInverse = 255 - blueTeamGreenColour
const blueTeamBlueColourInverse = 255 - blueTeamBlueColour

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

// Chat Display
const chatDisplayEl = document.getElementById("chatDisplay")
let chatLength = 0

socket.onmessage = async (event) => {
    const data = JSON.parse(event.data)

    // Team Name
    if (currentRedTeamName !== data.tourney.manager.teamName.left) {
        currentRedTeamName = data.tourney.manager.teamName.left
        redTeamNameEl.innerText = currentRedTeamName
        redTeamFlagEl.setAttribute("src", `../flags/${currentRedTeamName}.png`)
    }
    if (currentBlueTeamName !== data.tourney.manager.teamName.right) {
        currentBlueTeamName = data.tourney.manager.teamName.right
        blueTeamNameEl.innerText = currentBlueTeamName
        blueTeamFlagEl.setAttribute("src", `../flags/${currentBlueTeamName}.png`)
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
        redTeamStarsEl.innerHTML = ""
        blueTeamStarsEl.innerHTML = ""

        // Create star
        function createStar(starContainerClass, index, starImageSource) {
            // Container
            const starContainer = document.createElement("div")
            starContainer.classList.add("teamStarContainer", starContainerClass)

            // Image
            const starImage = document.createElement("img")
            if (index === currentFirstTo - 1) starImage.classList.add("starLarge")
            else starImage.classList.add("starSmall")
            starImage.setAttribute("src", `../_shared/stars/${starImageSource}.png`)

            // Append
            starContainer.append(starImage)
            return starContainer
        }

        // Default star
        const defaultStar = (tournamentSelectionLeague === "minor")? "white_star": "gray_star"

        // Set Stars
        // Red Stars
        let i = 0
        for (i; i < currentRedStars; i++) {
            redTeamStarsEl.append(createStar("redTeamStarContainer", i, "red_star"))
        }
        for (i; i < currentFirstTo; i++) {
            redTeamStarsEl.append(createStar("redTeamStarContainer", i, defaultStar))
        }
        // Blue Stars
        i = 0
        for (i; i < currentBlueStars; i++) {
            blueTeamStarsEl.append(createStar("blueTeamStarContainer", i, "blue_star"))
        }
        for (i; i < currentFirstTo; i++) {
            blueTeamStarsEl.append(createStar("blueTeamStarContainer", i, defaultStar))
        }
    }

    // Score Visibility
    if (isScoreVisible !== data.tourney.manager.bools.scoreVisible) {
        isScoreVisible = data.tourney.manager.bools.scoreVisible

        if (isScoreVisible) {
            redCurrentScoreEl.style.opacity = 1
            redCurrentUnderlineEl.style.opacity = 1
            blueCurrentScoreEl.style.opacity = 1
            blueCurrentUnderlineEl.style.opacity = 1
            scoreDifferenceNumberEl.style.opacity = 1
            scoreDifferenceTextEl.style.opacity = 1
            chatDisplayEl.style.opacity = 0;
        } else {
            redCurrentScoreEl.style.opacity = 0
            redCurrentUnderlineEl.style.opacity = 0
            blueCurrentScoreEl.style.opacity = 0
            blueCurrentUnderlineEl.style.opacity = 0
            scoreDifferenceNumberEl.style.opacity = 0
            scoreDifferenceTextEl.style.opacity = 0
            chatDisplayEl.style.opacity = 0.902;
        }
    }

    // Score is showing
    if (isScoreVisible) {
        // Setting scores
        currentScoreRed = data.tourney.manager.gameplay.score.left
        currentScoreBlue = data.tourney.manager.gameplay.score.right
        currentScoreDelta = Math.abs(currentScoreRed - currentScoreBlue)

        // Score animation
        scoreAnimation.redCurrentScore.update(currentScoreRed)
        scoreAnimation.blueCurrentScore.update(currentScoreBlue)
        scoreAnimation.scoreDifferenceNumber.update(currentScoreDelta)

        // Score underline and score difference colour change
        const currentDifference = Math.min(1000000, currentScoreDelta) / 1000000
        console.log(currentDifference, currentScoreDelta)
        if (currentScoreRed > currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 1
            blueCurrentUnderlineEl.style.opacity = 0
            if (tournamentSelectionLeague === "minor") {
                scoreDifferenceNumberEl.style.color = `rgb(${255 - currentDifference * redTeamRedColourInverse}, ${255 - currentDifference * redTeamGreenColourInverse}, ${255 - currentDifference * redTeamBlueColourInverse})`
            } else {
                scoreDifferenceNumberEl.style.color = `rgb(${currentDifference * redTeamRedColour}, ${currentDifference * redTeamGreenColour}, ${currentDifference * redTeamBlueColour})`
            }
        } else if (currentScoreRed === currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 0
            blueCurrentUnderlineEl.style.opacity = 0
            scoreDifferenceNumberEl.style.color = (tournamentSelectionLeague === "minor")? "white" : "black"
        } else if (currentScoreRed < currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 0
            blueCurrentUnderlineEl.style.opacity = 1
            if (tournamentSelectionLeague === "minor") {
                scoreDifferenceNumberEl.style.color = `rgb(${255 - currentDifference * blueTeamRedColourInverse}, ${255 - currentDifference * blueTeamGreenColourInverse}, ${255 - currentDifference * blueTeamBlueColourInverse})`
            } else {
                scoreDifferenceNumberEl.style.color = `rgb(${currentDifference * blueTeamRedColour}, ${currentDifference * blueTeamGreenColour}, ${currentDifference * blueTeamBlueColour})`
            }
        }
    }

    // IPC State
    if (currentIPCState !== data.tourney.manager.ipcState) currentIPCState = data.tourney.manager.ipcState

    // Gameplay Song Progress
    if (currentIPCState === 2 || currentIPCState === 3) {
        mapInformationSongProgressTimerStartEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.firstObj)
        mapInformationSongProgressTimerEndEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.full)
        if (data.menu.bm.time.firstObj > data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "11%"
        } else if (data.menu.bm.time.full < data.menu.bm.time.current) {
            mapInformationSongProgressCircleEl.style.left = "86%"
        } else if (data.menu.bm.time.firstObj <= data.menu.bm.time.current &&
            data.menu.bm.time.full >= data.menu.bm.time.current) {
            const timeDifference = data.menu.bm.time.full - data.menu.bm.time.firstObj
            const currentTime = data.menu.bm.time.current - data.menu.bm.time.firstObj
            const currentTimeDeltaPercentage = currentTime / timeDifference * 76 + 10
            mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
        }
    } else {
        mapInformationSongProgressTimerStartEl.innerText = "0:00"
        const currentTimeDeltaPercentage = data.menu.bm.time.current / data.menu.bm.time.mp3 * 76 + 10
        mapInformationSongProgressCircleEl.style.left = `${currentTimeDeltaPercentage}%`
        mapInformationSongProgressTimerEndEl.innerText = getTimeStringFromMilliseconds(data.menu.bm.time.mp3)
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
        console.log(currentMapDetails)
        if (currentMapDetails) {
            foundMapInMappool = true
            mapInformationRightSREl.innerText = `SR: ${Math.round(parseFloat(currentMapDetails.difficultyrating) * 100) / 100}`
            mapInformationRightCSEl.innerText = `CS: ${Math.round(parseFloat(currentMapDetails.cs) * 10) / 10}`
            mapInformationRightAREl.innerText = `AR: ${Math.round(parseFloat(currentMapDetails.ar) * 10) / 10}`
            mapInformationRightODEl.innerText = `OD: ${Math.round(parseFloat(currentMapDetails.od) * 10) / 10}`
            mapInformationRightBPMEl.innerText = `BPM: ${Math.round(parseFloat(currentMapDetails.bpm) * 10) / 10}`
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

    // Chat Display
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
let tournamentSelectionLeague = "minor"

// Get Cookie
function getCookie(cname) {
    let name = cname + "="
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function tournamentSelection(league) {
    tournamentSelectionLeague = league
    const images = document.getElementsByTagName("img")

    if (league === "major") {
        // Team Names
        redTeamNameEl.classList.add("teamNameMajor")
        blueTeamNameEl.classList.add("teamNameMajor")
        redTeamNameEl.classList.remove("teamNameMinor")
        blueTeamNameEl.classList.remove("teamNameMinor")

        // Logo
        logoMajorEl.style.opacity = 1
        logoMinorEl.style.opacity = 0

        // Round Name
        roundTextEl.classList.add("roundTextMajor")
        roundTextEl.classList.remove("roundTextMinor")

        // Score Difference
        scoreDifferenceNumberEl.classList.add("scoreDifferenceMajor")
        scoreDifferenceTextEl.classList.add("scoreDifferenceMajor")
        scoreDifferenceNumberEl.classList.remove("scoreDifferenceMinor")
        scoreDifferenceTextEl.classList.remove("scoreDifferenceMinor")

        // Video
        backgroundVideoMajorLeagueEl.style.opacity = 1

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

        // Set images
        for (i = 0; i < images.length; i++) {
            let currentSrcValue = images[i].getAttribute("src")
            if (currentSrcValue.includes("white_star")) {
                images[i].setAttribute("src", currentSrcValue.replace("white_star", "gray_star"))
            }
        }
    } else {
        // Team Names
        redTeamNameEl.classList.remove("teamNameMajor")
        blueTeamNameEl.classList.remove("teamNameMajor")
        redTeamNameEl.classList.add("teamNameMinor")
        blueTeamNameEl.classList.add("teamNameMinor")

        // Logo
        logoMajorEl.style.opacity = 0
        logoMinorEl.style.opacity = 1

        // Round Name
        roundTextEl.classList.remove("roundTextMajor")
        roundTextEl.classList.add("roundTextMinor")

        // Score difference
        scoreDifferenceNumberEl.classList.remove("scoreDifferenceMajor")
        scoreDifferenceTextEl.classList.remove("scoreDifferenceMajor")
        scoreDifferenceNumberEl.classList.add("scoreDifferenceMinor")
        scoreDifferenceTextEl.classList.add("scoreDifferenceMinor")

        // Background
        backgroundVideoMajorLeagueEl.style.opacity = 0

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

        // Set images
        for (i = 0; i < images.length; i++) {
            let currentSrcValue = images[i].getAttribute("src")
            if (currentSrcValue.includes("gray_star")) {
                images[i].setAttribute("src", currentSrcValue.replace("gray_star", "white_star"))
            }
        }
    }
}

setInterval(() => {
    tournamentSelectionLeague = getCookie("tournamentSelection")
    tournamentSelection(tournamentSelectionLeague)
},500)

function getTimeStringFromMilliseconds(milliseconds) {
    let seconds = Math.round(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let secondsCounter = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${secondsCounter}`
}