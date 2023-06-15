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
// Set temporary deck ID for testing
var deckID = "4vkeflnrjea6";

var roundScore;
var currentUserHandValue;
var currentDealerHandValue;

// Prefer to not have card value as global variable
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
        // Need modal for this
        totalFunds = window.prompt("Please input total available funds");

        localStorage.setItem("Total funds", totalFunds);
    }
}

// Get deck of cards from API
function getDeck()
{
    const deckofCardsRequestURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

    fetch(deckofCardsRequestURL)
        .then(function (response)
        {
            return response.json();
        })
        .then(function (data)
        {
            console.log(data);

            // Get deck ID from API
            deckID = data.deck_id;
            console.log(deckID);

            // Add DeckID to local storage
            localStorage.setItem("DeckID", deckID);
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
    var shuffleCardRequest = 'https://deckofcardsapi.com/api/deck/' + deckID + '/shuffle/';

    fetch(shuffleCardRequest)
        .then(function (response)
        {
            console.log("Shuffled deck " + deckID);
            return response.json();
        });
}

// Calculate hand values and determine winner
function determineWinner()
{
    // Calculate scores

    console.log("Current hand value: " + currentUserHandValue);

    if (currentUserHandValue >> currentDealerHandValue)
    {
        win();
    }

    else if (currentUserHandValue << currentDealerHandValue)
    {
        lose();
    }

    // Shuffles deck for next round
    shuffleDeck();
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
        win();
    }

    else if (currentUserHandValue >> 21)
    {
        lose();
    }
}

// Determine winner
function stay()
{
    determineWinner();
}

function win()
{
    // Display modal with win text

    console.log("Congradulations your win " + (betAmount * 2) + " dollars");

    totalFunds = totalFunds + (betAmount * 2);

    localStorage.setItem("Total funds", totalFunds);

    
}

function lose()
{
    // Display modal with lose text

    console.log("Sorry you lost " + betAmount + " dollars");

    totalFunds = totalFunds - betAmount;

    localStorage.setItem("Total funds", totalFunds);
}

async function roundStart()
{
    // Need to figure out how to have asynchronous functions wait for results before continuing

    try {

    const userInitialCard1 = await drawCard();
    const userInitialCard2 = await drawCard();

    currentUserHandValue = userInitialCard1 + userInitialCard2;

    const dealerInitialCard1 = await drawCard();
    const dealerInitialCard2 = await drawCard();

    currentDealerHandValue = dealerInitialCard1 + dealerInitialCard2;

    console.log("User initial cards value: " + currentUserHandValue);
    console.log("Dealer initial cards value: " + currentDealerHandValue);
    }

    catch (error)
    {
        console.log(error);
    }


    /*
    var secondsLeft = 5;

    var timerInterval = setInterval(function()
    {
        secondsLeft--;
        console.log("Time left: " + secondsLeft);

        if (secondsLeft === 0)
        {
            clearInterval(timerInterval);

            console.log("User card 1 value: " + cardValue);

            var userInitialCard1 = cardValue;

            
            currentUserHandValue = userInitialCard1 + userInitialCard2;
            currentDealerHandValue = dealerInitialCard1 + dealerInitialCard2;

            console.log("User initial cards value: " + currentUserHandValue);
            console.log("Dealer initial cards value: " + currentDealerHandValue);
            
        }

    }, 1000);
    */
}

function placeBet()
{
    // Get total funds from local storage

    // Ask for bet amount from user
    // Use a form in a modal?

    totalFunds = JSON.parse(localStorage.getItem("Total funds"));
    parseInt(totalFunds);

    // Get be amount for game from user and make sure that it is less than or equal to total available funds
    do
    {
        betAmount = window.prompt("How much would you like to bet?");
        parseInt(betAmount);
    }
    while (betAmount > totalFunds && betAmount >> 0);

    // Remove bet amount from total funds and set local storage value
    totalFunds = totalFunds - betAmount;

    localStorage.setItem("Total funds", totalFunds);

    roundStart();
}

// This should become view funds
function viewScores()
{
    displayScoresContainerEl.hidden = false;

    // Need to add return button to HTML


}

// This should become clear funds
function clearScores()
{
    // Remove scores from local storage
}

function startGame()
{
    // Hide/Show HTML elements
    startGameButton.hidden = true;
    viewScoresButton.hidden = true;


    roundScore = 0;
    currentUserHandValue = 0;
    currentDealerHandValue = 0;
    // cardValue = 0;
    betAmount = 0;

    // This needs to finish execution before continuing
    /*
    if (localStorage.getItem("DeckID") === null)
    {
        getDeck();
    }

    else
    {
        deckID = localStorage.getItem("DeckID");
        shuffleDeck();
    }
    */

    placeBet();
}

init();

shuffleDeck();