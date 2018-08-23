'use strict';

console.log('\'Allo \'Allo! Popup');
var shootBtn = document.getElementById('shoot-button');
// var checked = window.localStorage.getItem('shoot');
chrome.storage.sync.get('shoot', function (items) {
  console.log(items);
  var shoot = items.shoot;
  shootBtn.shoot = shoot;
  shootChange(shoot);
});

shootBtn.addEventListener('click', shootChange);

function shootChange() {
  var checked = shootBtn.checked;
  // window.localStorage.setItem('shoot',checked);
  chrome.storage.sync.set({
    'shoot': checked
  }, function (items) {
    console.log(items);
  });
  sendMessage(checked);
}

function sendMessage(checked) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){  
      chrome.tabs.sendMessage(tabs[0].id, {message:'calculate', shoot: checked}, function(response) {
          if(typeof response !='undefined'){
              // alert(response);
          }else{
              // alert("response为空=>"+response);
          }
      });//end  sendMessage   
  }); //end query
}