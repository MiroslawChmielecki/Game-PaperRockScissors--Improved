'use strict';  

//zmienne
let conditionsDiv = document.querySelector("#conditions");    //liczba rund potrzebnych by wygrac
let outputDiv = document.querySelector('#output');            //info o stanie rundy
let resultDiv = document.querySelector('#result');            //rezultat gry 
let outputAllGame = document.querySelector('.outputAllGame'); //info kto wygral cala gre w modalu
let scoreAllGame = document.querySelector('#scoreAllGame');   //info kto wygral cala gre na stronie
let modal = document.querySelector('#modal-overlay');
let modals = document.querySelectorAll('.modal');
let table = document.querySelector('#tableInModal');          //tabela w modalu
let scoreField = document.querySelector('.score');            //pole z wynikiem

//zmienne zwiazane z buttonami
let buttonNewGame = document.querySelector("#newGame");
let buttons = document.querySelectorAll('.player-move');
let closeButtons = document.querySelectorAll('.modal .close');
let buttonsField = document.querySelector('.but-choices');      //pole z buttonami

let params = {
  currentRound: 0,            //bieżąca runda tj. numer rundy
  computerMove: '',           // wybor komputera
  ourMove: '',                // wybor gracza
  text: '',                   //wyswietla komunikat w zaleznosci od wyniku gry
  win: '',                    //wyswietla koncowy wynik kto wygral                
  computerPoints: 0,          // punkty komputera
  playerPoints: 0,            //punkty gracza                  
  EachGameResult: '',         //wynik kazdej gry: remis lub wygrana lub przegrana
  rounds: "",                 //przechowuje liczbe rund
  isFinished: false,          //zmienna przechowuje info czy gra jest skonczona
  progress: []
  }

//funkcja jako argument przyjmuje nazwe ruchu gracza
function playerMove(ourMove){
  //funkcja losująca od 1 do 3  
  function random() {
      return Math.floor(Math.random() * 3 + 1);       
      }
    params.computerMove = random()   
    if (params.computerMove == 1){   
      params.computerMove = "paper";      //zmiana z number na string
    }else if (params.computerMove == 2) {
      params.computerMove = "rock";
    } else {
      params.computerMove = "scissor";
    }
    //sprawdzam kto wygral, do zmiennej params.text dodaje tekst oraz 1 punkt do gracza lub komputera
    
    if (params.computerMove == params.ourMove) {    
      params.text = "DRAW";
      params.EachGameResult = "DRAW";
    }else if ((params.computerMove == "paper" && params.ourMove == "rock") 
      || (params.computerMove == "rock" && params.ourMove == "scissor") 
      || (params.computerMove == "scissor" && params.ourMove == "paper")) {
      params.text  = "You LOST this round: You played " + params.ourMove + ", Computer played " + params.computerMove;
      params.EachGameResult = "DEFEAT";
      params.computerPoints++;
    }else {  params.text = "You WIN this round: You played " + params.ourMove + ", Computer played " + params.computerMove;
        params.EachGameResult = "WIN";
        params.playerPoints++;
      }
    
    //sprawdzam kto wygrał całość gry
    if (params.computerPoints == params.rounds) {
      modal.classList.add('show');
      params.isFinished = true;     //to gra jest skończona
      params.win = "You LOST the ENTIRE GAME";
      outputAllGame.classList.add('looser');
      scoreAllGame.classList.add('looser');
    } else if (params.playerPoints == params.rounds) {
      modal.classList.add('show');
      params.isFinished = true;     //to gra jest skończona
      params.win = "You WON the ENTIRE GAME";
      outputAllGame.classList.add('winner');
      scoreAllGame.classList.add('winner');
    }
    //przekazanie do funkcji display tekstu z info kto wygral runde
    // przekazanie info czy ktos wygral gre
    display(params.text, params.win); 
    
    //Wysłanie wyników do tablicy
    //TABLICA
    params.progress.push({
      NumberofRound: params.currentRound,
      PlayerChoice: params.ourMove,
      ComputerChoice: params.computerMove,
      CurrentScore: params.playerPoints + " : " + params.computerPoints,
      ResultEachRound: params.EachGameResult
    });
    GameTable();
  }; 
  
