/*
 * @Author: HuYanan
 * @Date: 2022-08-17 13:51:19
 * @LastEditTime: 2023-05-24 16:03:51
 * @LastEditors: HuYanan
 * @Description: 
 * @Version: 0.0.1
 * @FilePath: /CursorPractiseChromeExtension/app/scripts.babel/chromereload.js
 * @Contributors: [HuYanan, other]
 */
'use strict';

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// WARNING: only supports reload command.

const LIVERELOAD_HOST = 'localhost:';
const LIVERELOAD_PORT = 35729;
const connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');

var lastReload = false;

chrome.runtime.onInstalled.addListener(function(details) {
  lastReload = Date.now();
});    

connection.onerror = error => {
  console.log('reload connection got error:', error);
};

connection.onmessage = e => {
  if (e.data) {
    const data = JSON.parse(e.data);
    if (data && data.command === 'reload') {
      var currentTime = Date.now();
      if (lastReload && currentTime - lastReload > 60000) {
        // don't reload more than once a minute
        if (chrome.runtime) {
          chrome.runtime.reload();
        }
        if (chrome.developerPrivate) {
          chrome.developerPrivate.reload(chrome.runtime.id, {failQuietly: true});
        }
      }
    }
  }
};

