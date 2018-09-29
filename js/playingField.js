const PF = (function(){
   const width = 3;
   const fields = ['','','','','','','','',''];

   return {
      SetField: function(index, input){
         fields[index] = input;
      },
      GetFields: function(){
         return fields;
      },
      CheckField: function(index){
         // Tells if the field on the index is set or not
         if(fields[index] !== '')
            return true;
         return false;
      },
      LookForWinner: function(index,pInput,drawLinePositions){
         //turn index into rows and colls
         row = Math.floor(index/width);
         col = Math.abs(index-width*row);
         const gameOverProperties = {
            gameOver: false,
            drawPosition: ''
         }
         // look for winner
         // row checks
         for (let i = 0; i < width; i++) {
            console.log("Row Check")
            if (fields[width * row + i] !== pInput) {
               break;
            }
            if (i === width-1) {
               gameOverProperties.gameOver = true;
               gameOverProperties.drawPosition = `${drawLinePositions.row}${row+1}`;
               return gameOverProperties;
            }
         }

         for (let i = 0; i < width; i++) {
            console.log("Column check")
            if (fields[width * i + col] !== pInput) {
               break;
            }
            if (i === width-1) {
               gameOverProperties.gameOver = true;
               gameOverProperties.drawPosition = `${drawLinePositions.col}${col+1}`;
               return gameOverProperties;
            }
         }

         // Prim Diag Check
         if(col === row){
            for(let i=0; i<width; i++){
               if(fields[width*(i)+i] !== pInput){
                  break;
               }
               if(i === width-1){
                  gameOverProperties.gameOver = true;
                  gameOverProperties.drawPosition = `${drawLinePositions.diag}`;
                  return gameOverProperties;
               }
            }
         }

         // Side diag check
         if((col+row) === width-1){
            for(let i=0; i<width; i++){
               if(fields[width*(i)+(width-1-i)] !== pInput){
                  break;
               }
               if(i === width-1){
                  gameOverProperties.gameOver = true;
                  gameOverProperties.drawPosition = `${drawLinePositions.invDiag}`;
                  return gameOverProperties;
               }
            }
         }

         return gameOverProperties;
      },
      ClearField: function(){
         for(let i=0; i<fields.length; i++){
            fields[i]= '';
         }
      }
   }
})();