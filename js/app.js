// APP

const App = (function(UI,PM,PF){
   const dataId = UI.GetDataId();
   const UISelectors = UI.GetUISelectors();
   const drawLinePositions = UI.GetDrawLinePositions();
   const Class = UI.GetClass();
   const ID = UI.GetID();
   
   const winningTurn = 5;
   const drawTurn = 9;
   let turnNumber = 0;

   let singlePlayer = false;
   let aiWrapper = null;
   let fieldLocked = false;

   // Load Events
   function LoadEvents(){
      // Screen Click Event will handle events for many elements
      document.querySelector(UISelectors.screen).addEventListener('click',OnScreenClick);    
   }

   function OnScreenClick(e){
      // console.log(e.target);
      if(e.target.classList.contains(Class.choice)){
         // Function for handling choice events by sending data-id to it
         const choiceId = e.target.dataset.id;
         HandleChoiceClick(choiceId);
      } 
      // If field is not locked handle field clicks
      else if(!fieldLocked && e.target.className === Class.field){
         HandleFieldClick(e.target);
      }
   }
   
   // Handle choice click
   function HandleChoiceClick(id){
      // console.log(id)
      if (id === dataId.onePlayer || id === dataId.twoPlayer) {
         // Check for single player
         singlePlayer = (id === dataId.onePlayer) ? true : false;
         UI.navigation.ToXO();
      } else if (id === dataId.x || id === dataId.o) {
         // Clicked on X or O
         UI.navigation.ToPlayingField();
         HandlePLayerCreation(id);
      } else if (id === dataId.back) {
         // Clicked on back
         UI.navigation.ToMainMenu();
      }
      else if (id === dataId.reset) {
         // Reset game
         // UI.navigation.ToMainMenu();
         window.location.reload();
      }
   }

   // Handle player creation
   function HandlePLayerCreation(input){
      PM.CreatePlayers(input,ID.pOneScore,ID.pTwoScore);
      UI.ShowPlayerTurn(PM.GetCurrentPlayer().id);
      if(singlePlayer){
         console.log('AI CONTROLLS PLAYER 2');
         aiWrapper = new AiWrapper(PM.GetPlayerOne().input, PM.GetPlayerTwo().input);
         if(aiWrapper.Turn(PM.GetCurrentPlayer().input)){
            HandleAi();
         } 
      }
   }

   // Handle field click
   function HandleFieldClick(el_field){  
      // Get field index;
      const index = GetChildElementIndex(el_field);
      // Handle setting the field
      const fieldSet = HandleFieldInput(el_field, index);
      // If the field wasn't set break out of the function
      if(!fieldSet)
         return;
      // Increment turn Number
      turnNumber++;
      // If it's the fift turn we can start the game over checks
      if(turnNumber >= winningTurn){
         // Check if the game is over
         const over = GameOver(index, PM.GetCurrentPlayer().input);
         // break out of the function
         if(over)
            return;
      }
      // Change the currentPlayer
      HandleCurrentPlayerChange(index);
   }

   // Handle input to fields
   function HandleFieldInput(el_field, index){
      // Check if Field is Set
      if(PF.CheckField(index)){
         // Show some warning that the field is set
         UI.ShowOverlay('That field is already set',null);
         // Break out of the function
         return false;
      }
      // Get currentPlayer input
      const input = PM.GetCurrentPlayer().input;
      // Set input to playing field
      PF.SetField(index,input);
      // Set the UI field
      UI.SetField(el_field, input);
      return true;
   }

   // Handles all the UI before the currentPlayer is changed
   // Like showing who plays on the next turn etc...
   function HandleCurrentPlayerChange(){
      PM.ChangeCurrentPlayer();
      // Mark the correct player
      UI.ShowPlayerTurn(PM.GetCurrentPlayer().id);
      // Check if it's the AI's turn to play
      if(singlePlayer && aiWrapper.Turn(PM.GetCurrentPlayer().input)){
         HandleAi();
      } 
   }

   function HandleAi(){
      // lock the field
      LockField();
      setTimeout(() => {
         const index = aiWrapper.GetMove(PF.GetFields());
         const fields = UI.GetFields();
         HandleFieldClick(fields[index]);
         // unlock it
         UnlockField();
      }, 500);
   }

   function LockField(){
      fieldLocked = true;
      UI.LockField();
   }

   function UnlockField(){
      fieldLocked = false;
      UI.UnlockField();
   }

   // Get the index of the element
   function GetChildElementIndex(el_child) {
      let children = el_child.parentElement.children;
      children = Array.from(children);
      return children.indexOf(el_child);
   }

   function GameOver(index,pInput){
      const gameOverProperties = PF.LookForWinner(index, pInput, drawLinePositions);
      if(!gameOverProperties.gameOver){
         if(turnNumber === drawTurn){
            UI.ShowOverlay('It was a draw',() =>{
               // Reset turn number
               turnNumber = 0;
               // Clear UI
               UI.ClearField();
               // Clear data
               PF.ClearField();
               // Set the current player back to one one who has X as input
               NewRound(); 
            });
            return true;
         }
         return false;
      }
      // Draw the line then display the winner
      UI.DrawLine(gameOverProperties.drawPosition,()=>{
         // CALLBACK
         const currentPlayer = PM.GetCurrentPlayer();
         UI.ShowOverlay(`${currentPlayer.name} won`, ()=>{
            // Reset turn number
            turnNumber = 0;
            // Clear UI
            UI.ClearField();
            // Clear data
            PF.ClearField();
            // update score
            PM.UpdateScore();
            // Update score in UI
            UI.UpdateScore(currentPlayer.score, currentPlayer.id);
            // Erase the line
            UI.EraseLine();
            // Start the new round
            NewRound(); 
         });
      })

      return true;    
   }

   function NewRound(){
      // Show the message
      UI.ShowOverlay('Get ready for a new round',()=>{
         // Set current player to player with input x
         PM.SetCurrentPlayer();
         UI.ShowPlayerTurn(PM.GetCurrentPlayer().id);
         // If it's Ai's turn activate it
         if(singlePlayer && aiWrapper.Turn(PM.GetCurrentPlayer().input)){
            HandleAi();
         } 
      })
   }

   // Public
   return {
      init: function(){
         LoadEvents();
      }
   }
})(UI,PM,PF);

App.init();


