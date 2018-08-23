'use strict';

console.log('\'Allo \'Allo! Content script');
var circle = null;
// 获取随机位置
function getRandomPos(){
  const xStart = window.scrollX;
  const yStart = window.scrollY;
  const screenW = document.documentElement.clientWidth;
  const screenH = document.documentElement.clientHeight;
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
        freshPage(request.shoot);
        sendResponse('popup返回值');
    }
);
chrome.storage.sync.get('shoot', function (items) {
  console.log(items);
  freshPage(items.shoot)
});
// createCircle();
function freshPage (shoot) {
  if (shoot) {
    removeCircle();
    createCircle();
  } else {
    removeCircle();
  }
}