'use strict';

console.log('\'Allo \'Allo! Content script');
var circle = null;
// 获取随机位置
function getRandomPos(){
  const xStart = window.scrollX;
  const yStart = window.scrollY;
  const screenW = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
  const screenH = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
  let x = 0;
  let y = 0;
  x = Math.random()*screenW + xStart;
  y = Math.random()*screenH + yStart;
  return {
    x,
    y
  }
}
function renderCircle({x,y}) {
  circle = document.createElement('div');
  circle.className = 'shoot-me';
  circle.style.position = 'absolute';
  circle.style.left = x+'px';
  circle.style.top = y+'px';
  circle.addEventListener('click', onClickShootMe);
  document.body.appendChild(circle);
}

function onClickShootMe(event) {
  removeCircle();
  shootAudio();
  createCircle();
}

function createCircle() {
  renderCircle(getRandomPos());
}
function removeCircle() {
  if (!circle) {
    return;
  }
  circle.removeEventListener('click', onClickShootMe);
  circle.parentNode.removeChild(circle);
  circle = null;
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        // alert("前端/后端/Popup收到");
        // console.log(request, sender);
        freshPage(request);
        sendResponse('popup返回值');
    }
);
chrome.storage.sync.get('shoot', function (items) {
  console.log(items);
  freshPage(items)
});
// createCircle();
function freshPage (request) {
  if (request.shoot != undefined) {
    if (request.shoot) {
      removeCircle();
      createCircle();
    } else {
      removeCircle();
    }
  }
  if (request.imageHide != undefined) {
    if (request.imageHide) {
      toggleImage(request.imageHide);
    } else {
      toggleImage(request.imageHide);
    }
  }
}


// 播放枪声
function shootAudio() {
  var audio = document.createElement('audio');
  audio.src = 'https://hyn-1251008690.cos.ap-beijing.myqcloud.com/my-project/Kar98K.mp3';
  audio.autoplay = 'autoplay';
  var onEndedFunc = null;
  function onEnded (audio) {
    return function () {
      audio.removeEventListener('ended', onEndedFunc);
      document.body.removeChild(audio);
      audio = null;
    }
  }
  onEndedFunc = onEnded(audio);
  audio.addEventListener('ended', onEndedFunc);
  document.body.appendChild(audio);
}

// 隐藏显示图片
function toggleImage(toggle) {
  var images = document.getElementsByTagName('img');
  var image = null;
  for (var i = 0; i < images.length; i++) {
    image = images[i];
    if (toggle) {
      image.style.display = 'none';
    } else {
      image.style.display = 'inline-block';
    }
  }
}