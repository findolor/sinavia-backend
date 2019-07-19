# Rooms

Each game mode has a specific room

- Ranked Mode = Ranked Room
- Friend Mode = Friend Room
- Group Mode = Group Room

We will explore how these rooms operate and exchange information with the clients.

## Ranked Game Room

### In-Game Data Structure

#### State Structure

The match uses states to run the game.

Ranked state includes these attributes:

```
playerOneUsername // player's username for every player
playerTwoUsername	
playerOneId // player's client id
playerTwoId 
playerOneButton // player's choosen option
playerTwoButton
questionProps // All question related things (link, answer, question time)
playerOneAnswers // player's given answers
playerTwoAnswers
questionNumber // current question number
```

We manipulate these attributes in mid-game based on player inputs.

#### Action Structure


There are several actions in a game. 

- Sending **ready** signal to let the server know that user is ready to start the match
- Sending **finished** signal to let the server know that user finished the question
  - This action sends the choosen option information

##  Friend Game Room (TODO)

 ## Group Game Room (TODO)

