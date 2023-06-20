// Global variables


// Containers
var welcomeContainerEl = document.querySelector("#welcome");
var gameContainerEl = document.querySelector("#game-container");
var fundsContainerEl = document.querySelector("#funds");
var displayFundsContainerEl = document.querySelector("#view-funds-container");
var usernameSpanEl = document.querySelector("#username-text");
var locationSpanEl = document.querySelector("#location-text");
var totalFundsViewEl = document.querySelector("#funds-amount");

// Buttons
var startGameButton = document.querySelector("#quick");
var viewFundsButton = document.querySelector("#view");
var clearFundsButton = document.querySelector("#clear-funds-button");
var returnFromFundsButton = document.querySelector("#return-button");

var hitStayButtons = document.querySelector("#hit-stay-buttons");
var hitButton = document.querySelector("#hit");
var stayButton = document.querySelector("#stay");

var quitGameButton = document.querySelector("#quit");

// Card image elements
var userCardImageDivEl = document.querySelector("#your-cards");
var dealerCardImageDivEl = document.querySelector("#dealer-cards");

// Modals
var winModalEl = new bootstrap.Modal(document.querySelector("#win-modal"));
var winModalTextEl = document.querySelector("#win");
var loseModalEl = new bootstrap.Modal(document.querySelector("#lose-modal"));
var loseModalTextEl = document.querySelector("#lose");
var tieModalEl = new bootstrap.Modal(document.querySelector("#tie-modal"));
var tieModelTextEl = document.querySelector("#tie");

var usernameModalEl = new bootstrap.Modal(document.querySelector("#username-modal"));
var usernameSubmitButton = document.querySelector("#username-submit");
var usernameInput = document.querySelector("#username");

var totalFundsModalEl = new bootstrap.Modal(document.querySelector("#total-funds-modal"));
var totalFundsSubmitButton = document.querySelector("#total-funds-submit");
var totalFundsInput = document.querySelector("#total-funds");

var betAmountModalEl = new bootstrap.Modal(document.querySelector("#bet-amount-modal"));
var betAmountSubmitButton = document.querySelector("#bet-amount-submit");
var betAmountInput = document.querySelector("#bet-amount");

// Stores deck ID
var deckID;

// Stores current card hand values
var currentUserHandValue;
var currentDealerHandValue;

// Arrays to hold card images
var userCardImages = [];
var dealerCardImages = [];

// Boolean value to determine if user is receiving card or dealer
var userCardDeal;

// Holds number of cards user has
var userCardCount;

// Stores total available funds
var totalFunds;

// Stores bet amount for each game
var betAmount;

const numberOfCardsAtStart = 2;

// Run on page load
function init()
{
    // Hide HTML elements
    gameContainerEl.hidden = true;
    fundsContainerEl.hidden = true;
    displayFundsContainerEl.hidden = true;

    // Add event listeners
    startGameButton.addEventListener("click", startGame);
    viewFundsButton.addEventListener("click", viewFunds);
    clearFundsButton.addEventListener("click", clearFunds);
    returnFromFundsButton.addEventListener("click", reset);
    usernameSubmitButton.addEventListener("click", saveUsername);
    totalFundsSubmitButton.addEventListener("click", saveTotalFunds);
    betAmountSubmitButton.addEventListener("click", placeBet);

    hitButton.addEventListener("click", hit);
    stayButton.addEventListener("click", stay);

    quitGameButton.addEventListener("click", reset);

    if (localStorage.getItem("Username") === null)
    {
        getUsername();
    }

    if (localStorage.getItem("DeckID") === null)
    {
        getDeck();
    }

    else
    {
        deckID = localStorage.getItem("DeckID");
    }

    if (localStorage.getItem("Total funds") === null || localStorage.getItem("Total funds") <= 0)
    {
        getFunds();
    }

    getLocation();
}

// Call geolocation API to get user location
function getLocation()
{
    var locationRequestUrl = "https://get.geojs.io/v1/ip/geo.json";
    fetch(locationRequestUrl)
        .then(function (response)
        {
            return response.json();
        })
        .then(function (data)
        {
            var city = data.city;
            var state = data.region;

            usernameSpanEl.textContent = localStorage.getItem("Username");
            locationSpanEl.textContent = city + ", " + state;
        });
}

