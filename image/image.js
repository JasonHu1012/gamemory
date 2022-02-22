const input = [document.getElementById("image-num"), document.getElementById("memorize-time"), document.getElementById("recall-time")]
const inputBlock = document.getElementById("input-block");
const startButton = document.getElementById("start-button");
const categorySelect = document.getElementById("category-select");
const countBlock = document.getElementById("count-block");
const countText = document.getElementById("count-text");
const skipButton = document.getElementById("skip-button");
const memorizeBlock = document.getElementById("memorize-block");
const memorizeCurrentImage = document.getElementById("memorize-current-image");
const memorizeCurrentImageNum = document.getElementById("memorize-current-image-num");
const allImages = document.getElementById("all-images");
const recallBlock = document.getElementById("recall-block");
const selectTo = document.getElementById("select-to");
const selectFrom = document.getElementById("select-from");
const recallCurrentImage = document.getElementById("recall-current-image");
const resultBlock = document.getElementById("result-block");
const resultImages = document.getElementById("result-images");
const resultInformation = document.getElementById("result-information");
const retryButton = document.getElementById("retry-button");
const bigImageSize = 330;
const mediumImageSize = 100;
const smallImageSize = 80;
const tinyImageSize = 35;
const imageMargin = 2;
const unfocusBorderStyle = "2px solid black";
const focusBorderStyle = "2px solid lightgreen";
const wrongBorderStyle = "2px solid red";
const blank = `${window.location.href.substr(0, window.location.href.lastIndexOf("/"))}/pic/blank.jpg`;
var choosed;
var accumulation;
var totalImage;
var imageNum;
var memorizeTime;
var recallTime;
var memorizeTimeUsed;
var recallTimeUsed;
var counting;
var images;
var memorizeCurr;
var memorizeImages;
var imagesTo;
var imagesFrom;
var recallCurr;
var showOrder;
memorizeCurrentImage.height = bigImageSize;
memorizeCurrentImage.width = bigImageSize;
memorizeCurrentImage.style.border = unfocusBorderStyle;
recallCurrentImage.height = bigImageSize;
recallCurrentImage.width = bigImageSize;
recallCurrentImage.style.border = unfocusBorderStyle;
recallCurrentImage.style.margin = `${imageMargin}px`;
for (let i in categoryNum) {
  categorySelect.innerHTML += `<div style="margin-top: 10px; display: inline-block"><label><input type="checkbox" class="category" 
  style="margin-right: 10px;" name="${i}">${i} (${categoryNum[i]})</label></div><br>`;
}
const category = document.getElementsByClassName("category");
for (let i of category) {
  i.checked = true;
}
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
  imageNum = parseInt(input[0].value);
  memorizeTime = parseInt(input[1].value);
  recallTime = parseInt(input[2].value);
  if (isNaN(imageNum) || isNaN(memorizeTime) || isNaN(recallTime) || imageNum <= 0 || memorizeTime <= 0 || recallTime <= 0) {
    alert("wrong input format!");
    return;
  }
  totalImage = 0;
  choosed = [];
  accumulation = [];
  for (let i of category) {
    if (i.checked) {
      choosed.push(i.name);
      accumulation.push(totalImage + categoryNum[i.name]);
      totalImage += categoryNum[i.name];
    }
  }
  if (imageNum > totalImage) {
    alert(`maximum: ${totalImage}`);
    return;
  }
  var imagesId = [Math.floor(Math.random() * totalImage)];
  for (let i = 1; i < imageNum; i++) {
    imagesId.push(Math.floor(Math.random() * totalImage));
    for (let j = 0; j < i; j++) {
      if (imagesId[i] == imagesId[j]) {
        imagesId.pop();
        i--;
        break;
      }
    }
  }
  images = [];
  for (let i of imagesId) {
    let currNum = 0;
    for (let j = 0; j < accumulation.length; j++) {
      if (accumulation[j] > i) {
        images.push(`pic/${choosed[j]}/${i - currNum}.jpg`)
        break;
      }
      currNum = accumulation[j];
    }
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
  memorizeImages = [];
  allImages.innerHTML = "";
  for (let i = 0; i < imageNum; i++) {
    allImages.innerHTML += `<img src=${images[i]} alt="error" height="${tinyImageSize}" 
      width="${tinyImageSize}" id="${i}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" 
      onclick="memorizeChooseImage(parseInt(this.id));" onmouseenter="memorizeChooseImage(parseInt(this.id));">`;
  }
  for (let i = 0; i < imageNum; i++) {
    memorizeImages.push(document.getElementById(`${i}`));
  }
  memorizeFocus(memorizeImages[0]);
  memorizeCurrentImage.src = `${images[0]}`;
  memorizeCurr = 0;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
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
        firstImage();
        break;
      case "ArrowDown":
        e.preventDefault();
        lastImage();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevImage();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextImage();
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
  for (let i = 0; i < imageNum; i++) {
    showOrder.push(i);
  }
  for (let i = 0; i < imageNum - 1; i++) {
    let j = i + Math.floor(Math.random() * (imageNum - i));
    let temp = showOrder[i];
    showOrder[i] = showOrder[j];
    showOrder[j] = temp;
  }
  imagesTo = [];
  imagesFrom = [];
  selectTo.innerHTML = "";
  selectFrom.innerHTML = "";
  for (let i = 0; i < imageNum; i++) {
    selectTo.innerHTML += `<div style="text-align: center; display: inline-block;"><img src=${blank} alt="error" height="${mediumImageSize}" 
    width="${mediumImageSize}" id="${i}-to" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" 
    onmouseenter="recallHoverImage(imagesTo, parseInt(this.id));" onclick="clickTo(parseInt(this.id));"><br>${i + 1}</div>`;
    selectFrom.innerHTML += `<img src=${images[showOrder[i]]} alt="error" height="${mediumImageSize}" width="${mediumImageSize}" 
      id="${i}-from" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}" onmouseenter="recallHoverImage(imagesFrom, 
        parseInt(this.id))" onclick="clickFrom(parseInt(this.id))">`;
  }
  for (let i = 0; i < imageNum; i++) {
    imagesTo.push(document.getElementById(`${i}-to`));
    imagesFrom.push(document.getElementById(`${i}-from`));
  }
  imagesTo[0].style.border = focusBorderStyle;
  recallCurr = 0;
  recallCurrentImage.src = blank;
}
function recalling() {
  recallBlock.style.display = "flex";
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
  resultImages.innerHTML = "";
  for (i = 0; i < imageNum; i++) {
    let s = `${images[imagesTo[i].userOrder]}`;
    resultImages.innerHTML += `<div style="height: ${mediumImageSize * 2.5}px; display: inline-block; text-align: center"><img src=${images[i]} 
    alt="error" height="${mediumImageSize}" width="${mediumImageSize}" style="margin: ${imageMargin}px; border: ${unfocusBorderStyle}">
    <br><img src=${imagesTo[i].userOrder == undefined ? blank : s} alt="error" height="${mediumImageSize}" width="${mediumImageSize}" 
    style="margin: ${imageMargin}px; border: ${imagesTo[i].userOrder == i ? focusBorderStyle : wrongBorderStyle}"><br>${i + 1}</div>`;
  }
  var correct = 0;
  for (let i = 0; i < imageNum; i++) {
    correct += imagesTo[i].userOrder == i ? 1 : 0;
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
function firstImage() {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeFocus(memorizeImages[0]);
  memorizeCurrentImage.src = memorizeImages[0].src;
  memorizeCurr = 0;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
}
function lastImage() {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeFocus(memorizeImages[imageNum - 1]);
  memorizeCurrentImage.src = memorizeImages[imageNum - 1].src;
  memorizeCurr = imageNum - 1;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
}
function prevImage() {
  if (memorizeCurr == 0) {
    return;
  }
  memorizeUnfocus(memorizeImages[memorizeCurr--]);
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
}
function nextImage() {
  if (memorizeCurr == imageNum - 1) {
    return;
  }
  memorizeUnfocus(memorizeImages[memorizeCurr++]);
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
}
function memorizeChooseImage(i) {
  memorizeUnfocus(memorizeImages[memorizeCurr]);
  memorizeCurr = i;
  memorizeFocus(memorizeImages[memorizeCurr]);
  memorizeCurrentImage.src = memorizeImages[memorizeCurr].src;
  memorizeCurrentImageNum.innerHTML = (memorizeCurr + 1).toString();
}
function recallHoverImage(arr, i) {
  if (arr[i].src == blank) {
    return;
  }
  recallCurrentImage.src = arr[i].src;
}
function clickTo(i) {
  if (imagesTo[i].src != blank) {
    imagesFrom[imagesTo[i].originalPlace].src = imagesTo[i].src;
    imagesTo[i].src = blank;
    imagesTo[i].originalPlace = undefined;
    imagesTo[i].userOrder = undefined;
  }
  imagesTo[recallCurr].style.border = unfocusBorderStyle;
  recallCurr = i;
  imagesTo[recallCurr].style.border = focusBorderStyle;
}
function clickFrom(i) {
  if (imagesFrom[i].src == blank) {
    return;
  }
  var original = recallCurr;
  imagesTo[recallCurr].src = imagesFrom[i].src;
  imagesFrom[i].src = blank;
  imagesTo[recallCurr].originalPlace = i;
  imagesTo[recallCurr].userOrder = showOrder[i];
  while (recallCurr < imageNum && imagesTo[recallCurr].src != blank) {
    recallCurr++;
  }
  if (recallCurr == imageNum) {
    recallCurr = 0;
    while (recallCurr < imageNum && imagesTo[recallCurr].src != blank) {
      recallCurr++;
    }
  }
  if (recallCurr == imageNum) {
    recallCurr = original;
  }
  imagesTo[original].style.border = unfocusBorderStyle;
  imagesTo[recallCurr].style.border = focusBorderStyle;
}
