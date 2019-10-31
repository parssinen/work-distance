const addPlace = (event, place) => {
  console.log("PLACE", place);
  const placeList = document.querySelector(".places-list");

  let newRow = document.createElement("div");
  newRow.setAttribute("class", "row");

  let placeNameInput = document.createElement("input");
  placeNameInput.setAttribute("type", "text");
  placeNameInput.setAttribute("placeholder", "Paikan nimi");
  placeNameInput.setAttribute("name", "placeName");
  if (place) {
    placeNameInput.value = place.name;
  }
  newRow.appendChild(placeNameInput);

  let addressInput = document.createElement("input");
  addressInput.setAttribute("type", "text");
  addressInput.setAttribute("placeholder", "Osoite");
  addressInput.setAttribute("name", "placeAddress");
  if (place) {
    addressInput.value = place.address;
  }
  newRow.appendChild(addressInput);

  placeList.appendChild(newRow);
};

const showSavedData = () => {
  chrome.storage.sync.get(["locations"], result => {
    const savedLocations = result.locations;
    if (savedLocations) {
      savedLocations.forEach(item => {
        addPlace(undefined, item);
      });
    } else {
      addPlace();
    }
  });
};

window.addEventListener("load", function() {
  showSavedData();

  const saveChanges = event => {
    event.preventDefault();

    const placeNames = document.getElementsByName("placeName");
    const placeAddresses = document.getElementsByName("placeAddress");
    const places = [];

    placeNames.forEach((item, index) => {
      let place = {
        name: item.value,
        address: placeAddresses[index].value
      };
      places.push(place);
    });

    chrome.storage.sync.set({ locations: places }, function() {
      console.log("Locations set to: ", places);
    });
  };

  document.getElementById("save-data").addEventListener("click", saveChanges);
  document.getElementById("add-place").addEventListener("click", addPlace);
});
