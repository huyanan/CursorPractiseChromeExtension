'use strict';

// console.log('\'Allo \'Allo! Content script');
var circle = null;
var fly = null;
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
// 整个苍蝇
function renderFly({x,y}) {
  fly = document.createElement('img');
  fly.className = 'fly';
  fly.src = 'https://cdn.huyanan.site/296cd4c3216a4b35b834c948e3333556.jpeg';
  fly.style.position = 'absolute';
  fly.style.left = x + 'px';
  fly.style.top = y + 'px';
  fly.addEventListener('click', onClickShootMe);
  document.body.appendChild(fly);
}

function onClickShootMe(event) {
  removeCircle();
  removeFly();
  shootAudio();
  createCircle();
  // createFly();
}

function createCircle() {
  renderCircle(getRandomPos());
}
function createFly() {
  renderFly(getRandomPos());
}
function removeCircle() {
  if (!circle) {
    return;
  }
  circle.removeEventListener('click', onClickShootMe);
  circle.parentNode.removeChild(circle);
  circle = null;
}
function removeFly() {
  if (!fly) {
    return;
  }
  fly.removeEventListener('click', onClickShootMe);
  fly.parentNode.removeChild(fly);
  fly = null;
}


chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.shoot !== undefined) {
          freshPage(request);
        } else if (request.imageHide !== undefined) {
          toggleImage(request.imageHide)
        } else if (request.vbaike !== undefined) {
          vbaikeHide(request);
        }
        sendResponse('popup返回值');
    }
);
chrome.storage.sync.get('shoot', function (items) {
  freshPage(items)
});
chrome.storage.sync.get('vbaike', function (items) {
  vbaikeHide(items)
})
chrome.storage.sync.get('imageHide', (items) => {
  if (items.imageHide) {
    toggleImage(items.imageHide)
  }
  window.addEventListener('load', () => {
    insertCSS();
    if (items.imageHide) {
      toggleImage(items.imageHide)
    }
  })
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
}


// 播放枪声
function shootAudio() {
  var audio = document.createElement('audio');
  // audio.src = 'https://hyn-1251008690.cos.ap-beijing.myqcloud.com/my-project/Kar98K.mp3';
  audio.src = 'data:audio/mp3;base64,SUQzAwAAAAAHdlRDT04AAAANAAAB//52UdZO85dQTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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9xv/y081iK5A8DHgEQSWcH+0YPz4yfbWZ5l62nXD6O/Lhm8xT/cOj4Mnj4Gb3SZ8MET4dApenLLLbbJKOQHg//uSANGAAwE0VWsPQthepoqtYYhbDPh9XSexKTHFFCt09hktqjEFQDYnJ1ZUEQAgZJYxiqFQywiRSollHAIlVVpwUk+USJbTzlU5FGSKJ4LrJKSG+CoiosFhNkgWElYGSgqIqNiwmzRULFg0bF40dNlicbCxZNGxecOFQsnmy49cdFxYOFQuPNl//////////////////////////////////////8maay223W22EhENMmKxMyuNJXMLjlCFQMwIiaEtVZkila29YVPQkrMUWBiTo5U0S2ZavWyRUckWR0iRgkk5GDUWrTZY7Kp5lqetmWrXR5qLVsyxuUlFRFBoLCSlQWElJigqKiJDQWEmKioWJU0bFZcdNlx5svPdbXffMP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7kgDEgARqHFXpiTJKemcKzT0mW0AAAS4AAAAgAAAlwAAABP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5IA/4AL8ABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAw=';
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

// 动态创建的图片可能在页面加载后出现，所以我们监听DOM变化，并隐藏新创建的图片
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node.style.display = 'none';
        }
      });
    }
  });
});



// 隐藏显示图片
function toggleImage(toggle) {
  var images = document.getElementsByTagName('img');
  var image = null;
  for (var i = 0; i < images.length; i++) {
    image = images[i];
    if (toggle) {
      image.style.display = 'none';
      image.style.opacity = 0;
      // image.dataset.height = image.style.height;
      // image.style.height = '0'
      image.style.visibility = 'hidden'
      image.dataset.src = image.src
      image.src=''
      image.classList.add('hide')
    } else {
      image.style.display = 'inline-block';
      image.style.opacity = 1;
      // if (image.dataset.height) {
      //   image.style.height = image.dataset.height
      // } else {
      //   image.style.height = ''
      // }
      image.style.visibility = 'initial'
      if (image.dataset.src) {
        image.src = image.dataset.src
      }
      image.classList.remove('hide')
    }
  }
  if (toggle) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    observer.disconnect()
  }
}

// 注入class
function insertCSS () {
  // 创建一个style元素
  var style = document.createElement('style');
  
  // 设置style内容
  style.innerHTML = `
    .hide {
      display: none !important;
    }
  `;
  
  // 将style元素插入到head中
  document.head.appendChild(style);
}

// 自动播放xvideos的视频
function xvideos() {
  $('.icon.download').click()
  var videoSrc = $('#tabDownload a').first().attr('href')
  var video = document.createElement('video')
  video.width = '640px'
  video.width = '520px'
  video.src = videoSrc
  video.autoplay = autoplay
  // $('')
}
// 隐藏v 百科
function vbaikeHide(request) {
  var display = request.vbaike?'none':'block'
  try {
    document.getElementsByClassName('lemmaWgt-promotion-vbaike')[0].style.display = display;
    document.getElementsByClassName('lemmaWgt-promotion-rightPreciseAd')[0].style.display = display;
    document.getElementsByClassName('lemmaWgt-promotion-slide')[0].style.display = display;
    document.getElementById('side-share').style.display = display;
  } catch (Exception) {
    // console.log(Exception)
  }
}
