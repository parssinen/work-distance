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
    let addressesHolder = [];
    data.locations.forEach(elem => {
      addressesHolder.push(encodeURI(elem.address));
    });

    const modes = ["bicycling", "driving", "transit"];
    const addresses = addressesHolder.join("|");
    let targetAddress = encodeURI(req.address.split(",")[0]);

    const apiUrlFactory = mode => {
      return (apiUrl =
        "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" +
        addresses +
        "&destinations=" +
        targetAddress +
        "&mode=" +
        `${mode}` +
        `&key=YOUR_API_KEY_HERE`);
    };

    const attemptSending = responses => {
      if (responses.length === modes.length) {
        let destination = [];
        let addressCurator = [];
        responses.forEach((transportMode, transportIndex) => {
          transportMode.rows.forEach((elem, i) => {
            addressCurator.push(transportMode.origin_addresses[i]);
            let combinedDistanceDuration =
              elem.elements[0].distance.text +
              "/" +
              elem.elements[0].duration.text;
            destination.push(combinedDistanceDuration);
          });
        });
        const addressCount = responses[0].origin_addresses.length;
        const addressesWithData = [];
        console.log("Data", responses);

        for (let i = 0; i < addressCount; i++) {
          let addressInc = responses[0].origin_addresses[i];
          let daatta = {};
          daatta["address"] = addressInc;

          daatta["cycling"] =
            responses[0].rows[i].elements[0].distance.text +
            "/" +
            responses[0].rows[i].elements[0].duration.text;

          daatta["driving"] =
            responses[1].rows[i].elements[0].distance.text +
            "/" +
            responses[1].rows[i].elements[0].duration.text;

          daatta["transit"] =
            responses[2].rows[i].elements[0].distance.text +
            "/" +
            responses[2].rows[i].elements[0].duration.text;

          addressesWithData.push(daatta);
        }

        sendResponse({ data: addressesWithData });
      }
    };

    Promise.all([
      fetch(apiUrlFactory("cycling")).then(res => res.json()),
      fetch(apiUrlFactory("driving")).then(res => res.json()),
      fetch(apiUrlFactory("transit")).then(res => res.json())
    ])

      .then(([cycling, driving, transit]) => {
        const responses = [];
        responses.push(cycling);
        responses.push(driving);
        responses.push(transit);
        attemptSending(responses);
      })
      .catch(err => {
        console.error(err);
      });
  });
  return true;
});
