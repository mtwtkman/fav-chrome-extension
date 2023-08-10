chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const url = request.url.replace(/^fav:/, "");
  window.open(url, "_blank");
  sendResponse({done: true});
});
