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

// RGBs
const redTeamRedColourInverse = 255 - 244
const redTeamGreenColourInverse = 255 - 98
const redTeamBlueColourInverse = 255 - 98
const blueTeamRedColourInverse = 255 - 99
const blueTeamGreenColourInverse = 255 - 121
const blueTeamBlueColourInverse = 255 - 219

socket.onmessage = async (event) => {
    const data = JSON.parse(event.data)

    // TODO: Flags
    // Team Name
    if (currentRedTeamName !== data.tourney.manager.teamName.left) {
        currentRedTeamName = data.tourney.manager.teamName.left
        redTeamNameEl.innerText = currentRedTeamName
    }
    if (currentBlueTeamName !== data.tourney.manager.teamName.right) {
        currentBlueTeamName = data.tourney.manager.teamName.right
        blueTeamNameEl.innerText = currentBlueTeamName
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
            starImage.setAttribute("src", `static/${starImageSource}.png`)

            // Append
            starContainer.append(starImage)
            return starContainer
        }

        // Set Stars
        // Red Stars
        let i = 0
        for (i; i < currentRedStars; i++) {
            redTeamStarsEl.append(createStar("redTeamStarContainer", i, "red_star"))
        }
        for (i; i < currentFirstTo; i++) {
            redTeamStarsEl.append(createStar("redTeamStarContainer", i, "white_star"))
        }
        // Blue Stars
        i = 0
        for (i; i < currentBlueStars; i++) {
            blueTeamStarsEl.append(createStar("blueTeamStarContainer", i, "blue_star"))
        }
        for (i; i < currentFirstTo; i++) {
            blueTeamStarsEl.append(createStar("blueTeamStarContainer", i, "white_star"))
        }
    }

    // Score Visibility
    if (isScoreVisible !== data.tourney.manager.bools.scoreVisible) {
        isScoreVisible = data.tourney.manager.bools.scoreVisible

        if (isScoreVisible) {
            redCurrentScoreEl.style.display = "block"
            redCurrentUnderlineEl.style.display = "block"
            blueCurrentScoreEl.style.display = "block"
            blueCurrentUnderlineEl.style.display = "block"
            scoreDifferenceNumberEl.style.display = "block"
            scoreDifferenceTextEl.style.display = "block"
        } else {
            redCurrentScoreEl.style.display = "none"
            redCurrentUnderlineEl.style.display = "none"
            blueCurrentScoreEl.style.display = "none"
            blueCurrentUnderlineEl.style.display = "none"
            scoreDifferenceNumberEl.style.display = "none"
            scoreDifferenceTextEl.style.display = "none"
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
        const currentDifference = Math.min(1000000, 1000000 - currentScoreDelta) / 1000000
        if (currentScoreRed > currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 1
            blueCurrentUnderlineEl.style.opacity = 0
            scoreDifferenceNumberEl.style.color = `rgb(${255 - currentDifference * redTeamRedColourInverse}, ${255 - currentDifference * redTeamGreenColourInverse}, ${255 - currentDifference * redTeamBlueColourInverse})`
        } else if (currentScoreRed === currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 0
            blueCurrentUnderlineEl.style.opacity = 0
            scoreDifferenceNumberEl.style.color = `rgb(255, 255, 255)`
        } else if (currentScoreRed < currentScoreBlue) {
            redCurrentUnderlineEl.style.opacity = 0
            blueCurrentUnderlineEl.style.opacity = 1
            scoreDifferenceNumberEl.style.color = `rgb(${255 - currentDifference * blueTeamRedColourInverse}, ${255 - currentDifference * blueTeamGreenColourInverse}, ${255 - currentDifference * blueTeamBlueColourInverse})`
        }
    }
}