const address = document.querySelector(
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

  if (data.rows) {
    // Create table, add heads
    let table = document.createElement("table");
    table.setAttribute("class", "u-full-width");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    let th1 = document.createElement("th");
    th1.innerHTML = "Paikka";
    tr.appendChild(th1);

    let th2 = document.createElement("th");
    th2.innerHTML = "Etäisyys";
    tr.appendChild(th2);

    let th3 = document.createElement("th");
    th3.innerHTML = "Matka-aika";
    tr.appendChild(th3);

    thead.append(tr);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    // Addresses
    data.origin_addresses.forEach((elem, index) => {
      let row = document.createElement("tr");
      let singleAddress = document.createElement("td");
      singleAddress.innerHTML = elem;
      row.appendChild(singleAddress);

      let singleDistance = document.createElement("td");
      singleDistance.innerHTML = data.rows[index].elements[0].distance.text;
      row.appendChild(singleDistance);

      let singleDuration = document.createElement("td");
      singleDuration.innerHTML = data.rows[index].elements[0].duration.text;
      row.appendChild(singleDuration);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    content.appendChild(table);
  } else {
    titleText.innerText = "Ei tietoja";
    content.innerHTML = "Aseta paikkatietoja chromen lisäosien asetuksista";
  }
  title.appendChild(titleText);
  listItem.appendChild(title);
  listItem.appendChild(content);
  items.insertBefore(listItem, items.firstChild);
};

if (address) {
  chrome.runtime.sendMessage({ address: address }, response => {
    appendData(response.data);
  });
} else {
  appendData(false);
}
