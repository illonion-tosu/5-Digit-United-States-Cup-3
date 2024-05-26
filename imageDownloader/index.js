const allCountryFlags = [
    {image: "https://i.imgur.com/HgtC3x3.png", name: "Alabama"},
    {image: "https://i.imgur.com/TqUotZG.png", name: "Alaska"},
    {image: "https://i.imgur.com/yISgPUO.png", name: "American Samoa"},
    {image: "https://i.imgur.com/J4dA4ph.png", name: "Arizona"},
    {image: "https://i.imgur.com/LYY4Qhb.png", name: "Arkansas"},
    {image: "https://i.imgur.com/7n9EJJH.png", name: "California (North)"},
    {image: "https://i.imgur.com/Mf0JGqc.png", name: "California (South)"},
    {image: "https://i.imgur.com/ZJW68ar.png", name: "Colorado"},
    {image: "https://i.imgur.com/2pBKN0y.png", name: "Connecticut"},
    {image: "https://i.imgur.com/zAnQWA6.png", name: "Delaware"},
    {image: "https://i.imgur.com/fhG4bsj.png", name: "Florida"},
    {image: "https://i.imgur.com/gkLiyaQ.png", name: "Georgia"},
    {image: "https://i.imgur.com/XDW7e2N.png", name: "Guam"},
    {image: "https://i.imgur.com/OxFGYCZ.png", name: "Hawaii"},
    {image: "https://i.imgur.com/XcLosS4.png", name: "Idaho"},
    {image: "https://i.imgur.com/aF7wiLI.png", name: "Illinois"},
    {image: "https://i.imgur.com/IAEJyuM.png", name: "Indiana"},
    {image: "https://i.imgur.com/FVcE8UQ.png", name: "Iowa"},
    {image: "https://i.imgur.com/ZkdsShc.png", name: "Kansas"},
    {image: "https://i.imgur.com/poEqbKu.png", name: "Kentucky"},
    {image: "https://i.imgur.com/cjdazL2.png", name: "Louisiana"},
    {image: "https://i.imgur.com/tCUWdvS.png", name: "Maine"},
    {image: "https://i.imgur.com/X4iTwQQ.png", name: "Maryland"},
    {image: "https://i.imgur.com/N9UqdTm.png", name: "Massachusetts"},
    {image: "https://i.imgur.com/30WvVlC.png", name: "Michigan"},
    {image: "https://cytusine.s-ul.eu/kwg7nwU1", name: "Minnesota"},
    {image: "https://i.imgur.com/3XixQcb.png", name: "Mississippi"},
    {image: "https://i.imgur.com/qemFkkl.png", name: "Missouri"},
    {image: "https://i.imgur.com/8hvkSJJ.png", name: "Montana"},
    {image: "https://i.imgur.com/CAIZ4aT.png", name: "Nebraska"},
    {image: "https://i.imgur.com/V0VlFWY.png", name: "Nevada"},
    {image: "https://i.imgur.com/ALyuStI.png", name: "New Hampshire"},
    {image: "https://i.imgur.com/bphqchm.png", name: "New Jersey"},
    {image: "https://i.imgur.com/Ac34GLN.png", name: "New Mexico"},
    {image: "https://i.imgur.com/cKnSjfq.png", name: "New York"},
    {image: "https://i.imgur.com/pkJLMvh.png", name: "North Carolina"},
    {image: "https://i.imgur.com/lvCyFds.png", name: "North Dakota"},
    {image: "https://i.imgur.com/qTR3wL4.png", name: "Northern Mariana Islands"},
    {image: "https://i.imgur.com/egumLUk.png", name: "Ohio"},
    {image: "https://i.imgur.com/fFuBkHY.png", name: "Oklahoma"},
    {image: "https://i.imgur.com/gjG1cLJ.png", name: "Oregon"},
    {image: "https://i.imgur.com/Xyh9nT0.png", name: "Pennsylvania"},
    {image: "https://i.imgur.com/WPWbco0.png", name: "Puerto Rico"},
    {image: "https://i.imgur.com/KHPiY2f.png", name: "Rhode Island"},
    {image: "https://i.imgur.com/rEX4lBq.png", name: "South Carolina"},
    {image: "https://i.imgur.com/vEoIa0Z.png", name: "South Dakota"},
    {image: "https://i.imgur.com/YAM4Orc.png", name: "Tennessee"},
    {image: "https://i.imgur.com/mjGyGr2.png", name: "Texas"},
    {image: "https://i.imgur.com/jfzCw4b.png", name: "U.S. Virgin Islands"},
    {image: "https://cytusine.s-ul.eu/SHqTx3iD", name: "Utah"},
    {image: "https://i.imgur.com/JdEGMnQ.png", name: "Vermont"},
    {image: "https://i.imgur.com/4NPZtTG.png", name: "Virginia"},
    {image: "https://i.imgur.com/VRdPegn.png", name: "Washington"},
    {image: "https://i.imgur.com/vEkRAl4.png", name: "West Virginia"},
    {image: "https://i.imgur.com/6tcjYKd.png", name: "Wisconsin"},
    {image: "https://i.imgur.com/z0qGQFY.png", name: "Wyoming"},
    {image: "https://i.imgur.com/ePOUnNE.png", name: "Stateless"},
    {image: "https://i.imgur.com/R22YhZJ.png", name: "Kanssouri"},
]

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function downloadImages() {
    for (const flag of allCountryFlags) {
        try {
            const response = await fetch(flag.image)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = `${flag.name}.png`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url);
            await delay(100)
        } catch (error) {
            console.error(`Failed to download image: ${flag.name}`, error)
        }
    }
}

// downloadImages()