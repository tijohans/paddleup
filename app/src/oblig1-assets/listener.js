const resultsContainer = document.querySelector('.results-container')

// Add an event listener to listen for the match finish custom event
document.addEventListener('matchfinish', (e) => {
    // If found, format the details gotten and send it to the result list.
    addToResultList(formatResult(e.detail.match))
})

function formatResult(match) {
    // Function for formatting the custom event's returned match
    // Find all the scores from each set and render them into one string
    let scoresToRender = ' Results: '

    // Find all the completed games in the match, and create a new array length max for the render loop to follow
    let newLength = 0
    for (let i = 0; i < match.games.length; i++) {
        if (match.games[i].complete) {
            newLength++
        }
    }

    // Render the complete matches with nice formatting
    for (let i = 0; i < newLength; i++) {
        scoresToRender = scoresToRender + match.games[i].plr1score + '-' + match.games[i].plr2score

        // Check if the loop is at the end of the arrays length, and if so add a dot instead of a comma for better readability
        if (i === newLength - 1) {
            scoresToRender = scoresToRender + '.'
        } else {
            scoresToRender = scoresToRender + ', '
        }
    }

    // Format and return the final string.
    return (
        match.endTime +
        ' - ' +
        match.plr1name +
        ' and ' +
        match.plr2name +
        ':' +
        scoresToRender +
        ' Winner: ' +
        match.winnerName
    )
}

function addToResultList(string) {
    // Function for adding a string to the ordered list "results-container"
    // Create a new li element, set the innerHTML to the string gotten and append it to the results-container
    let element = document.createElement('li')
    element.innerHTML = string
    resultsContainer.appendChild(element)
}