// Show get username modal
function getUsername()
{
    usernameModalEl.show();
}

// Get username input from form in modal and save to local storage
function saveUsername(event)
{
    event.preventDefault();

    localStorage.setItem("Username", usernameInput.value);
    reset();
}

// Show get funds modal
function getFunds()
{
    totalFundsModalEl.show();
}

// Get total funds from form in modal and save to local storage
function saveTotalFunds(event)
{
    event.preventDefault();

    localStorage.setItem("Total funds", totalFundsInput.value);
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
    
    var response = fetch(drawCardRequestURL)
        .then(function (response)
        {
            return response.json();
        })
        .then(function (data)
        {
            var card = data.cards[0].image;

            if (userCardDeal)
            {
                userCardImages.push(card);
            }

            else if (!userCardDeal)
            {
                dealerCardImages.push(card);
            }

            // Get card value
            var cardValue = 0;

            cardValue = data.cards[0].value;

            // Determine card value as number

            // Check if card is face card and change value to number
            if (cardValue == "ACE")
            {
                cardValue = 11;
            }

            else if (cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING")
            {
                cardValue = 10;
            }

            return parseInt(cardValue);
        });
        
    return response;
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
    // Append images of dealer cards
    for (var i = 0; i < numberOfCardsAtStart; i++)
    {
        dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
    }

    // Calculate scores

    console.log("Current user hand value: " + currentUserHandValue);
    console.log("Current dealer hand value: " + currentDealerHandValue);

    if (currentUserHandValue == currentDealerHandValue)
    {
        tie();
    }

    else if (currentUserHandValue > currentDealerHandValue)
    {
        win();
    }

    else if (currentUserHandValue < currentDealerHandValue)
    {
        lose();
    }
}

// Checks for win or lose condition after cards are drawn
function checkForWinner()
{
    if (currentUserHandValue == 21 && currentDealerHandValue == 21)
    {
        tie();

        // Append images of dealer cards
        for (var i = 0; i < numberOfCardsAtStart; i++)
        {
            dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
        }
    }

    else if (currentUserHandValue == 21)
    {
        win();

        // Append images of dealer cards
        for (var i = 0; i < numberOfCardsAtStart; i++)
        {
            dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
        }
    }

    else if (currentUserHandValue > 21)
    {
        lose();

        // Append images of dealer cards
        for (var i = 0; i < numberOfCardsAtStart; i++)
        {
            dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
        }
    }

    else if (currentDealerHandValue == 21)
    {
        lose();

        // Append images of dealer cards
        for (var i = 0; i < numberOfCardsAtStart; i++)
        {
            dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
        }
    }

    else if (currentDealerHandValue > 21)
    {
        win();

        // Append images of dealer cards
        for (var i = 0; i < numberOfCardsAtStart; i++)
        {
            dealerCardImageDivEl.children[i].setAttribute("src", dealerCardImages[i]);
        }
    }
}

// Draw another card
async function hit()
{
    // Will draw card and return value
    var drawnCardValue = await drawCard();

    currentUserHandValue = parseInt(currentUserHandValue) + drawnCardValue;
    console.log("Current hand value: " + currentUserHandValue);

    userCardCount++;

    // Append image of card

    var cardImage = document.createElement("img");
    cardImage.setAttribute("src", userCardImages[userCardCount - 1]);

    userCardImageDivEl.appendChild(cardImage);

    // Check if currentUserHandValue is equal to or over 21
    checkForWinner();
}

// Determine winner
function stay()
{
    determineWinner();
}

// Win condition
function win()
{
    hitButton.hidden = true;
    stayButton.hidden = true;
    
    // Display modal with win text
    winModalTextEl.textContent = "Congradulations, you win " + (betAmount * 2) + " dollars";
    winModalEl.show();

    totalFunds = totalFunds + (betAmount * 2);

    localStorage.setItem("Total funds", totalFunds);
}

// Lose condition
function lose()
{
    hitButton.hidden = true;
    stayButton.hidden = true;

    // Display modal with lose text
    if (betAmount <= 1)
    {
        loseModalTextEl.textContent = "Sorry you lost " + betAmount + " dollar";
        loseModalEl.show();
    }

    else
    {
        loseModalTextEl.textContent = "Sorry you lost " + betAmount + " dollars";
        loseModalEl.show();
    }
}

// Tie condition
function tie()
{
    hitButton.hidden = true;
    stayButton.hidden = true;

    // Display modal with tie text
    if (betAmount <= 1)
    {
        tieModelTextEl.textContent = "Game is tied.  " + betAmount + " dollar is being returned to your total funds";
        tieModalEl.show();
    }

    else
    {
        tieModelTextEl.textContent = "Game is tied.  " + betAmount + " dollars are being returned to your total funds";
        tieModalEl.show();
    }

    totalFunds = parseInt(totalFunds) + parseInt(betAmount);

    localStorage.setItem("Total funds", totalFunds);
}

// Return to main menu if user wants to quit during game or after completion
function reset()
{
    location.reload();
}

// Draws cards for user and dealer
async function roundStart()
{
    totalFunds = parseInt(localStorage.getItem("Total funds"));

    // Display bet amount and total funds
    fundsContainerEl.children[0].children[0].textContent = "Current Bet: $" + betAmount;
    fundsContainerEl.children[1].children[0].textContent = "Total Funds: $" + totalFunds;

    // Draw two cards for dealer
    userCardDeal = false;

    for (var i = 0; i < numberOfCardsAtStart; i++)
    {
        var dealerInitialCard = await drawCard();
        currentDealerHandValue = currentDealerHandValue + dealerInitialCard;
        userCardCount++;
    }

    // Draw two cards for user
    userCardDeal = true;

    for (var i = 0; i < numberOfCardsAtStart; i++)
    {
        var userInitialCard = await drawCard();
        currentUserHandValue = currentUserHandValue + userInitialCard;
    }

    console.log("Dealer initial cards value: " + currentDealerHandValue);
    console.log("User initial cards value: " + currentUserHandValue);

    // Append images of user cards
    for (var i = 0; i < numberOfCardsAtStart; i++)
    {
        var cardImage = document.createElement("img");
        cardImage.setAttribute("src", userCardImages[i]);

        userCardImageDivEl.appendChild(cardImage);
    }

    checkForWinner();
}

// Displays modal to place bet at start of game
function placeBet(event)
{
    // Get total funds from local storage
    totalFunds = JSON.parse(localStorage.getItem("Total funds"));
    parseInt(totalFunds);

    // Ask for bet amount from user
    event.preventDefault();

    betAmount = betAmountInput.value;

    parseInt(betAmount);

    // Remove bet amount from total funds and set local storage value
    totalFunds = totalFunds - betAmount;

    localStorage.setItem("Total funds", totalFunds);

    roundStart();
}

// View user's total funds
function viewFunds()
{
    displayFundsContainerEl.hidden = false;

    if (localStorage.getItem("Total funds") === null)
    {
        totalFundsViewEl.textContent = "Total funds: $0";
    }

    else
    {
        totalFundsViewEl.textContent = "Total funds: $" + localStorage.getItem("Total funds");
    }
}

// Remove funds from local storage
function clearFunds()
{
    // Remove funds from local storage
    if (localStorage.getItem("Total funds") !== null)
    {
        localStorage.removeItem("Total funds");
        totalFundsViewEl.textContent = "Total funds: $0";
    }
}

// Sets initial values and begins game
function startGame()
{
    // Hide/Show HTML elements
    startGameButton.hidden = true;
    viewFundsButton.hidden = true;
    fundsContainerEl.hidden = false;

    gameContainerEl.hidden = false;

    hitButton.hidden = false;
    stayButton.hidden = false;

    // Set values to 0
    roundScore = 0;
    currentUserHandValue = 0;
    currentDealerHandValue = 0;
    betAmount = 0;
    userCardCount = 0;

    // Remove any card images from previous game from arrays
    userCardImages = [];
    dealerCardImages = [];

    // Shuffle deck and have user place bet
    shuffleDeck();

    // Asks for user to input bet amount
    betAmountModalEl.show();
}

init();