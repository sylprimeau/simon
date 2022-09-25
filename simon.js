var isPowerOn = false;
var strictMode = false;
var sequenceStarted = false;
var pressCount = 0;
var count = 0;
var arrRandom = [];
var sequenceTimeout = [];
var enableButtonsTimeout;
var displayOnInterval;
var displayOffInterval;
var displayOnIntervalSet = false;
var displayOffIntervalSet = false;

function cancelFlashSequence() {
  // cancel remainder of flashes if mid-sequence
  for (var i = 0; i < count; i++) {
    clearTimeout(sequenceTimeout[i]);
  }
  clearTimeout(enableButtonsTimeout);
}

function togglePower() {
  if (!isPowerOn) {
    document.getElementById("power-switch").style.left = "50%"; // slide switch right
    document.getElementById("count-display").style.color = "#990000"; // turn display on
    isPowerOn = true;
    // need to load AND play audio files because iOS won't play them unless
    // played in the function the touch event calls. If you don't want to
    // actually play the sounds, immediately pause them to silence them
    audio1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
    audio1.play(); audio1.pause();
    audio2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
    audio2.play(); audio2.pause();
    audio3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
    audio3.play(); audio3.pause();
    audio4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
    audio4.play(); audio4.pause();
    audio5 = new Audio("http://www.soundjay.com/misc/fail-buzzer-01.wav");
    audio5.play(); audio5.pause();
  } else if (isPowerOn) {
    isPowerOn = false;
    disableButtons();
    // slide switch left and turn off strict-lamp and display
    // turn off strictMode, disableButtons
    document.getElementById("power-switch").style.left = "4%";
    document.getElementById("count-display").style.color = "#4d0000";
    document.getElementById("count-display").innerHTML = "--";
    document.getElementById("strict-lamp").style.backgroundColor = "#770000";
    strictMode = false;
    cancelFlashSequence();
  }
}

function toggleStrict() {
  if (isPowerOn) { // can only toggle if power is on
    if (!strictMode) {
      document.getElementById("strict-lamp").style.backgroundColor = "#ff0000";
      strictMode = true;
    } else if (strictMode) {
      document.getElementById("strict-lamp").style.backgroundColor = "#770000";
      strictMode = false;
    }
  } else if (!isPowerOn) { // do nothing if power is off
    return;
  }
}

function generateRndNum(min, max) {
  var rndNum = Math.floor(Math.random() * ((max - min) + 1) + min);
  return rndNum;
}

function generateArray() {
  // generate array of 20 random numbers between 1 and 4
  var arr = [];
  for (var i = 0; i < 20; i++) {
    rndNum = generateRndNum(0, 3);
    arr.push(rndNum);
  }
  return arr;
}

function flashGreenLight() {
  var el = document.getElementById("green");
  el.style.background = "radial-gradient(#ccffcc, #77ff77, #33ff33, #00ff00)";
  // Even though we created new Audio for each sound in togglePower(), we need to do so
  // here too because otherwise the file has to finish playing completely before
  // playing the same file a second time (such as a double-click)
  audio4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
  audio4.play();
}

function flashRedLight() {
  var el = document.getElementById("red");
  el.style.background = "radial-gradient(#ff8888, #ff5555, #ff2222, #ff0000)";
  audio3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  audio3.play();
}

function flashYellowLight() {
  var el = document.getElementById("yellow");
  el.style.background = "radial-gradient(#ffffcc, #ffff66, #ffff33, #ffff00)";
  audio1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  audio1.play();
}

function flashBlueLight() {
  var el = document.getElementById("blue");
  el.style.background = "radial-gradient(#aaaaff, #7777ff, #4444ff, #0000ff)";
  audio2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  audio2.play();
}

function buttonLightOn(e) {
  if (e.target.className === "press-buttons") {
//    console.log("You pressed the " + e.target.id + " button");
    if (e.target.id === "green") {
      flashGreenLight();
    } else if (e.target.id === "red") {
      flashRedLight();
    } else if (e.target.id === "yellow") {
      flashYellowLight();
    } else if (e.target.id === "blue") {
      flashBlueLight();
    }
  }
}

function greenLightOff() {
  var el = document.getElementById("green");
  el.style.background = "#009900";
}

function redLightOff() {
  var el = document.getElementById("red");
  el.style.background = "#aa0000";
}

function yellowLightOff() {
  var el = document.getElementById("yellow");
  el.style.background = "#bbbb00";
}

function blueLightOff() {
  var el = document.getElementById("blue");
  el.style.background = "#0000cc";
}

function buttonLightOff(e) {
  if (e.target.className === "press-buttons") {
    if (e.target.id === "green") {
      greenLightOff();
    } else if (e.target.id === "red") {
      redLightOff();
    } else if (e.target.id === "yellow") {
      yellowLightOff();
    } else if (e.target.id === "blue") {
      blueLightOff();
    }
  }
}

