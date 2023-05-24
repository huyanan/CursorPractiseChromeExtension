/*
 * @Author: HuYanan
 * @Date: 2022-08-17 13:51:19
 * @LastEditTime: 2023-05-24 16:07:46
 * @LastEditors: HuYanan
 * @Description: 
 * @Version: 0.0.1
 * @FilePath: /CursorPractiseChromeExtension/app/scripts.babel/popup.js
 * @Contributors: [HuYanan, other]
 */
'use strict';

// console.log('\'Allo \'Allo! Popup');
var shootBtn = document.getElementById('shoot-button');
var imageHide = document.getElementById('image-hide');
var vbaikeHide = document.getElementById('vbaike-hide');
var messageType = 'normal';
var shootMessageType = 'shoot';
var vbaikeMessageType = 'vbaike'
// var checked = window.localStorage.getItem('shoot');
chrome.storage.sync.get('shoot', function (items) {
  // console.log(items);
  var shoot = items.shoot;
  shootBtn.checked = shoot;
  // shootChange(shoot);
});
chrome.storage.sync.get('vbaike', function (items) {
  // console.log(items);
  var vbaike = items.vbaike || false;
  vbaikeHide.checked = vbaike;
  // vbaikeHideChange(vbaike);
});
chrome.storage.sync.get('imageHide', (items) => {
  console.log('imageHide', items);
  var imageHideChecked = items.imageHide || false;
  imageHide.checked = imageHideChecked;
});

shootBtn.addEventListener('click', shootChange);

function shootChange() {
  var checked = shootBtn.checked;
  // window.localStorage.setItem('shoot',checked);
  chrome.storage.sync.set({
    'shoot': checked
  }, function (items) {
    // console.log(items);
  });
  sendMessage({
    shoot: checked
  });
}

function sendMessage(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, Object.assign({ message: messageType }, data), function (response) {
      if (typeof response != 'undefined') {
        // alert(response);
      } else {
          // alert("response为空=>"+response);
        }
    }); //end  sendMessage
  }); //end query
}

imageHide.addEventListener('click', onClickImageHide);
function onClickImageHide() {
  var checked = imageHide.checked;
  chrome.storage.sync.set({
    'imageHide': checked
  }, function (items) {
    // console.log(items);
  });
  sendMessage({
    imageHide: checked
  });
}

// 隐藏v百科
function vbaikeHideChange() {
  var checked = vbaikeHide.checked;
  chrome.storage.sync.set({
    'vbaike': checked
  }, function (items) {
    // console.log(items);
  });
  sendMessage({
    vbaike: checked
  });

  return true
}
vbaikeHide.addEventListener('click', vbaikeHideChange)
