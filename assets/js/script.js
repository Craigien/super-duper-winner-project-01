// Global variables

// Containers
var welcomeContainerEl = document.querySelector("#welcome");
var gameContainerEl = document.querySelector("#game-container");
var fundsContainerEl = document.querySelector("#funds");
var displayScoresContainerEl = document.querySelector("#display-scores");

// Buttons
var startGameButton = document.querySelector("#start-game");
var viewScoresButton = document.querySelector("#view-scores");
var clearScoresButton = document.querySelector("#clear-scores");

var hitStayButtons = document.querySelector("#hit-stay-buttons");

// Stores deck ID
// Temporarily set static deck ID for testing
var deckID = "qwkncmc9ukhc";

var roundScore;
var currentUserHandValue;
var currentDealerHandValue;
// var cardValue;

var totalFunds;
var betAmount;

const initialDealCardCount = 2;

var imgTestEl = document.querySelector("#img-test");


function init()
{
    // Hide HTML elements
    // gameContainerEl.hidden = true;
    fundsContainerEl.hidden = true;
    displayScoresContainerEl.hidden = true;

    // Add event listeners
    startGameButton.addEventListener("click", startGame);
    viewScoresButton.addEventListener("click", viewScores);

    clearScoresButton.addEventListener("click", clearScores);

    hitStayButtons.children[0].addEventListener("click", hit);
    hitStayButtons.children[1].addEventListener("click", stay);

    // Set total funds

    if (localStorage.getItem("Total funds") === null)
    {
        totalFunds = window.prompt("Please input total available funds");

        localStorage.setItem("Total funds", totalFunds);
    }
}

// Get deck of cards from API
function getDeck()
{
    var deckofCardsRequestURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

    fetch(deckofCardsRequestURL)
        .then(function (response)
        {
            return response.json();
        })
        .then(function (data)
        {
            console.log(data);
            deckID = data.deck_id;
            console.log(deckID);
        });
}

// Draw a card from deck
async function drawCard()
{
    var drawCardRequestURL = 'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1';

    console.log(drawCardRequestURL);
    
    fetch(drawCardRequestURL)
        .then(function (response)
        {
            return response.json();
        })
        .then(function (data)
        {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(data);

                    var card = data.cards[0].image;
                    console.log(card);

                    // Display card
                    var testImg = document.createElement("img");
                    testImg.setAttribute("src", card);

                    imgTestEl.appendChild(testImg);

                    // Get card value
                    var cardValue = 0;

                    cardValue = data.cards[0].value;

                    // Determine card value as number

                    // Check if card is face card and change value to number
                    if (cardValue == "ACE")
                    {
                        // Check current score to see if ace will be worth 1 or 11
                        console.log("Ace");

                        cardValue = 11;
                    }

                    else if (cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING")
                    {
                        cardValue = 10;
                    }

                    parseInt(cardValue);

                    console.log("Card value: " + cardValue);

                    // return cardValue;

                    resolve(cardValue);
                }, 1000)
            })
            
        });
}

// Shuffles card deck using cardID
function shuffleDeck()
{
    var suffleCardRequest = 'https://deckofcardsapi.com/api/deck/' + deckID + '/shuffle/';

    fetch(suffleCardRequest)
        .then(function (response)
        {
            return response.json();
        });
}

// Calculate hand values and determine winner
function determineWinner()
{
    // Calculate scores

    console.log("Current hand value: " + currentUserHandValue);

    // suffleDeck();
}

// Draw another card
async function hit()
{
    // Will draw card and return value
    var drawnCardValue = await drawCard();
    console.log("Drawn card value after hit: " + drawnCardValue);

    currentUserHandValue = parseInt(currentUserHandValue) + drawnCardValue;
    console.log("Current hand value: " + currentUserHandValue);

    // Check if currentUserHandValue is equal to or over 21
    if (currentUserHandValue === 21)
    {
        // Win function
    }

    else if (currentUserHandValue >> 21)
    {
        // Lose function
    }
}

// Determine winner
function stay()
{
    // determineWinner();
}

function win()
{
    // Display modal with win text

    totalFunds = totalFunds + (betAmount * 2);
}

function lose()
{
    // Display modal with lose text

    totalFunds = totalFunds - betAmount;
}

function roundStart()
{
    // Need to figure out how to have asynchronous functions wait for results before continuing

    drawCard();

    var userInitialCard1;

    var userInitialCard2;

    var userInitialTotalCardsValue;

    var secondsLeft = 2;

    var timerInterval = setInterval(function() {
        secondsLeft--;
        console.log("Time left: " + secondsLeft);
    
        if(secondsLeft === 0) {
            // Stops execution of action at set interval
            clearInterval(timerInterval);
            userInitialCard1 = calculateCardValue();
            userInitialTotalCardsValue = userInitialTotalCardsValue + userInitialCard1;
            console.log("User's initial value: " + userInitialTotalCardsValue);

            secondsLeft = 2;

            var timer2Interval = setInterval(function() {
                secondsLeft--;
                console.log("Time left: " + secondsLeft);
            
                if(secondsLeft === 0) {
                    // Stops execution of action at set interval
                    clearInterval(timer2Interval);
                    userInitialTotalCardsValue = userInitialTotalCardsValue + userInitialCard1;
                    console.log("User's initial value: " + userInitialTotalCardsValue);
                }
            
            }, 1000);
        }
    
      }, 1000);
}

function placeBet()
{
    // Get total funds from local storage

    // Ask for bet amount from user
    // Use a form in a modal?

    betAmount = window.prompt("How much would you like to bet?");

    localStorage.setItem("Bet amount", betAmount);

    totalFunds = totalFunds - betAmount;

    localStorage.setItem("Total funds", totalFunds);

    roundStart();
}

function viewScores()
{
    displayScoresContainerEl.hidden = false;

    // Need to add return button to HTML


}

function clearScores()
{
    // Remove scores from local storage
}

function startGame()
{
    // Hide/Show HTML elements
    roundScore = 0;
    currentUserHandValue = 0;
    currentDealerHandValue = 0;
    // cardValue = 0;
    betAmount = 0;

    roundStart();

    // placeBet();
    
    // getDeck();
}

init();