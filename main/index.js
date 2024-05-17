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

socket.onmessage = async (event) => {
    const data = JSON.parse(event.data)

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
}