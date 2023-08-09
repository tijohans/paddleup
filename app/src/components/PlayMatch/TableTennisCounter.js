export default class TableTennisCounter extends HTMLElement {
    static get observedAttributes() {
        return ['match']
    }

    constructor() {
        super()

        // Attach the shadow
        this.shadow = this.attachShadow({ mode: 'open' })

        // Initialize the match
        this.match = new Match()

        // Initialize the players
        this.player1 = new Player('Player 1')
        this.player2 = new Player('Player 2')

        this._newMatch()

        this._render()

        this._defineQuerySelectors()

        this._addEventListeners()

        this._newGame()

        this._renderScoreboard()

        // If show players attribute is true, render the player names.
        if (this.showPlayers) {
            this._renderNames()
        }

        // Hide the respective titles for the attributes if set to false
        if (!this.showSets) {
            this.gameStatsContainer.classList.add('hidden')
        }

        if (!this.showPreviousSets) {
            this.matchStatsContainer.classList.add('hidden')
        }
    }

    connectedCallback() {
        this._getAllAttributes()

        let matchString = this.getAttribute('match')
        this.match = JSON.parse(matchString)

        if (!this.match.games) {
            // If we are still waiting for players (or a match is not initialized properly) - disable the buttons, and set the names to ".."
            this.p1button.setAttribute('disabled', 'disabled')
            this.p2button.setAttribute('disabled', 'disabled')
            this.player1.name = '..'
            this.player2.name = '..'
            this._renderNames()
        } else {
            this.p1button.removeAttribute('disabled')
            this.p2button.removeAttribute('disabled')
            this.player1.name = this.match.plr1name
            this.player2.name = this.match.plr2name
            if (this.match.games[this.match.currentGame].plr1score) {
                this.player1.score = this.match.games[this.match.currentGame].plr1score
            }

            if (this.match.games[this.match.currentGame].plr2score) {
                this.player2.score = this.match.games[this.match.currentGame].plr2score
            }

            if (this.match.winner) {
                this._renderWinner()
            }

            this._renderNames()
            this._renderSets()
            this._renderScore()
            this._renderServe()
            this._renderScoreboard()
        }
    }

    /*   _attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue){
        if (name === "match"){
            let matchString = this.getAttribute("match");
            this.match = JSON.parse(matchString);
            console.log("CHANGED!!!")
            console.log(this.match);
            this.player1.name = this.match.plr1name;
            this.player2.name = this.match.plr2name;
            this._renderNames();
            this._renderSets();
            this._renderScore();
            this._renderServe();
            this._renderScoreboard();
        }
    }

  } */

    _defineQuerySelectors() {
        // Method for defining all the query selectors
        this.p1button = this.shadow.querySelector('#button-player1')
        this.p2button = this.shadow.querySelector('#button-player2')

        this.p1score = this.shadow.querySelector('#p1-score')
        this.p2score = this.shadow.querySelector('#p2-score')

        this.p1sets = this.shadow.querySelector('#p1-sets')
        this.p2sets = this.shadow.querySelector('#p2-sets')

        this.p1htmlname = this.shadow.querySelector('#p1-name')
        this.p2htmlname = this.shadow.querySelector('#p2-name')

        this.p1namecontainer = this.shadow.querySelector('#p1-namecontainer')
        this.p2namecontainer = this.shadow.querySelector('#p2-namecontainer')

        this.p1toggle = this.shadow.querySelector('#p1-toggle')
        this.p2toggle = this.shadow.querySelector('#p2-toggle')

        this.p1input = this.shadow.querySelector('#p1-input')
        this.p2input = this.shadow.querySelector('#p2-input')

        this.matchStatsContainer = this.shadow.querySelector('#matchstats')
        this.matchStats = this.shadow.querySelector('#matchstats-info')

        this.gameStatsContainer = this.shadow.querySelector('#gamestats')
        this.gameStats = this.shadow.querySelector('#gamestats-info')

        /*     this.resetButton = this.shadow.querySelector("#reset-button"); */

        this.winnerText = this.shadow.querySelector('#winner-text')
        this.winnerStats = this.shadow.querySelector('#winner-stats')

        this.counterContainer = this.shadow.querySelector('#counter')
        this.winnerContainer = this.shadow.querySelector('#winner')
        this.statsContainer = this.shadow.querySelector('#stats')
    }

    _addEventListeners() {
        // Method for adding all the event listeners

        if (this.showPlayers) {
            // ! Not used
            /*
            this.p1toggle.addEventListener("click", () => {
                // * ?.trim() source: https://codingbeautydev.com/blog/javascript-check-if-string-is-empty/
                let input = this.p1input.value;

                // Check that input does not include empty strings / strings with only spaces etc.
                if (!input?.trim()) {
                    input = "Player 1";
                }

                this.player1.name = input;
                this._renderNames();

                this.p1input.value = this.player1.name;
                this._toggleEditName(1);

            });

            this.p2toggle.addEventListener("click", () => {
                let input = this.p2input.value;

                if (!input?.trim()) {
                    input = "Player 2";
                }

                this.player2.name = input;
                this._renderNames();

                this.p2input.value = this.player2.name;
                this._toggleEditName(2);
            });

             this.p1htmlname.addEventListener("click", () => {console.
                this._toggleEditName(1);
            });

            this.p2htmlname.addEventListener("click", () => {
                this._toggleEditName(2);
            }); */
        }

        this.p1button.addEventListener('click', () => {
            this._gainPoint(1)
        })

        this.p2button.addEventListener('click', () => {
            this._gainPoint(2)
        })

        /*     this.resetButton.addEventListener("click", () => {
      this._resetMatch();
    }); */
    }

    _getAllAttributes() {
        // Method for getting all html attributes
        // When creating this part, I had some trouble.
        // Originally I was planning on using my stringToBool method like this:
        // this.showPlayers = this._stringToBool(this.getAttribute("showPlayers")) || true;
        // The problem with this, is that my method stringToBool will return false, if set false by string attribute
        // This will then trigger the || OR , which will automatically set (in this example) showPlayers to true.
        this.showPlayers = this._stringToBool(this.getAttribute('showplayers'))
        this.showSets = this._stringToBool(this.getAttribute('showsets'))
        this.showPreviousSets = this._stringToBool(this.getAttribute('showprevioussets'))

        // Because of this, I had to create a method which would strictly check if an input is true or false.
        // If it returns null as of missing attribute or bad attribute input, it will use the default setting instead.
        if (!this._checkBool(this.showPlayers)) {
            this.showPlayers = true
        }

        if (!this._checkBool(this.showSets)) {
            this.showSets = true
        }

        if (!this._checkBool(this.showPreviousSets)) {
            this.showPreviousSets = true
        }

        // For the other number based attributes, I made a check to make sure that the attribute was a number by using the isNaN function.
        // (For example, if someone writes bestof="test" - the script would not simply revert back to the standard number (11) if we had not checked the number. )
        this.setPoints = this.getAttribute('setpoints') // I made a custom attribute so you can change how many points there are per set (before it checks if a player is two points ahead).

        this.winBestOf = this.getAttribute('winbestof')
        this.serveRotation = this.getAttribute('serverotation')

        // If not a number or just simply null, use the default value instead.
        if (isNaN(this.winBestOf) || this.winBestOf === null) {
            this.winBestOf = 5
        }

        if (this.winBestOf % 2 == 0) {
            // A best of number needs to be an odd number to make sense.
            // I added an extra check to the winBestOf to check if the number inserted in the attribute is even.
            // * Code source: "% 2 == 0":
            // * https://www.programiz.com/javascript/examples/even-odd
            // If it is an even number it will add up the number to make it odd.
            this.winBestOf++
        }

        if (isNaN(this.serveRotation) || this.serveRotation === null) {
            this.serveRotation = 2
        }

        if (isNaN(this.setPoints) || this.setPoints === null) {
            this.setPoints = 11
        }
    }

    _checkBool(variable) {
        // Method for checking if something is either strictly true or false
        if (variable === true || variable === false) {
            return true
        }

        return false
    }

    _stringToBool(string) {
        // Method for converting string to boolean (for attributes)
        switch (string) {
            case 'true':
                return true
            case 'false':
                return false
            default:
                return null
        }
    }

    // ! Unused
    /*   _toggleEditName(plr) {
    // Method for toggling the edit name container when pressed on a name.
    if (plr === 1) {
      this.htmlname = this.shadow.querySelector("#p1-name");
      this.inputcontainer = this.shadow.querySelector("#p1-inputcontainer");
    } else {
      this.htmlname = this.shadow.querySelector("#p2-name");
      this.inputcontainer = this.shadow.querySelector("#p2-inputcontainer");
    }

    this.htmlname.classList.toggle("hidden");
    this.inputcontainer.classList.toggle("hidden");
  } */

    _renderScoreboard() {
        // Method for rendering the "scoreboard" container (current game and match stats)
        // Reset the html first, incase
        this.matchStats.innerHTML = ''
        this.gameStats.innerHTML = ''

        // If showsets is enabled, show the set under the "current set" of the scoreboard.
        if (this.showSets) {
            this.gameStats.innerHTML =
                this.match.games[this.match.currentGame].plr1score +
                ' | ' +
                this.match.games[this.match.currentGame].plr2score
        }

        // If showprevioussets is enabled, show the previous set under the "match sets" of the scoreboard.
        if (this.showPreviousSets) {
            let hasPlayed = false

            for (let i = 0; i < this.match.games.length; i++) {
                // Only render complete games in the match.
                if (this.match.games[i].complete) {
                    // Format a score string for rendering
                    let toRender =
                        this.match.games[i].plr1score + ' | ' + this.match.games[i].plr2score
                    // Create a li element to append to the ordered list in the scoreboard.
                    let listElement = document.createElement('li')
                    listElement.innerHTML = toRender
                    this.matchStats.appendChild(listElement)
                    // Check that there has been a game played so far
                    hasPlayed = true
                }
            }

            // If a game or more has been played, show the match stats title as "Match stats", if not - make it empty so it is 'hidden' for the first game.
            if (!hasPlayed) {
                this.matchStatsContainer.classList.add('hidden')
            } else {
                this.matchStatsContainer.classList.remove('hidden')
            }
        }
    }

    _render() {
        // Method for rendering the template in the shadow root
        this.shadow.innerHTML = this._getTemplate()
    }

    _getPlayerNameHTML(plr) {
        // Method for returning the correct player name container html
        return `
        <div id="p${plr}-namecontainer">
            <h1 id="p${plr}-name"></h1>
        </div>
        `
    }

    _newMatch() {
        // Method for creating a new match
        for (let i = 0; i < 5; i++) {
            this.match.games[i] = new Game()
        }
        this.match.currentGame = 0
        this.match.winner = 0
        this.match.endTime = null
        this.match.startTime = this._getDateAndTime()
    }

    _newGame() {
        // Method for creating a new set
        this._resetScore()
        this._renderScore()
        this._renderServe()
        this._renderSets()
    }

    _checkScore() {
        // Method for checking if players is over the set score limit
        if (this.player1.score >= this.setPoints || this.player2.score >= this.setPoints) {
            // If player score is over other player's score by 2, win the set.
            // Since I am checking if the score is "over" the player's score instead of equal and over, I only need to plus the other players score by one instead of two.
            if (this.player1.score > this.player2.score + 1) {
                this._winGame(1)
            } else if (this.player2.score > this.player1.score + 1) {
                this._winGame(2)
            }
        }
    }

    _resetScore() {
        // Method for resetting player's score.
        this.player1.score = 0
        this.player2.score = 0
    }

    _renderScore() {
        // Method for rendering player scores into HTML.
        this.p1score.textContent = 'Score: ' + this.player1.score
        this.p2score.textContent = 'Score: ' + this.player2.score
    }

    _renderSets() {
        // Method for rendering sets into HTML.
        this.p1sets.textContent = 'Sets won: ' + this._getGamesWon(1)
        this.p2sets.textContent = 'Sets won: ' + this._getGamesWon(2)
    }

    _renderNames() {
        // Method for rendering player names into HTML.
        this.p1htmlname.textContent = this.player1.name
        this.p2htmlname.textContent = this.player2.name
    }

    _renderServe() {
        // Method for rendering the serve emoji icon.
        // Checks the current match's serve player.
        if (this.match.games[this.match.currentGame].hasServe === 1) {
            this.p1htmlname.classList.add('serve')
            this.p2htmlname.classList.remove('serve')
        } else {
            this.p1htmlname.classList.remove('serve')
            this.p2htmlname.classList.add('serve')
        }
    }

    _gainPoint(plr) {
        // Method for gaining point as a player (button press).
        if (plr === 1) {
            this.player1.score++
        } else if (plr === 2) {
            this.player2.score++
        }

        // Define the score in the current game's score
        this.match.games[this.match.currentGame].plr1score = this.player1.score
        this.match.games[this.match.currentGame].plr2score = this.player2.score

        this._gameServeTick()
        this._checkScore()
        this._renderScore()
        this._renderScoreboard()
        this._updateMatchEvent()
    }

    _gameServeTick() {
        // Method for serving a 'serve tick', to check which player should have the serve
        // Variable for code readability
        let c = this.match.currentGame

        // Serve a tick for the game
        this.match.games[c].serveTick++

        // If at deuce, alternate every point
        // example if set points to win is 11, and there has been a tie 10-10
        let serveTickMax

        if (this.player1.score >= this.setPoints - 1 && this.player2.score >= this.setPoints - 1) {
            serveTickMax = 1
        } else {
            // If not, use the serveRotation attribute given.
            serveTickMax = this.serveRotation
        }

        // If the serve ticks are over the passed attribute number
        if (this.match.games[c].serveTick >= serveTickMax) {
            // Reset the ticks
            this.match.games[c].serveTick = 0
            // Alternate the serving player
            if (this.match.games[c].hasServe === 1) {
                this.match.games[c].hasServe = 2
            } else if (this.match.games[c].hasServe === 2) {
                this.match.games[c].hasServe = 1
            }

            this._renderServe()
        }
    }

    _resetMatch() {
        // Method for resetting the match completely
        // If the countercontainer is hidden, toggle the game view.
        // This is to toggle back the counter & score view when hidden by the renderWinner.
        if (this.counterContainer.classList.contains('hidden')) {
            this._toggleGameView()
        }

        // Set the reset button's text back to "Reset" if changed (by the renderWinner method)
        this.resetButton.innerHTML = 'Reset'

        this._resetScore()
        this._newMatch()
        this._renderSets()
        this._renderScore()
        this._renderServe()
        this._renderScoreboard()
        this._updateMatchEvent()
    }

    _getGamesWon(plr) {
        // Method for getting sets won by player
        let gamesWon = 0

        for (let i = 0; i < this.match.games.length; i++) {
            if (this.match.games[i].complete) {
                if (this.match.games[i].winner === plr) {
                    gamesWon++
                }
            }
        }

        return gamesWon
    }

    _getDateAndTime() {
        // Method for getting a formatted string with the current date and time
        // Get the current date, and create temp variables with only the required values.
        // Help and sources from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let currentDate = new Date()
        let year = currentDate.getFullYear()
        let month = currentDate.getMonth() + 1 // getMonth() returns as a zero-based value (starts at 0) - so we need to +1 to make it understandable
        let day = currentDate.getDate()
        let hours = currentDate.getHours()
        let minutes = currentDate.getMinutes()

        // If statements to add a 0 before the months, days, hours and minutes if they are under 10 for prettier readability
        if (day < 10) {
            day = '0' + day
        }

        if (month < 10) {
            month = '0' + month
        }
        if (hours < 10) {
            hours = '0' + hours
        }

        if (minutes < 10) {
            minutes = '0' + minutes
        }

        // Use the temp variables to format and return a string with the current date and time
        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes
    }

    _winGame(plr) {
        // Method for winning a set.
        // For code readability, I create a temp variable for the match's currentGame variable
        // (which shows which game is currently being played)

        let c = this.match.currentGame

        // Set the current sets winner and it being complete
        this.match.games[c].winner = plr
        this.match.games[c].complete = true

        // Define the score in the current set's score, for storage
        this.match.games[c].plr1score = this.player1.score
        this.match.games[c].plr2score = this.player2.score

        // Temporary variables for checking match win
        let winner = 0
        let hasWon = 0

        // Calculate "best of" score, divide by 2 and add up 0.5
        // (I tried finding a better way of calculating this but couldn't find any so I made my own.)
        let bestOf = this.winBestOf / 2 + 0.5

        // If player has enough sets won, player wins the game
        // (example: game is best of 5, if player has 3 or more they win)
        if (this._getGamesWon(1) >= bestOf) {
            hasWon = 1
            winner = 1
        } else if (this._getGamesWon(2) >= bestOf) {
            hasWon = 1
            winner = 2
        }

        if (hasWon === 1) {
            // If a match has been won, run the completeMatch method with the winner.
            this._completeMatch(winner)
        } else {
            // Plus up the match's currentGame variable
            this.match.currentGame++
            this._newGame()
        }
    }

    _completeMatch(winner) {
        // Method for completing a full match
        // Set the winner and the end time
        this.match.winner = winner
        this.match.endTime = this._getDateAndTime()

        // Finding and saving the winner name in the match array.
        if (this.match.winner === 1) {
            this.match.winnerName = this.player1.name
            this.match.winnerid = this.match.plr1id
        } else {
            this.match.winnerName = this.player2.name
            this.match.winnerid = this.match.plr2id
        }

        // Save the player names in the match obj
        // (There could be a change here to initialize the player as a part of the match,
        // but then I had to rewite some of the player score system. (To not having to transfer information from the player to the match etc.)
        this.match.plr1name = this.player1.name
        this.match.plr2name = this.player2.name

        // Render the "winner screen"
        this._renderWinner()
    }

    _renderWinner() {
        // Method for rendering the winner component and it's contents
        // Toggle the counter view and the "winner" view
        this._toggleGameView()

        // Render the win text
        this.winnerText.innerHTML = this.match.winnerName + ' has won the match!'

        // Render the final stats message.
        let finalString =
            this.player1.name +
            ' [' +
            this._getGamesWon(1) +
            ']' +
            ' vs ' +
            this.player2.name +
            ' [' +
            this._getGamesWon(2) +
            ']'
        this.winnerStats.innerHTML = finalString

        // Fire a custom event telling the match is finished
        this._finishMatchEvent()

        /* // ? Hide the reset button on match completion
    this.resetButton.classList.toggle("hidden"); */
    }

    _toggleGameView() {
        // Method for toggling the main containers to be hidden or not
        this.counterContainer.classList.toggle('hidden')
        this.winnerContainer.classList.toggle('hidden')
        this.statsContainer.classList.toggle('hidden')
    }

    _updateMatchEvent() {
        // ? New method for firing a match update custom event
        //console.log("Before fire:")
        //console.log(this.match)
        this.dispatchEvent(
            new CustomEvent('updatematch', {
                detail: {
                    match: this.match
                },
                bubbles: true
            })
        )
    }

    _finishMatchEvent() {
        // Method for firing a match finish custom event
        this.dispatchEvent(
            new CustomEvent('finishmatch', {
                detail: {
                    // We only need to send the whole match as it contains everything needed
                    match: this.match
                },
                bubbles: true
            })
        )
    }

    disconnectedCallback() {
        // Method when component gets disconnected from the DOM
        // Remove all event listeners
        this.p1button.removeEventListener('click', () => {})
        this.p2button.removeEventListener('click', () => {})
        /* this.resetButton.removeEventListener("click", () => {}); */
    }

    _getTemplate() {
        // Method for returning the full html template for the element
        return `
        ${this._getStyles()}      
        <div class="outer-container" id="counter">
            <div class="container" id="p1">
            ${this._getPlayerNameHTML(1)}
            <p id="p1-score">Score:</p>
            <p id="p1-sets">Sets won:</p>
            <button id="button-player1">Point</button>
            </div>

            <div class="container" id="net"></div>
            
            <div class="container" id="p2">
            ${this._getPlayerNameHTML(2)}
            <p id="p2-score">Score:</p>
            <p id="p2-sets">Sets won:</p>
            <button id="button-player2">Point</button>
            </div>
        </div>

        <div class="outer-container hidden" id="winner">
            <div class="container">
            <h1 id="winner-text" >Player wins the game!</h1>
            <p id="winner-stats"></p>
            </div>
        </div>

      <!-- <div class="outer-container" id="reset">
            <div class="container">
            <button id="reset-button">Reset</button>
            </div>            
        </div>-->

        <div class="outer-container" id="stats">
            <div class="container" id="gamestats">
                <h2 id="gamestats-title">Current game:</h2>
                <p id="gamestats-info"></p>
            </div>
            <div class="container" id="matchstats">
                <h2 id="matchstats-title">Match stats:</h2>
                <ol id="matchstats-info"></ol>               
            </div>
        </div>
        `
    }

    _getStyles() {
        // Method for returning css for the element
        return `
        <style>
            *{
                margin:0;
                padding:0;
            }
            
            :host,div,.outer-container{
                display:flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            
            :host{
                flex-direction:column;
            }
            
            div{
                flex-direction:column;
                color: var(--text-color,white);
            }
            
            .outer-container{
                flex-direction:row;
            }
            
            .container{
                background-color:var(--container-color, rgb(184,114,124));
                padding:25%;
            }
            
            .container #p1-name, .container #p2-name{
                height:3em;
                min-width:10em;

            }
            
            .input-container{
                width:2em;
            }
            
            #stats{
                align-items:normal;
                justify-content:space-evenly;
            }
            
            #stats .container{
                margin:2%;
                padding:10%;
            }
            
            #stats .container div{
            padding:5%;
            }
            
            #p1, #p2, #net{
                min-height:75%;
                margin:0%;
            }
            
            #p1, #p2{
                min-width:10em;
                max-width:10em;
                height:10em;
                background-color:var(--table-color, rgb(124,187,194));
            }
            
            #p1{
                border:5px solid var(--table-border-color, whitesmoke);
                border-right:none;
            }
            
            #p2{
                border:5px solid var(--table-border-color, whitesmoke);
                border-left:none;
            }
            
            #net{
                padding:1%;
                background-color:var(--table-net-color, rgb(64, 70, 73));
                min-height:23em;
                min-width:0.5em;
            }
            
            #winner div{
                min-width:27.8em;
                max-width:27.8em;
                height:6em;
                background-color:var(--table-color, rgb(124,187,194));
                border:5px solid var(--table-border-color, whitesmoke);
            }
            
            .hidden{
                display:none;
            }
            
            #reset div{
                background-color:unset;
            }
            
            .text-hover:hover{
                color:indianred;
                cursor:pointer;
            }
            
            button{
                border: none;
                background-color:var(--button-color,rgb(149,194,63));
                border:1px solid var(--button-border-color,rgb(60, 57, 57));
                border-radius:5%;
                padding:2% 10% 2% 10%;
                min-height:2em;
                min-width:2em;
            }
            
            #reset button {
                height:3em;
                width:6em;
            }
            
            button:active{
                background-color:var(--button-active-color,rgb(63, 122, 194));
            }
            
            .serve::before{
                content:url("/icons/match_paddle.svg");
            }
            
            form,button{
                margin:3%;
            }
            
            @media only screen and (max-width:800px){
                .outer-container{
                    flex-direction:column;
                }
                
                #p1, #p2{
                    padding:2em;
                }
                
                #p1{
                    border:5px solid var(--table-border-color, whitesmoke);
                    border-bottom:none;
                }
                
                #p2{
                    border:5px solid var(--table-border-color, whitesmoke);
                    border-top:none;
                }
                
                #net{
                    background-color:rgb(64, 70, 73);
                    min-height:0.5em;
                    min-width:17.5em;
                }
            
                #winner div{
                    min-width:25%;
                    max-width:25%;
                    height:8em;
                }

                .container #p1-name, .container #p2-name{
                    min-width:7em;
                }
            }
        </style>
        `
    }
}

// Class for game players
class Player {
    constructor(name) {
        this.score = 0
        this.name = name || 'Player'
        this.serves = 0
    }
}

// Class for individual games (sets)
export class Game {
    constructor() {
        this.hasServe = 1
        this.winner = 0
        this.complete = false
        this.serveTick = 0
        this.plr1score = 0
        this.plr2score = 0
    }
}

// Class for a match
export class Match {
    constructor() {
        // Create 5 sets in a match
        this.games = new Array()
        for (let i = 0; i < 5; i++) {
            this.games[i] = new Game()
        }
        this.currentGame = 0
        this.winner = 0
        this.startTime = null
        this.endTime = null
        this.plr1name = ''
        this.plr2name = ''
        this.plr1id = ''
        this.plr2id = ''
        this.winnerName = ''
        this.winnerid = ''
    }
}

customElements.define('tabletennis-counter', TableTennisCounter)
