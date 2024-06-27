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
const bracketTextEl = document.getElementById("bracketText")
setInterval(() => {
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

                // Set bracket text
                bracketTextEl.innerText = "MINOR LEAGUE"
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

                // Set bracket text
                bracketTextEl.innerText = "MAJOR LEAGUE"
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
                playerSectionEl.innerHTML = ""
                for (let i = 0; i < currentTeamDetails.player_names.length; i++) {
                    const playerText = document.createElement("div")
                    playerText.innerText = currentTeamDetails.player_names[i].toUpperCase()
                    playerText.classList.add("playerText", (previousTournamentSelectionLeague === "minor")? "textMinor" : "textMajor")
                    playerSectionEl.append(playerText)
                }
            }
        }
    }
}, 500)