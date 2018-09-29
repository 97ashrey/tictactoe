// UI module
const UI = (function () {
   const dataId = {
      onePlayer: 'one-p',
      twoPlayer: 'two-p',
      x: 'x',
      o: 'o',
      back: 'back',
      reset: 'reset'
   }

   const ID = {
      screen : 'screen',
      menu : 'menu',
      mainMenu : 'main',
      XOMenu : 'x-or-o',
      back: 'back',
      window : 'window',
      playingField: 'playing-field',
      fieldContainer: 'field-container',
      pOneScore: 'player-one',
      pTwoScore: 'player-two',
      fieldHeader: 'field-header',
      score: 'score',
      resetBtnContainer: 'reset-btn-container'
   }

   const Class = {
      choices: 'choices',
      choice : 'choice',
      field: 'field',
      menuTitle: 'menu-title',
      hvrDashed: 'hvr-dashed',
      screenWH: 'screen-fw-fh',
      col : 'col',
      scoreDisplay: 'score-display',
      scoreLabel: 'score-label',
      resetBtn: 'reset-btn',
      gridWrapper: 'grid-wrapper',
      horizontalLine: 'horizontal-line',
      verticalLine: 'vertical-line',
      lineContainer: 'line-container',
      line : 'line',
      overlay: 'overlay',
      overlayMsg: 'overlay-msg',
      bColorWhite: 'b-color-white',
      fieldHvr: 'field-hvr'
   }

   const UISelectors = {
      screen: `#${ID.screen}`,
      menu: `#${ID.menu}`,
      mainMenu: `#${ID.main}`,
      XOMenu: `#${ID.XOMenu}`,
      window: `#${ID.window}`,
      playingField: `#${ID.playingField}`,
      overlay: `.${Class.overlay}`,
      fieldContainer: `#${ID.fieldContainer}`,
      fields: `#${ID.fieldContainer} .${Class.field}`,
      pOneScore: `#${ID.pOneScore}`,
      pTwoScore: `#${ID.pTwoScore}`,
      pOneLabel: `.${Class.scoreLabel}[for=${ID.pOneScore}]`,
      pTwoLabel: `.${Class.scoreLabel}[for=${ID.pTwoScore}]`,
      bColorWhite: `.${Class.bColorWhite}`,
      lineContainer: `.${Class.lineContainer}`,
      line: `.${Class.line}`
   }

   const drawLinePositions = {
      col: 'col-',
      row: 'row-',
      diag: 'diag',
      invDiag: 'diag-inv'
   }

   function MakeLine(lineType,position){
      // Create line element
      let line = document.createElement('div');
      line.className = `${lineType} ${position}`;
      const html = `
      <div class="${Class.lineContainer}">
         <span class="${Class.line}"></span>
      </div>  
      `;
      line.innerHTML = html;
      return line;
   }

   function GetDiagonalProperties(){
      let fieldContainer = document.querySelector(UISelectors.fieldContainer);
      let width = window.getComputedStyle(fieldContainer,null).getPropertyValue("width");
      width = parseFloat(width);
      console.log("Width",width);
      let height = window.getComputedStyle(fieldContainer,null).getPropertyValue("height");
      height = parseFloat(height)
      console.log("Height",height);

      let diagonal = Math.floor(Math.sqrt(Math.pow(height,2)+Math.pow(width,2)));
      console.log("Diagonala",diagonal)
      let sin = width/diagonal;
      console.log("Sin" , sin);
      let angle = Math.asin(sin);
      console.log("Angle",angle);
      // turn to percentage
      diagonal = (diagonal/height)*100;

      return{
         angle,
         diagonal
      }
   }

   function SetDiag(line) {
      const dprops = GetDiagonalProperties();
      lineContainer = line.querySelector(UISelectors.lineContainer);
      lineContainer.style.height = `${dprops.diagonal}%`;
      lineContainer.style.transform = `translateX(-50%) rotateZ(-${dprops.angle}rad)`;
   }

   function SetDiagInv(line){
      const dprops = GetDiagonalProperties();
      lineContainer = line.querySelector(UISelectors.lineContainer);
      lineContainer.style.height = `${dprops.diagonal}%`;
      lineContainer.style.transform = `translateX(50%) rotateZ(${dprops.angle}rad)`;
   }

   let overlayTimer = null;
   
   return {
      GetUISelectors: function(){
         return UISelectors;
      },
      GetDrawLinePositions: function(){
         return drawLinePositions;
      },
      GetClass: function(){
         return Class;
      },
      GetDataId: function(){
         return dataId;
      },
      GetID: function(){
         return ID;
      },
      GetFields: function(){
         return document.querySelectorAll(UISelectors.fields);
      },
      navigation: {
         ToXO: function () {
            const html =
               `<div id="${ID.XOMenu}">
                   <h1 class="${Class.menuTitle}">Player I: would you like X or O?</h1>
                   <div class="${Class.choices}">
                       <span data-id="${dataId.x}" class="${Class.choice} ${Class.hvrDashed}">X</span>
                       <span data-id="${dataId.o}" class="${Class.choice} ${Class.hvrDashed}">O</span>
                   </div>
                   <span id="${ID.back}" data-id="${dataId.back}" class="${Class.choice} ${Class.hvrDashed}">Back</span>
               </div>
               `;
   
            document.querySelector(UISelectors.menu).innerHTML = html;
         },
         ToMainMenu: function () {
            const html =
               `<div id="${ID.mainMenu}">
                   <h1 class="${Class.menuTitle}">How do you want to play</h1>
                   <div class="${Class.choices}">
                       <span data-id="${dataId.onePlayer}" class="${Class.choice} ${Class.hvrDashed}">One player</span>
                       <span data-id="${dataId.twoPlayer}" class="${Class.choice} ${Class.hvrDashed}">Two player</span>
                   </div>
               </div>
               `;
            document.querySelector(UISelectors.menu).innerHTML = html;
         },
         ToPlayingField: function(){
            const html = 
            `<div id="${ID.playingField}" class="${Class.screenWH}">
               <div id="${ID.fieldHeader}">
                  <div id="${ID.score}">
                     <div class="${Class.col}">
                        <label for="${ID.pOneScore}" class="${Class.scoreLabel}">Player I</label>
                     </div>
                     <div class="${Class.col}">
                        <label for="${ID.pTwoScore}" class="${Class.scoreLabel}">Player II</label>
                     </div>
                     <div class="${Class.col}">
                        <span id="${ID.pOneScore}" class="${Class.scoreDisplay}"></span>
                     </div>
                     <div class="${Class.col}">
                        <span id="${ID.pTwoScore}" class="${Class.scoreDisplay}"></span>
                     </div>
                  </div>
                  <div id="${ID.resetBtnContainer}">
                     <span data-id="${dataId.reset}" class="${Class.choice} ${Class.resetBtn} ${Class.hvrDashed}">Reset</span>
                  </div>
               </div>
               <div id="${ID.fieldContainer}" class='${Class.fieldHvr}'>
                  <div class="${Class.gridWrapper}">
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                     <span class="${Class.field}"></span>
                  </div>
               </div>
            </div>
            `;
            document.querySelector(UISelectors.menu).innerHTML = html;
         }
      },
      SetField: function(el_field, input){
         el_field.appendChild(document.createTextNode(input));
      },
      ShowOverlay: function(message, callback){
         const overlay = document.createElement('div');
         overlay.className = Class.overlay;
         const overlayMsg = document.createElement('div');
         overlayMsg.className = Class.overlayMsg;
         overlayMsg.appendChild(document.createTextNode(message));
         overlay.appendChild(overlayMsg);
         document.querySelector(UISelectors.fieldContainer).appendChild(overlay);
         overlayTimer = setTimeout(() => {
            this.ClearOverlay();
            if(callback !== null)
               callback();
         }, 1000);
      },
      ClearOverlay: function(){
         const overlay = document.querySelector(UISelectors.overlay);
         if(overlay) //if it exists remove it
            overlay.remove();
         clearTimeout(overlayTimer);
      },
      DrawLine: function(drawPosition, callback){
         // <div class="horizontal/vertical-line">...</div>
         console.log('DrawPosition',drawPosition);
         let line = null;
         if(drawPosition.indexOf(drawLinePositions.row)!=-1){
            line = MakeLine(Class.horizontalLine, drawPosition);
         } else if(drawPosition.indexOf(drawLinePositions.col)!=-1){
            line = MakeLine(Class.verticalLine, drawPosition);
         } else if(drawPosition === drawLinePositions.diag){
            line = MakeLine(Class.verticalLine, drawPosition);
            // Set the diag length and angle for the current viewport
            SetDiag(line);
         } else if(drawPosition === drawLinePositions.invDiag){
            line = MakeLine(Class.verticalLine, drawPosition);
            // Set the inv diag length and angle for the current viewport
            SetDiagInv(line);
         }
         // The graphical representation of the line <span class="line"></span>
         const l = line.querySelector(UISelectors.line);
         // Insert element
         document.querySelector(UISelectors.fieldContainer).appendChild(line);
         let drawTime = window.getComputedStyle(l,null).getPropertyValue('animation-duration');
         drawTime = parseFloat(drawTime);
         
         setTimeout(() => {
            if(callback){
               callback();
            }
         }, drawTime * 1000);
      },
      EraseLine: function(){
         const line = document.querySelector(UISelectors.lineContainer).parentElement;
         if(line){
            line.remove();
         }
      },
      // Marks the score label to show who is playing next
      ShowPlayerTurn(id){
         // First remove the previous mark
         const currentTurn = document.querySelector(UISelectors.bColorWhite);
         if(currentTurn)
            currentTurn.classList.remove(Class.bColorWhite);
         // Then mark the next one
         // Get the selector depending on the id that was sent
         const selector = (id === ID.pOneScore)? UISelectors.pOneLabel: UISelectors.pTwoLabel;
         const el_scoreLabel = document.querySelector(selector);
         el_scoreLabel.classList.add(Class.bColorWhite);
      },
      ClearField(){
         let fields = this.GetFields();
         fields = Array.from(fields);
         fields.forEach((field) =>{
            field.textContent = '';
         });
      },
      UpdateScore(score, id){
         const selector = (id===ID.pOneScore)? UISelectors.pOneScore: UISelectors.pTwoScore;
         document.querySelector(selector).textContent = score;
      },
      LockField(){
         document.querySelector(UISelectors.fieldContainer).className = '';
      },
      UnlockField(){
         document.querySelector(UISelectors.fieldContainer).className = Class.fieldHvr;
      }
   }
})();