function enableButtons() {
  document.getElementById("green").style.cursor = "pointer";
  document.getElementById("red").style.cursor = "pointer";
  document.getElementById("yellow").style.cursor = "pointer";
  document.getElementById("blue").style.cursor = "pointer";
  document.body.addEventListener("mousedown", pressButton);
  document.body.addEventListener("mouseup", releaseButton);
}

function disableButtons() {
  document.getElementById("green").style.cursor = "default";
  document.getElementById("red").style.cursor = "default";
  document.getElementById("yellow").style.cursor = "default";
  document.getElementById("blue").style.cursor = "default";
  document.body.removeEventListener("mousedown", pressButton);
  document.body.removeEventListener("mouseup", releaseButton);
}

function pressButton(e) {
  if (e.target.className == "press-buttons") {
    buttonLightOn(e);
  }
}

function releaseButton(e) {
  if (e.target.className == "press-buttons") {
    pressCount += 1;
    buttonLightOff(e);
    if (pressCount == count) {
      disableButtons();
    }
    checkInput(e);
  }
}

function updateDisplay(count) {
  var n = count + 1;
  n = n.toString();
//  console.log(n.length);
//  console.log("0" + n);
  if (n.length < 2) {
    n = ("0" + n);
  }
  document.getElementById("count-display").innerHTML = n; // display counter 0
}

function flashPanel() {
  displayOffInterval = setInterval(function() {
    document.getElementById("count-display").style.color = "#4d0000"; // off
  }, 1000);
  setTimeout(function() {
    displayOnInterval = setInterval(function() {
      document.getElementById("count-display").style.color = "#990000"; // on
    }, 1000);
  }, 500);
  displayOnIntervalSet = true;
  displayOffIntervalSet = true;
}

function checkInput(e) {
  var buttonPressed;
  if (e.target.className === "press-buttons") {
    if (e.target.id === "green") {
      buttonPressed = 0;
    } else if (e.target.id === "red") {
      buttonPressed = 1;
    } else if (e.target.id === "yellow") {
      buttonPressed = 2;
    } else if (e.target.id === "blue") {
      buttonPressed = 3;
    }
    if (arrRandom[pressCount - 1] == buttonPressed) {
      if (pressCount == count) {
//        console.log("You've entered the correct sequence!");
        if (count < arrRandom.length) {
          updateDisplay(count);
          playSequence(count);
        } else {
          flashPanel();
        }
      }
    } else {
      if (strictMode) {
        startGame();
      } else if (!strictMode) {
        count -= 1;
        playSequence();
      }
      audio1.pause();
      audio2.pause();
      audio3.pause();
      audio4.pause();
      audio5.play();
    }
  }
}

function playSequence(counter) {
//  console.log("playSeqence called"); // works ok
  count += 1;
//  console.log("count is now: " + count); // works ok
  counter = count;
  var pause = 1000; // initial pause at start of game
  for (var i = 0; i < counter; i++) {
    console.log("i = " + i);
    pause = pause + 600; // ms to pause before next flash
      if (arrRandom[i] === 0) {
        sequenceTimeout[i] = setTimeout(function() {
          flashGreenLight();
          setTimeout(greenLightOff, 300);
        }, pause);
      } else if (arrRandom[i] === 1) {
        sequenceTimeout[i] = setTimeout(function() {
          flashRedLight();
          setTimeout(redLightOff, 300);
        }, pause);
      } else if (arrRandom[i] === 2) {
        sequenceTimeout[i] = setTimeout(function() {
          flashYellowLight();
          setTimeout(yellowLightOff, 300);
        }, pause);
      } else if (arrRandom[i] === 3) {
        sequenceTimeout[i] = setTimeout(function() {
          flashBlueLight();
          setTimeout(blueLightOff, 300);
        }, pause);
      }
  }
  pressCount = 0;
  enableButtonsTimeout = setTimeout(enableButtons, pause + 600); // user can press buttons after seq is finished
}

function playGame() {
  arrRandom = generateArray();
  console.log(arrRandom);
  playSequence(count);
}

function init() {
  disableButtons();
  cancelFlashSequence();
  pressCount = 0;
  count = 0;
  updateDisplay(count);
  arrRandom = [];
  sequenceTimeout = [];
  enableButtonsTimeout;
  if (displayOffIntervalSet == true) {
    clearInterval(displayOffInterval);
    clearInterval(displayOnInterval);
    displayOffIntervalSet = false;
    displayOnIntervalSet = false;
    document.getElementById("count-display").style.color = "#990000"; // on
  }
}

function startGame() {
  if (isPowerOn) {
    init();
    playGame();
  } else { // do nothing if power is off
    return;
  }
}

document.getElementById("power-switch").addEventListener("click", togglePower);
document.getElementById("strict-button").addEventListener("click", toggleStrict);
document.getElementById("start-button").addEventListener("click", startGame);
