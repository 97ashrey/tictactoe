// Player Manager
const PM = (function(){
   const inputs = {
      x: 'x',
      o: 'o'
   }
   const playerNames = {
      pOne: 'Player I',
      pTwo: 'Player Two'
   }
   let currentPlayer = null;
   let players = [];

   
   
   return {
      CreatePlayers: function(pOneInput, pOneId, pTwoId){
         const pTwoInput = pOneInput.toLowerCase() === inputs.x? inputs.o: inputs.x;
         const player1 = new Player(pOneInput, playerNames.pOne, pOneId);
         const player2 = new Player(pTwoInput, playerNames.pTwo, pTwoId);
         players = [player1, player2];
         console.log('Players created');
         this.SetCurrentPlayer();
      },
      GetPlayerOne: function(){
         return players[0];
      },
      GetPlayerTwo: function(){
         return players[1];
      },
      SetCurrentPlayer: function(){
         currentPlayer = (players[0].input === inputs.x)? players[0]:players[1];
      },
      GetCurrentPlayer: function() {
         return currentPlayer;
      },
      ChangeCurrentPlayer: function(){
         currentPlayer = (currentPlayer===players[0])? players[1] : players[0];
      },
      UpdateScore: function (){
         currentPlayer.score ++;
      },
   }
})();

// Player constructor
class Player{
   constructor(input, name, id){
      this.input = input;
      this.score = 0;
      this.name = name;
      this.id = id;
   }
}


