import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champion-26609-default-rtdb.firebaseio.com"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const commentListRef = ref(database, "commentList")

const commentEl = document.getElementById("comment");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");
const publishBtnEl = document.getElementById("publish-btn");
const commentListEl = document.getElementById("comment-list");

// Input then publish
publishBtnEl.addEventListener("click", () => {
    const commentValue = commentEl.value;
    const fromValue = fromEl.value;
    const toValue = toEl.value;

    if (commentValue === "" || fromValue === "" || toValue === "") {
        if (commentValue === "") {
            commentEl.style.border = "1px solid red";
        }
        if (fromValue === "") {
            fromEl.style.border = "1px solid red";
        }
        if (toValue === "") {
            toEl.style.border = "1px solid red";
        }
        return;
    }

    const data = {
        comment: commentValue,
        from: fromValue,
        to: toValue,
        heart: "0"
    }

    push(commentListRef, data);

    clearAll();
});

onValue(commentListRef, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearCommentListEl()

        for (let i = itemsArray.length - 1; i >= 0; i--) {
            let currentItem = itemsArray[i]

            appendItemToCommentListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearAll() {
    commentEl.value = "";
    fromEl.value = "";
    toEl.value = "";
    commentEl.style.border = "transparent";
    fromEl.style.border = "transparent";
    toEl.style.border = "transparent";
}

function clearCommentListEl() {
    commentListEl.innerHTML = "";
}

function appendItemToCommentListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    newEl.innerHTML = `
      <p class="fromTo-li">To ${itemValue.to}</p>
      <p class="real-cmt">${itemValue.comment}</p>
      <p class="fromTo-li">From ${itemValue.from}</p>
      <div class="heart">
        <i id ="trash-${itemID}" class="fa fa-trash"></i>
        <i id="${itemID}" class="fa fa-heart"></i>
        <span id="heartCount-${itemID}">${itemValue.heart}</span>
      </div>
    `;

    const heartIcon = newEl.querySelector(`#${itemID}`);
    heartIcon.addEventListener("click", () => {
        increaseHeartCount(itemID);
    });

    const trashCan = newEl.querySelector(`#trash-${itemID}`);
    trashCan.addEventListener("dblclick", function(){
        let exactLocationOfItemInDB = ref(database, `commentList/${itemID}`)

        remove(exactLocationOfItemInDB);
    })
    commentListEl.append(newEl);
}


function increaseHeartCount(itemId) {
    const heartCountEl = document.getElementById(`heartCount-${itemId}`);
    let currentCount = parseInt(heartCountEl.textContent);

    currentCount++;

    heartCountEl.textContent = currentCount;

    const itemRef = ref(database, `commentList/${itemId}`);
    update(itemRef, { heart: currentCount });
}