//funkcja display wyswietla tekst i wynik koncowy
 function display(text, win) {
  outputDiv.innerHTML = "";             //czysci po kazdej rundzie outputDiv
  scoreAllGame.innerHTML = "";
  outputDiv.append(params.text);        //append dodaje params.text do outputDiv
  if(params.win){
    outputAllGame.append(params.win);
    scoreAllGame.append(params.win);
  }
  resultDiv.innerHTML =  params.playerPoints + " - " + params.computerPoints; 
  }; 
  
  //TABELA WYSWIETLANA W MODALU
  let GameTable = function() {
    table.innerHTML = 
      "<thead><tr><th>Round</th><th>YOUR choice</th><th>COMPUTER choice</th><th>Current score</th><th>Result this round</th></tr></thead>";
    for ( var i = 0; i < params.progress.length; i++ ) {
      table.innerHTML += "<tr><td>" + params.progress[i].NumberofRound + "</td><td>" +
      params.progress[i].PlayerChoice +"</td><td>" +
      params.progress[i].ComputerChoice +"</td><td>" +
      params.progress[i].CurrentScore +"</td><td>" +
      params.progress[i].ResultEachRound +"</td><tr>";
    }
  };
  
  //Klikniecie buttona z wyborem
   for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click",function() {
      params.ourMove = this.getAttribute("data-move");
      if (!params.isFinished) {                        
          playerMove(params.ourMove);
          params.currentRound++;   
          } else {
         outputDiv.innerHTML = "GAME OVER, please press the New Game button !"
         buttonsField.classList.remove('show');
         scoreField.classList.remove('show');
         conditionsDiv.innerHTML = "";
         scoreAllGame.innerHTML = "";
         }
        
       /*  w zaleznosci od wyniku rundy dodaje klase do kliknietego buttona 
        i po opoznieniu usuwa ją */
        if (params.computerMove == params.ourMove) {                        
          buttons[i].classList.add('draw-circle');
           setTimeout(function(){buttons[i].classList.remove('draw-circle')}, 200);  
          } else if ((params.computerMove == "paper" && params.ourMove == "rock") 
                  || (params.computerMove == "rock" && params.ourMove == "scissor") 
                  || (params.computerMove == "scissor" && params.ourMove == "paper")){
              buttons[i].classList.add('lost-circle');
              setTimeout(function(){buttons[i].classList.remove('lost-circle')}, 200); 
          }else { buttons[i].classList.add('win-circle');
              setTimeout(function(){buttons[i].classList.remove('win-circle')}, 200);
      }})
    };

  

   //buttonNewGame
  buttonNewGame.addEventListener("click", function() {
    params.rounds = prompt("How many rounds win ??");                                
    outputDiv.innerHTML = "" ;                
    resultDiv.innerHTML = "0 - 0" ;          
    outputAllGame.innerHTML = "";           
    params.computerPoints = 0;              
    params.playerPoints = 0;                
    params.currentRound = 1;                
    params.progress.length = 0;  //zeruje elementy tablicy
    outputAllGame.classList.remove('looser');
    outputAllGame.classList.remove('winner');
    scoreAllGame.classList.remove('looser');
    scoreAllGame.classList.remove('winner');
    if (isNaN(params.rounds) || params.rounds == null || params.rounds == '' || params.rounds == 0) {                    
      params.isFinished = true;
      conditionsDiv.innerHTML = " Click button New Game again and enter CORRECT number !!";
    }else{
      params.isFinished = false;
      conditionsDiv.innerHTML = params.rounds + " round(s) win !!"; //info ile rund wygrywa
      buttonsField.classList.add('show');   // oraz pole z buttonami
      scoreField.classList.add('show');     // oraz pole z wynikiem
      params.win = "";   //resetowanie info kto wygral cala gre
      scoreAllGame.innerHTML="";
    }
  });
   
  
//MODAL
  // Funkcja zamykająca modal 
var hideModal = function(event){
  event.preventDefault();
  document.querySelector('#modal-overlay').classList.remove('show');
};
  // Zamykanie modala poprzez kliknięcie w overlay. 
	document.querySelector('#modal-overlay').addEventListener('click', hideModal);
  for(var i = 0; i < closeButtons.length; i++){
		closeButtons[i].addEventListener('click', hideModal);
  }
  /* Zablokowanie propagacji kliknięć z samego modala
   inaczej każde kliknięcie wewnątrz modala również zamykałoby go. */
	for(var i = 0; i < modals.length; i++){
		modals[i].addEventListener('click', function(event){
			event.stopPropagation();
		});
	}
  
 
  
  
 
	
	
	
  
  
