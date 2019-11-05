const appendSkeleton = () => {
  let bodyElem = document.getElementsByTagName("body")[0];
  let link = document.createElement("link");
  link.setAttribute("type", "text/css");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute(
    "href",
    "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css"
  );
  bodyElem.appendChild(link);
};

window.addEventListener("load", function() {
  const targetAddress = document.querySelector(
    ".ItemSummaryContainer__alignLeft__2IE5Z"
  ).children[1].innerText;
  const items = document.querySelector(".CompactInfoRow__infoRow__2hjs_")
    .parentNode;

  const appendData = data => {
    const listItem = document.createElement("div");
    listItem.setAttribute(
      "class",
      "CompactInfoRow__infoRow__2hjs_ flexboxgrid__row__wfmuy"
    );
    const title = document.createElement("div");
    title.setAttribute(
      "class",
      "flexboxgrid__col-xs-12__1I1LS flexboxgrid__col-sm-4__3RH7g ItemHeader__itemHeader__32xAv"
    );
    const titleText = document.createElement("em");
    const content = document.createElement("div");
    content.setAttribute(
      "class",
      "flexboxgrid__col-xs-12__1I1LS flexboxgrid__col-sm-8__2jfMv CompactInfoRow__content__3jGt4"
    );

    console.log("Data", data);

    if (data.length != 0) {
      // Create table, add heads
      let table = document.createElement("table");
      table.setAttribute("class", "u-full-width");
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");

      let th1 = document.createElement("th");
      th1.innerHTML = "Paikka";
      tr.appendChild(th1);

      let th2 = document.createElement("th");
      th2.innerHTML = "Autolla";
      tr.appendChild(th2);

      let th3 = document.createElement("th");
      th3.innerHTML = "Julkisilla";
      tr.appendChild(th3);

      let th4 = document.createElement("th");
      th4.innerHTML = "Pyörällä";
      tr.appendChild(th4);

      thead.append(tr);
      table.appendChild(thead);

      let tbody = document.createElement("tbody");
      // Addresses
      data.forEach((elem, index) => {
        let row = document.createElement("tr");
        let singleAddress = document.createElement("td");
        singleAddress.innerHTML = elem.address;
        row.appendChild(singleAddress);

        let bikeData = document.createElement("td");
        bikeData.innerHTML = elem.cycling;
        row.appendChild(bikeData);

        let drivingData = document.createElement("td");
        drivingData.innerHTML = elem.driving;
        row.appendChild(drivingData);

        let transitData = document.createElement("td");
        transitData.innerHTML = elem.transit;
        row.appendChild(transitData);

        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      content.appendChild(table);
    } else {
      titleText.innerText = "Virhe, ei tietoja";
      content.innerHTML =
        "a) Onko paikat asetettu lisäosan asetuksista? b) Kokeile ladata sivu uudelleen";
    }
    title.appendChild(titleText);
    listItem.appendChild(title);
    listItem.appendChild(content);
    items.insertBefore(listItem, items.firstChild);
  };

  if (targetAddress) {
    chrome.runtime.sendMessage({ address: targetAddress }, response => {
      appendData(response.data);
      appendSkeleton();
    });
  } else {
    appendData(false);
  }
});
