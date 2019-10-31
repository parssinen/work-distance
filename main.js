chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.etuovi.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  chrome.storage.sync.get(["locations"], data => {
    // Fetch form google distance matrix api
    console.log("Data", data);
    let addressesHolder = [];
    data.locations.forEach(elem => {
      console.log("asd", elem.address);
      addressesHolder.push(encodeURI(elem.address));
    });

    let addresses = addressesHolder.join("|");

    const targetAddress = encodeURI(req.address);
    let apiUrl =
      "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" +
      addresses +
      "&destinations=" +
      targetAddress +
      "&key=APIKEY";

    console.log("APIURL", apiUrl);
    fetch(apiUrl)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("DATA", data);
        sendResponse({ data: data });
      })
      .catch(error => console.error(error));
  });
  return true;
});
