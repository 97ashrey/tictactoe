function AiWrapper(humanP, aiP){
   const humanPlayer = humanP;
   const aiPlayer = aiP;

   function Winning(board,input){
      if (
         (board[0] == input && board[1] == input && board[2] == input) ||
         (board[3] == input && board[4] == input && board[5] == input) ||
         (board[6] == input && board[7] == input && board[8] == input) ||
         (board[0] == input && board[3] == input && board[6] == input) ||
         (board[1] == input && board[4] == input && board[7] == input) ||
         (board[2] == input && board[5] == input && board[8] == input) ||
         (board[0] == input && board[4] == input && board[8] == input) ||
         (board[2] == input && board[4] == input && board[6] == input)
         ) {
         return true;
         } else {
         return false;
         }
   }

   function GetEmptyFields(board){
      // logic
      const regEx = /\d/;
      return board.filter(s => regEx.test(s));
   }

   function MiniMax(board, input){
      // get available fields
      const availFields = GetEmptyFields(board);
   
      // Check for termination
      if(Winning(board,humanPlayer)){
         return {score: -10};
      } else if(Winning(board,aiPlayer)){
         return {score: 10};
      } else if(availFields.length === 0){
         return {score: 0};
      }

      // Store the moves in an array
      const moves = [];

      // Check all available fields against input and store each move
      for(let i=0; i<availFields.length; i++){
         const move = {};
         move.index = board[availFields[i]];

         // Input to board
         board[availFields[i]] = input;

         // If ai player do the minimax for human imput
         if(input === aiPlayer){
            const result = MiniMax(board,humanPlayer);
            move.score = result.score;
         } else {
            const result = MiniMax(board,aiPlayer);
            move.score = result.score;
         }

         // reset the board
         board[availFields[i]] = move.index;

         moves.push(move);
      }

      // find the best move
      let bestMove;
      if(input === aiPlayer){
         let bestScore = -1000;
         for(let i=0; i<moves.length; i++){
            if(moves[i].score > bestScore){
               bestScore = moves[i].score;
               bestMove = i;
            }
         }
      } else{
         let bestScore = 1000;
         for(let i=0; i<moves.length; i++){
            if(moves[i].score < bestScore){
               bestScore = moves[i].score;
               bestMove = i;
            }
         }
      }


      return moves[bestMove];
   }

   return {
      GetP: function(){
         console.log('inputs', humanPlayer, aiPlayer);
      },
      Turn: function(currentinput){
         if(currentinput === aiPlayer)
            return true;
         return false;
      },
      GetMove: function(board,index){
         // Make a copy of the board
         const newBoard = [];
         for(let i=0; i<board.length; i++){
            let pushVal = (board[i]==='')? i: board[i];
            newBoard.push(pushVal);
         }
         // const newBoard = ['o',1 ,'x','x',4,'x', 6 ,'o','o'];
         console.log(newBoard);
         return MiniMax(newBoard,aiPlayer,index).index;
      }
   }
}