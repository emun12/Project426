function populateLeaderboard(){
  axios({
    method: "get",
    url: "https://project426.herokuapp.com/name"
  })
    .then(function (response) {
      //handle success
      console.log(response.data);
      var arrayLength = response.data.length;
      var minLength = Math.min(arrayLength,5);
      for (var i = 0; i < minLength; i++) {
          console.log(response.data[i]);
          $('#leaderboard').append($('<li>').append(response.data[i].name+": "+response.data[i].score));
      }
    });
}

$(document).ready(function(){

  //create user actions
  $('#newGamebutton').on('click',function(){
    location.reload();
  });
  //logout actions
  $('#logout').hide();
  $('#logout').on('click',function(){
    axios({
      method: "get",
      url: "https://project426.herokuapp.com/logout"
    }).then(function(response){
      location.reload();
    }).catch(function(response){
      console.log(response);
    });
  });

  $('#game').hide();
  //login actions
  axios({
    method: "get",
    url: "https://project426.herokuapp.com/home"
  })
    .then(function (response) {
      //handle success
      var user = response.data;
      console.log('user is ' +user);
      if(user.length!==31){
        $('#login_label').hide();
        $('#creduser').hide();
        $('#credpass').hide();
        $('#credsub').hide();
        $('#logout').show();
        $('#create_label').hide();
        $('#create_creduser').hide();
        $('#create_credpass').hide();
        $('#create_credsub').hide();
        $('#game').show();
      }
      else{
        
      }
    }).catch(function (response) {
      //handle error
      console.log(response);
    });


  //populate leaderboard
  
    populateLeaderboard();
    
    //change
    $('#submit').on('click',function(){

        console.log('clicked');
        var bodyFormData = new FormData();
        var name = $('#user').val();

        bodyFormData.append('name',name);
        console.log(name);
        axios({
          method: 'post',
          url: 'https://project426.herokuapp.com/name',
          data: {
            score: 100,
            name: name
          }
        })
          .then(function (response) {
            //handle success
            console.log(response);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
          location.reload();
    });

    
});


$(document).ready(function(){

  // use autocomplete for FAQ section
var textbox = document.getElementById("firstQ");
  textbox.addEventListener("input", function(e){
    if (e.target.value == "How to play Tic Tac Toe?"){
      alert("Click on the box you want to mark. When 3 boxes are aligned in one direction, you win.");
    }
    else if(e.target.value == "How to get #1 on leaderboard?"){
      alert("The leaderboard is the number of times you have played the game. To get #1, keep playing the game.");

    } else if(e.target.value == "Is making an account free?"){
      alert("Yes, create an account by putting in a username and password. You can then log in and play the game.");
    } else if(e.target.value == "What is the leaderboard showing?"){
      alert("It's showing the users with the most games won.");
    }
  })

  /* Used a random joke API */
  var jokeButton = document.getElementById("jokeB");
  jokeButton.addEventListener("click", function (event) {
 
    fetch("https://official-joke-api.appspot.com/random_joke")
    // uses a joke API to get a random joke
    .then((response) => response.json())
    .then((data) => getRandomJoke(data));
  });
  
  function getRandomJoke(data) {
    const setup = document.getElementById("setup");
    const punchline = document.getElementById("punchline");
    setup.innerHTML = data.setup;
    punchline.innerHTML = data.punchline;
  }

  /* Random dog generator API*/

  var jokeButton2 = document.getElementById("dogB");
  jokeButton2.addEventListener("click", function (event) {
 
    // fetch("https://random.dog/woof.json")
    fetch("https://api.adviceslip.com/advice")
    // uses a joke API to get a random joke
    .then((response) => response.json())
    .then((data) => getRandomDog(data));
    // console.log(data);
    // console.log(response.json());
  });
  
  function getRandomDog(data) {
    const url = document.getElementById("url");
    url.innerHTML = data.slip.advice;
    // const fileSizeBytes = document.getElementById("fileSizeBytes");
    // url.innerHTML = data.url;
    // let images = new Image();
    // images.src = data.url;  

    // var img = document.createElement("img");
    // img.src = data.url;
    // document.body.appendChild(img);

    // fileSizeBytes.innerHTML = data.fileSizeBytes;
  }

 
  
});


//game logic
$(document).ready(function(){
  function isWon(){
    var win1 = $('#00').html()===$('#01').html() && $('#01').html()===$('#02').html() && $('#00').html()!==' ';
    var win2 = $('#10').html()===$('#11').html() && $('#11').html()===$('#12').html() && $('#10').html()!==' ';
    var win3 = $('#20').html()===$('#21').html() && $('#21').html()===$('#22').html() && $('#20').html()!==' ';
    
    var win_1 = $('#00').html()===$('#10').html() && $('#10').html()===$('#20').html() && $('#00').html()!==' ';
    var win_2 = $('#01').html()===$('#11').html() && $('#11').html()===$('#21').html() && $('#01').html()!==' ';
    var win_3 = $('#02').html()===$('#12').html() && $('#12').html()===$('#22').html() && $('#02').html()!==' ';

    var winx1 = $('#00').html()===$('#11').html() && $('#11').html()===$('#22').html() && $('#00').html()!==' ';
    var winx2 = $('#02').html()===$('#11').html() && $('#11').html()===$('#20').html() && $('#02').html()!==' ';
  
    if (win1 || win2 || win3 || win_1 || win_2 || win_3 ||winx1 || winx2){
      axios({
        method: "get",
        url: "https://project426.herokuapp.com/home"
      })
        .then(function (response) {
          var user = response.data;
          axios({
            method: "get",
            url: "https://project426.herokuapp.com/name"
          })
            .then(function (response) {
              //handle success
              console.log(response.data);
              var arrayLength = response.data.length;
              var inArr = false;
              for (var i = 0; i < arrayLength; i++) {
                  console.log(response.data[i].name+" "+user);

                  if (response.data[i].name == user){
                    inArr = true;
                  }
                  console.log(inArr);
              } 
              if (inArr){
                axios({
                  method: "put",
                  url: "https://project426.herokuapp.com/update"
                }).then(function(){
                  console.log('game is won');
                  alert('You won.');
                })
                .catch(function(response){
                  console.log(response);
                });
                
              }
              else{
                axios({
                  method: 'post',
                  url: 'https://project426.herokuapp.com/name',
                  data: {
                    score: 0,
                    name: user
                  }
                }).then(function(){
                  axios({
                    method: "put",
                    url: "https://project426.herokuapp.com/update"
                  }).then(function(){
                    console.log('game is won');
                    alert('You won.');
                  })
                  .catch(function(response){
                    console.log(response);
                  });
                });
              }
            });
        });
        alert('You won.');
    }
    
  };
  //populate cells logic
  var turn_counter = 1;

  $('#00').on('click',function(){
    
    if (turn_counter%2 & $('#00').html()===' '){
      $('#00').html('x');
      turn_counter=turn_counter+1;
    }
    else if ($('#00').html()===' '){
      $('#00').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#01').on('click',function(){
    
    if (turn_counter%2 & $('#01').html()===' '){
      $('#01').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#01').html()===' '){
      $('#01').html('o');
      turn_counter=turn_counter+1;
    }
  });
  $('#02').on('click',function(){
    
    if (turn_counter%2 & $('#02').html()===' '){
      $('#02').html('x');
      turn_counter=turn_counter+1;
    }
    else if ($('#02').html()===' '){
      $('#02').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#10').on('click',function(){
    
    if (turn_counter%2 & $('#10').html()===' '){
      $('#10').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#10').html()===' '){
      $('#10').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#11').on('click',function(){
    
    if (turn_counter%2 & $('#11').html()===' '){
      $('#11').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#11').html()===' '){
      $('#11').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#12').on('click',function(){
    
    if (turn_counter%2 & $('#12').html()===' '){
      $('#12').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#12').html()===' '){
      $('#12').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#20').on('click',function(){
    
    if (turn_counter%2 & $('#20').html()===' '){
      $('#20').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#20').html()===' '){
      $('#20').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#21').on('click',function(){
    
    if (turn_counter%2 & $('#21').html()===' '){
      $('#21').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#21').html()===' '){
      $('#21').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });
  $('#22').on('click',function(){
    
    if (turn_counter%2 & $('#22').html()===' '){
      $('#22').html('x');
      turn_counter=turn_counter+1;
    }
    else if($('#22').html()===' '){
      $('#22').html('o');
      turn_counter=turn_counter+1;
    }
    isWon();
  });

  
  
});

