import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-313c2-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArr = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    clearShoppingListEl();

    shoppingListEl.innerHTML = `<li class="tile">No items here... yet</li>`;
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.classList.add("tile");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
