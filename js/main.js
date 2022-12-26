// declare global
var objectIndex = {
    rock: 0,
    paper: 0,
    scissors: 0
}

var objectCount = {
    rock: 0,
    paper: 0,
    scissors: 0
}

var objects = ["rock", "paper", "scissors"];

function getObjectToImage(object) {
    if (object == "rock") {
        return "img/rock.png";
    }
    if (object == "paper") {
        return "img/paper.png";
    }
    if (object == "scissors") {
        return "img/scissors.png";
    } 
}

function handleSlider(){
    var chooseValueSlider = document.getElementById("choose-initial-objects").value;
    var chooseValueSliderLabel = document.getElementById("choose-initial-objects-label");
    chooseValueSliderLabel.innerHTML = chooseValueSlider + " objects";
}

function spawnObject(object, position = null) {
    var div = document.getElementById("playground");
    var id = object + "_" + objectIndex[object];
    var img = document.createElement("img");
    
    var offsets = document.getElementById('playground').getBoundingClientRect();
    var topMargin = offsets.top;
    var leftMargin = offsets.left;
    var height = offsets.height;
    var width = offsets.width;
    height-=20;
    width-=20;

    img.id = id;
    img.class = object
    img.src = getObjectToImage(object);
    img.style.width = "30px";
    img.style.height = "30px";
    img.style.position = "absolute";

    if (position == null) {
        img.style.left = (leftMargin + Math.floor(Math.random() * width)) + "px";
        img.style.top = (topMargin + Math.floor(Math.random() * height)) + "px";
    }
    else {
        img.style.left = position[0];
        img.style.top = position[1];
    }
    
    div.appendChild(img);
    objectCount[object]++;
    objectIndex[object]++;
    animateDiv("#"+ id);
}

function startNewGame(){
    var initialObjects = document.getElementById("choose-initial-objects").value;
    // clear playground
    var playground = document.getElementById("playground");
    playground.innerHTML = "";
    objectIndex = {
        rock: 0,
        paper: 0,
        scissors: 0
    }
    objectCount = {
        rock: 0,
        paper: 0,
        scissors: 0
    }
    // divide randomly
    for (var i = 0; i < initialObjects; i++) {
        var randomObject = Math.floor(Math.random() * 3);
        if (randomObject == 0) {
            spawnObject("rock");
        }
        if (randomObject == 1) {
            spawnObject("paper");
        }
        if (randomObject == 2) {
            spawnObject("scissors");
        }
    }
    
    setInterval(gameLoop, 100);
}

function makeNewPosition(){

    var offsets = document.getElementById('playground').getBoundingClientRect();
    var topMargin = offsets.top;
    var leftMargin = offsets.left;
    var height = offsets.height;
    var width = offsets.width;
    height-=20;
    width-=20;

    // get new position
    var nh = topMargin + Math.floor(Math.random() * height);
    var nw = leftMargin + Math.floor(Math.random() * width);
    return [nh,nw];    
    
}

function animateDiv(id){
    // $(`#${id}`).css("position", "fixed");
    
    var newq = makeNewPosition();
    $(id).animate({ top: newq[0], left: newq[1] }, 10000, function(){
      animateDiv(id);        
    });
    
};

// mak a function to check if two objects collide
function checkCollision(object1, object2) {
    var object1Rect = object1.getBoundingClientRect();
    var object2Rect = object2.getBoundingClientRect();
    if (object1Rect.right < object2Rect.left || object1Rect.left > object2Rect.right || object1Rect.bottom < object2Rect.top || object1Rect.top > object2Rect.bottom) {
        return false;
    }
    return true;
}

function removeObject(object, objectType) {
    object.remove();
    objectCount[objectType]--;
}

function checkCollisions() {
    var objects = document.getElementsByTagName("img");
    for (var i = 0; i < objects.length; i++) {
        for (var j = i + 1; j < objects.length; j++) {
            if (checkCollision(objects[i], objects[j])) {
                var object1 = objects[i].class;
                var object2 = objects[j].class;
                if (object1 == object2) {
                    continue;
                }
                var position = [objects[i].style.left, objects[i].style.top];
                console.log("postion", position);
                var winner = getWinner(object1, object2);
                if (winner == object1) {
                    removeObject(objects[j], object2);
                } else {
                    removeObject(objects[i], object1);
                }
                spawnObject(winner, position);
            }
        }
    }               
}

function getWinner(object1, object2) {
    if (object1 == "rock" && object2 == "scissors") {
        return "rock";
    }
    if (object1 == "rock" && object2 == "paper") {
        return "paper";
    }
    if (object1 == "paper" && object2 == "rock") {
        return "paper";
    }
    if (object1 == "paper" && object2 == "scissors") {
        return "scissors";
    }
    if (object1 == "scissors" && object2 == "rock") {
        return "rock";
    }
    if (object1 == "scissors" && object2 == "paper") {
        return "scissors";
    }
}

function checkWin() { 
    rockCount = objectCount["rock"];
    paperCount = objectCount["paper"];
    scissorsCount = objectCount["scissors"];
    if (rockCount == 0 && paperCount == 0) {
        alert("Scissors win!");
    }
    if (rockCount == 0 && scissorsCount == 0) {
        alert("Paper win!");
    }

    if (paperCount == 0 && scissorsCount == 0) {
        alert("Rock win!");
    }
}

function updateScore(){
    var rocksCountDiv = document.getElementById("rock-counter");
    var papersCountDiv = document.getElementById("paper-counter");
    var scissorsCountDiv = document.getElementById("scissors-counter");
    
    rocksCountDiv.innerHTML = "<img src='img/rock.png' width='20'> " + objectCount["rock"] + " Rocks </img>";
    papersCountDiv.innerHTML = "<img src='img/paper.png' width='20'> " + objectCount["paper"] + " Paper </img>";
    scissorsCountDiv.innerHTML = "<img src='img/scissors.png' width='20'> " + objectCount["scissors"] + " Scissors</img>";
}

function gameLoop() {
    checkCollisions();
    updateScore();
    checkWin();
}
