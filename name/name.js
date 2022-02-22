const input = [document.getElementById("person-num"), document.getElementById("memorize-time"), document.getElementById("recall-time")]
const inputBlock = document.getElementById("input-block");
const startButton = document.getElementById("start-button");
const countBlock = document.getElementById("count-block");
const countText = document.getElementById("count-text");
const skipButton = document.getElementById("skip-button");
const memorizeBlock = document.getElementById("memorize-block");
const memorizeCurrentFace = document.getElementById("memorize-current-face");
const memorizeCurrentName = document.getElementById("memorize-current-name");
const allFaces = document.getElementById("all-faces");
const recallBlock = document.getElementById("recall-block");
const recallPersons = document.getElementById("recall-persons");
const recallHelp = document.getElementById("recall-help");
const resultBlock = document.getElementById("result-block");
const resultPersons = document.getElementById("result-persons");
const resultInformation = document.getElementById("result-information");
const retryButton = document.getElementById("retry-button");
const bigImageSize = 330;
const mediumImageSize = 150;
const smallImageSize = 80;
const tinyImageSize = 35;
const imageMargin = 2;
const unfocusBorderStyle = "2px solid black";
const focusBorderStyle = "2px solid lightgreen";
const wrongBorderStyle = "2px solid red";
var personNum;
var memorizeTime;
var recallTime;
var memorizeTimeUsed;
var recallTimeUsed;
var counting;
var faces;
var names;
var memorizeCurr;
var memorizeFaces;
var recallNames;
var recallCurr;
var showOrder;
memorizeCurrentFace.height = bigImageSize;
memorizeCurrentFace.width = bigImageSize;
memorizeCurrentFace.style.border = unfocusBorderStyle;
ready();
function ready() {
  inputBlock.style.display = "";
  resultBlock.style.display = "none";
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      startGame();
    }
  };
}
function startGame() {
  personNum = parseInt(input[0].value);
  memorizeTime = parseInt(input[1].value);
  recallTime = parseInt(input[2].value);
  if (isNaN(personNum) || isNaN(memorizeTime) || isNaN(recallTime) || personNum <= 0 || memorizeTime <= 0 || recallTime <= 0) {
    alert("wrong input format!");
    return;
  }
  if (personNum > Math.min(totalFace, totalName)) {
    alert(`maximum: ${Math.min(totalFace, totalName)}`);
    return;
  }
  var facesId = [Math.floor(Math.random() * totalFace)];
  for (let i = 1; i < personNum; i++) {
    facesId.push(Math.floor(Math.random() * totalFace));
    for (let j = 0; j < i; j++) {
      if (facesId[i] == facesId[j]) {
        facesId.pop();
        i--;
        break;
      }
    }
  }
  faces = [];
  for (let i of facesId) {
    faces.push(`pic/${i}.jpg`)
  }
  var namesId = [Math.floor(Math.random() * totalName)];
  for (let i = 1; i < personNum; i++) {
    namesId.push(Math.floor(Math.random() * totalName));
    for (let j = 0; j < i; j++) {
      if (namesId[i] == namesId[j]) {
        namesId.pop();
        i--;
        break;
      }
    }
  }
  names = [];
  for (let i of namesId) {
    names.push(allNames[i]);
  }
  inputBlock.style.display = "none";
  memorizeCountDown(3);
}
function memorizeCountDown(t) {
  countBlock.style.display = "";
  countText.innerHTML = `memorization starts in: ${t--} s`;
  skipButton.onclick = function () {
    clearInterval(counting);
    memorizing();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `memorization starts in: ${t--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  };
  memorizeFaces = [];
  allFaces.innerHTML = "";
  for (let i = 0; i < personNum; i++) {
    allFaces.innerHTML += `<img src=${faces[i]} alt="error" height="${tinyImageSize}" 
      width="${tinyImageSize}" id="${i}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" 
      onclick="memorizeChooseFace(parseInt(this.id));" onmouseenter="memorizeChooseFace(parseInt(this.id));">`;
  }
  for (let i = 0; i < personNum; i++) {
    memorizeFaces.push(document.getElementById(`${i}`));
  }
  memorizeFocus(memorizeFaces[0]);
  memorizeCurrentFace.src = `${faces[0]}`;
  memorizeCurr = 0;
  memorizeCurrentName.innerHTML = names[0];
}
function memorizing() {
  memorizeBlock.style.display = "";
  countText.innerHTML = `time left: ${memorizeTime--} s`;
  skipButton.onclick = function () {
    memorizeBlock.style.display = "none";
    clearInterval(counting);
    recallCountDown(10);
  };
  memorizeTimeUsed = 0;
  counting = setInterval(function () {
    memorizeTimeUsed++;
    if (memorizeTime == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `time left: ${memorizeTime--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    switch (e.code) {
      case "ArrowUp":
        e.preventDefault();
        firstPerson();
        break;
      case "ArrowDown":
        e.preventDefault();
        lastPerson();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevPerson();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextPerson();
        break;
      case "Enter":
        skipButton.onclick();
    }
  };
}
function recallCountDown(t) {
  countText.innerHTML = `recall starts in: ${t--} s`;
  skipButton.onclick = function () {
    clearInterval(counting);
    recalling();
  };
  counting = setInterval(function () {
    if (t == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `recall starts in: ${t--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  };
  showOrder = [];
  for (let i = 0; i < personNum; i++) {
    showOrder.push(i);
  }
  for (let i = 0; i < personNum - 1; i++) {
    let j = i + Math.floor(Math.random() * (personNum - i));
    let temp = showOrder[i];
    showOrder[i] = showOrder[j];
    showOrder[j] = temp;
  }
  recallPersons.innerHTML = "";
  for (let i = 0; i < personNum; i++) {
    recallPersons.innerHTML += `<div style="text-align: center; display: inline-block;"><img src=${faces[showOrder[i]]} 
    alt="error" height="${mediumImageSize}" width="${mediumImageSize}" style="margin: 0px ${imageMargin}px; 
    border: ${unfocusBorderStyle}"><br><input id="${showOrder[i]}-name" name="${i}-name" class="recall-input" type="text" 
    style="width: ${mediumImageSize}px;" onclick="recallFocus(parseInt(this.name));"></div>`;
  }
  recallNames = [];
  for (let i = 0; i < personNum; i++) {
    recallNames.push(document.getElementById(`${i}-name`));
  }
  recallCurr = 0;
  var helpOrder = [];
  for (let i = 0; i < personNum; i++) {
    helpOrder.push(i);
  }
  for (let i = 0; i < personNum - 1; i++) {
    let j = i + Math.floor(Math.random() * (personNum - i));
    let temp = helpOrder[i];
    helpOrder[i] = helpOrder[j];
    helpOrder[j] = temp;
  }
  recallHelp.innerHTML = "";
  for (let i = 0; i < personNum; i++) {
    recallHelp.innerHTML += `<button style="margin: 0px 5px 20px; background-color: white; 
    border: 2px solid black;" onclick="recallClickHelp(this.innerHTML);">${names[helpOrder[i]]}</button>`;
  }
}
function recalling() {
  recallBlock.style.display = "";
  recallHelp.style.display = "none";
  countText.innerHTML = `time left: ${recallTime--} s`;
  skipButton.onclick = function () {
    recallBlock.style.display = "none";
    countBlock.style.display = "none";
    clearInterval(counting);
    result();
  };
  recallTimeUsed = 0;
  counting = setInterval(function () {
    recallTimeUsed++;
    if (recallTime == 0) {
      skipButton.onclick();
      return;
    }
    countText.innerHTML = `time left: ${recallTime--} s`;
  }, 1000);
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      skipButton.onclick();
    }
  }
}
function result() {
  resultBlock.style.display = "flex";
  var i;
  resultPersons.innerHTML = "";
  for (i = 0; i < personNum; i++) {
    resultPersons.innerHTML += `<div style="display: inline-block; text-align: center"><img src=${faces[i]} 
    alt="error" height="${mediumImageSize}" width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}">
    <br><input class="recall-input" style="width: ${mediumImageSize}px; margin: 0px ${imageMargin}px 5px;" disabled="true" value="${names[i]}">
    <br><input class="recall-input" style="width: ${mediumImageSize}px; margin: 0px ${imageMargin}px 20px; border: 
    ${recallNames[i].value == names[i] ? focusBorderStyle : wrongBorderStyle};" disabled="true" value="${recallNames[i].value}""></div>`;
  }
  var correct = 0;
  for (let i = 0; i < personNum; i++) {
    correct += recallNames[i].value == names[i] ? 1 : 0;
  }
  resultInformation.innerHTML = `time used: ${memorizeTimeUsed} / ${recallTimeUsed} s<br><br>correct: ${correct}`;
  document.onkeydown = function (e) {
    if (e.code == "Enter") {
      ready();
    }
  }
}
function memorizeUnfocus(p) {
  p.height = tinyImageSize;
  p.width = tinyImageSize;
}
function memorizeFocus(p) {
  p.height = smallImageSize;
  p.width = smallImageSize;
}
function firstPerson() {
  memorizeUnfocus(memorizeFaces[memorizeCurr]);
  memorizeFocus(memorizeFaces[0]);
  memorizeCurrentFace.src = memorizeFaces[0].src;
  memorizeCurr = 0;
  memorizeCurrentName.innerHTML = names[memorizeCurr];
}
function lastPerson() {
  memorizeUnfocus(memorizeFaces[memorizeCurr]);
  memorizeFocus(memorizeFaces[personNum - 1]);
  memorizeCurrentFace.src = memorizeFaces[personNum - 1].src;
  memorizeCurr = personNum - 1;
  memorizeCurrentName.innerHTML = names[memorizeCurr];
}
function prevPerson() {
  if (memorizeCurr == 0) {
    return;
  }
  memorizeUnfocus(memorizeFaces[memorizeCurr--]);
  memorizeFocus(memorizeFaces[memorizeCurr]);
  memorizeCurrentFace.src = memorizeFaces[memorizeCurr].src;
  memorizeCurrentName.innerHTML = names[memorizeCurr];
}
function nextPerson() {
  if (memorizeCurr == personNum - 1) {
    return;
  }
  memorizeUnfocus(memorizeFaces[memorizeCurr++]);
  memorizeFocus(memorizeFaces[memorizeCurr]);
  memorizeCurrentFace.src = memorizeFaces[memorizeCurr].src;
  memorizeCurrentName.innerHTML = names[memorizeCurr];
}
function memorizeChooseFace(i) {
  memorizeUnfocus(memorizeFaces[memorizeCurr]);
  memorizeCurr = i;
  memorizeFocus(memorizeFaces[memorizeCurr]);
  memorizeCurrentFace.src = memorizeFaces[memorizeCurr].src;
  memorizeCurrentName.innerHTML = names[memorizeCurr];
}
function helpButtonClick() {
  if (recallHelp.style.display == "none") {
    recallHelp.style.display = "inline-block";
    recallNames[showOrder[recallCurr]].style.border = focusBorderStyle;
  }
  else {
    recallHelp.style.display = "none";
    recallNames[showOrder[recallCurr]].style.border = unfocusBorderStyle;
  }
}
function recallClickHelp(v) {
  recallNames[showOrder[recallCurr]].value = v;
  var original = recallCurr;
  while (recallCurr < personNum && recallNames[showOrder[recallCurr]].value) {
    recallCurr++;
  }
  if (recallCurr == personNum) {
    recallCurr = 0;
    while (recallCurr < personNum && recallNames[showOrder[recallCurr]].value) {
      recallCurr++;
    }
  }
  if (recallCurr == personNum) {
    recallCurr = original;
  }
  recallNames[showOrder[original]].style.border = unfocusBorderStyle;
  recallNames[showOrder[recallCurr]].style.border = focusBorderStyle;
}
function recallFocus(i) {
  recallNames[showOrder[recallCurr]].style.border = unfocusBorderStyle;
  recallCurr = i;
  if (recallHelp.style.display == "inline-block") {
    recallNames[showOrder[recallCurr]].style.border = focusBorderStyle;
  }
}
