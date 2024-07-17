// Import mappool
const roundNameEl = document.getElementById("roundName")
let allBeatmaps
async function getMappool() {
    const response = await fetch("http://127.0.0.1:24050/5DUSC3/_data/beatmaps.json")
    const mappool = await response.json()
    console.log(mappool)
    allBeatmaps = mappool.beatmaps
    roundNameEl.innerText = mappool.roundName.toUpperCase()
}

getMappool()

// Get teams
let allTeams
async function getTeams() {
    const response = await fetch("http://127.0.0.1:24050/5DUSC3/_data/teams.json")
    allTeams = await response.json()
}
getTeams()

// Find team by team name
const findTeamByTeamName = teamName => allTeams.find(team => team.team_name === teamName)

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

let previousTeamName
let previousTeamColour
let previousTournamentSelectionLeague = "minor"

const backgroundVideoMajorLeagueEl = document.getElementById("backgroundVideoMajorLeague")
const winnerTeamEl = document.getElementById("winnerTeam")
const teamBannerEl = document.getElementById("teamBanner")
const playerSectionEl = document.getElementById("playerSection")
const redOverlayEl = document.getElementById("redOverlay")
const blueOverlayEl = document.getElementById("blueOverlay")
const bracketTextSpecficEl = document.getElementById("bracketTextSpecfic")
setInterval(() => {
    // Bracket text 
    bracketTextSpecfic.innerText = getCookie("bracket")
    
    // If there are teams
    if (allTeams) {

        // Set overlays
        let currentTeamColour = getCookie("winnerTeamColour")
        if (previousTeamColour !== currentTeamColour) {
            previousTeamColour = currentTeamColour
            redOverlayEl.style.opacity = 0
            blueOverlayEl.style.opacity = 0
            if (currentTeamColour === "red") redOverlayEl.style.opacity = 1
            else if (currentTeamColour === "blue") blueOverlayEl.style.opacity = 1
        }

        // Set major and minor backgrounds
        let currentTournamentSelectionLeague = getCookie("tournamentSelection")
        if (previousTournamentSelectionLeague !== currentTournamentSelectionLeague) {
            previousTournamentSelectionLeague = currentTournamentSelectionLeague

            if (currentTournamentSelectionLeague == "minor") {
                // Set backgrounds
                backgroundVideoMajorLeagueEl.style.opacity = 0

                // Set majors and minors for all texts
                const textMajors = document.getElementsByClassName("textMajor")
                const textMajorsArray = Array.from(textMajors)
                textMajorsArray.forEach(element => element.classList.add("textMinor"))
                textMajorsArray.forEach(element => element.classList.remove("textMajor"))
                // Set majors and minors for all bars
                const topBottomBarMajors = document.getElementsByClassName("topBottomBarMajor")
                const topBottomBarMajorsArray = Array.from(topBottomBarMajors)
                topBottomBarMajorsArray.forEach(element => element.classList.add("topBottomBarMinor"))
                topBottomBarMajorsArray.forEach(element => element.classList.remove("topBottomBarMajor"))
            } else {
                // Set backgrounds
                backgroundVideoMajorLeagueEl.style.opacity = 1

                // Set majors and minors for all texts
                const textMinors = document.getElementsByClassName("textMinor")
                const textMinorsArray = Array.from(textMinors)
                textMinorsArray.forEach(element => element.classList.add("textMajor"))
                textMinorsArray.forEach(element => element.classList.remove("textMinor"))
                // Set majors and minors for all bars
                const topBottomBarMinors = document.getElementsByClassName("topBottomBarMinor")
                const topBottomBarMinorsArray = Array.from(topBottomBarMinors)
                topBottomBarMinorsArray.forEach(element => element.classList.add("topBottomBarMajor"))
                topBottomBarMinorsArray.forEach(element => element.classList.remove("topBottomBarMinor"))
            }
        }

        // Set Team Name
        let currentTeamName = getCookie("winnerTeamName")
        if (currentTeamName === "none") return
        if (previousTeamName !== currentTeamName) {
            previousTeamName = currentTeamName

            // Get team details
            const currentTeamDetails = findTeamByTeamName(previousTeamName)
            if (currentTeamDetails) {
                // Set team details
                winnerTeamEl.innerText = previousTeamName.toUpperCase()
                teamBannerEl.style.backgroundImage = `url("../flags/${previousTeamName}.png")`

                // Set player details
                const playerTexts = document.getElementsByClassName("playerText")
                for (let i = 0; i < currentTeamDetails.player_names.length; i++) {
                    playerTexts[i].innerText = currentTeamDetails.player_names[i].toUpperCase()
                }
            }
        }
    }
}, 500)