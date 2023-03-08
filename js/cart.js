const cart = [] /** list of array of all products in cart.*/
retrieveCart() /** Retrive elements from local storage.*/

/** Retrive elements from local storage.*/
function retrieveCart() {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
       const item = localStorage.getItem(localStorage.key(i)) || '';
       const itemObject = JSON.parse(item);
 
       /** Request to API to retrive infos of product*/
       fetch(`http://localhost:3000/api/products/${ itemObject.id }`)
           .then((response) => response.json())
           .then((res) => {
              const cartItem = { ...itemObject, ...res };
              cart.push(cartItem);
              displayItem(cartItem);
              /** To display infos retrived*/
           })
           .catch((err) => console.error(err));
    }
 }

/** Make displayItem to display in cart.html*/
function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item) 
    article.appendChild(imageDiv)
    
    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)
    displayTotalQuantity()
    displayTotalPrice()
}

/** Make Article in cart.html from item*/
function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id /** Make Article by searching data by id*/
    article.dataset.color = item.color/** Make Article by searching data by color*/
    return article
}

/** Display Article in cart__items in cart.html*/
function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

/** Make ImageDiv(cart__item__img) to display in cart.html*/
function makeImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

/** Make img and append it to ImageDiv(cart__item__img) in cart.html*/
    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

/** Make CartContent(cart__item__content) to display in cart.html*/
function makeCartContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item) /** Make description(cart__item__content__description)*/    
    const settings = makeSettings(item)/** Make settings(cart__item__content__settings)*/ 

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

/** Make settings(cart__item__content__settings) in CartContent(cart__item__content) in cart.html*/ 
function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteButton(settings, item)
    return settings
}

/** Make description(cart__item__content__description) in CartContent(cart__item__content) in cart.html*/ 
function makeDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
    
}

/** Listen for the click on the quantity element. */
function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté : "
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.value = item.quantity
    input.min = "0"
    input.max = "100"
    input.addEventListener("input", (e) => updatePriceAndQuantity(input.value, item, e))/** to catch the quantity in input. */

    quantity.appendChild(p)
    settings.appendChild(quantity)
    quantity.appendChild(input)
}

/** Calculation of the total quantity to be displayed. */
function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, item) => total + item.quantity, 0)/** to calculate total and item in cart. */
    totalQuantity.textContent = total
}

/** Calculation of the total price to be displayed. */
function displayTotalPrice() {
    const totalPrice = document.querySelector("#totalPrice")
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)/** to calculate total and item. */
    totalPrice.textContent = total
}

/** Update product's quantity and price. */
function updatePriceAndQuantity (newValue, item, e) { /** newValue = updated "input.value" */
    if (newValue < 0 || newValue == null || newValue == 0 || newValue > 100) { /** to check if the cart is in correct number. */
        alert("Please enter a valid quantity")
        e.currentTarget.value = 0 
        return
  }
const itemToUpdate = cart.find(cartItem => cartItem.id === item.id)/** to find the id of the item updated. */
itemToUpdate.quantity = Number(newValue) /** not in text, in number */
item.quantity = itemToUpdate.quantity

displayTotalQuantity()
displayTotalPrice()
saveNewDataToCache(item)
}


/** Save new data to local storage. */
function saveNewDataToCache(item) {
    const dataToSave = JSON.stringify(item) /** change item data in string */
    const key = `${item.id}-${item.color}` /** to make key = different id for different color. */
    localStorage.setItem(key, dataToSave)
}

/** Add the delete button and send the item to delete. */
function addDeleteButton(settings,item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item)) /** to catch the item to delete and pass to deleteItem.*/

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

/** Delete the item. */
function deleteItem(item) { 
    const itemToDelete = cart.findIndex( /** to find only index of array to delete. */
        (product) => product.id === item.id && product.color === item.color) /** to find the item of the id and of the color of the one to delete. */
    cart.splice(itemToDelete,1) /** to remove indexes useless*/
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataFromCache(item)
    deleteArticleFromPage(item)
}

/** Delete the article from the page. */
function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]` /** the item of the id and of the color of the one to delete. */
        ) 
    articleToDelete.remove()
}

/** Remove the item from the dom and the local storage. */
function deleteDataFromCache(item) {
    const key = `${item.id}-${item.color}` /** the item of the id and of the color of the one to delete. */
    localStorage.removeItem(key)
}


// ********* ORDER FORM ********* //

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

/** Submit the order form */
function submitForm(e) {
    e.preventDefault() /** to prevent the default action(refresh the page). */
    if (cart.length === 0 || cart.length === null) { /** to check if the cart is empty. */
        alert("Your cart is empty!")
        return
    }

    if (isFirstNameInvalid() || isLastNameInvalid() || isAddressInvalid() || isCityInvalid() || isEmailInvalid()) return; /** to check if the form is valid. */

/** API request to send data. */   

const requestData = makeRequestData()

fetch("http://localhost:3000/api/products/order", {
    method : "POST", /** to send data to storage. */
    body : JSON.stringify(requestData), /** prepare data in string. */
    headers : {
        "Content-Type" : "application/json"
    }   
})
.then(response => response.json())
.then((data) => {
    const orderId = data.orderId
    localStorage.clear(); /** Clear all in local storage after validation of order. */

    /** Set confirm order id to local storage. */
    localStorage.setItem("orderId", JSON.stringify(orderId))

    /** Redirects to the confirmation page with order ID. */
    window.location.href = "confirmation.html?orderId=" + data.orderId
})
.catch((err) => console.error(err))
}

/** Make the request data for the request. */
function makeRequestData() {
    const form = document.querySelector(".cart__order__form") /** pick up data from the form filled in cart__order__form. */
    const contact = { /** to create an object with the data of the form. */
        firstName : form.elements.firstName.value,
        lastName : form.elements.lastName.value,
        address : form.elements.address.value,
        city : form.elements.city.value,
        email : form.elements.email.value
    }
    const products = cart.map(item => item.id) /** to create an array with the id of the items in cart. */
    const requestData = {
        contact,
        products
    }
return requestData
}

/** Get the id of the items from cache. */
function getIdsfromCache() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]   /** to remove after "-$color" */ 
        ids.push(item.id)
    }
    return ids
}

/** Validation or error message for first name. */
function isFirstNameInvalid() {
    const regex = /^[a-zA-ZÀ-ÿ-. ]+$/;
    const firstName = document.querySelector("#firstName").value;
    if (regex.test(firstName) === false) {
        document.querySelector("#firstNameErrorMsg").textContent = 
        "Please enter a valid first name.";
        return true;
    } else {
        document.querySelector("#firstNameErrorMsg").textContent = "";
}
}

/** Validation or error message for last name. */
function isLastNameInvalid() {
    const regex = /^[a-zA-ZÀ-ÿ-. ]+$/;
    const lastName = document.querySelector("#lastName").value;
    if (regex.test(lastName) === false) {
        document.querySelector("#lastNameErrorMsg").textContent = 
        "Please enter a valid last name.";
        return true;
    } else {
        document.querySelector("#lastNameErrorMsg").textContent = "";
}
}

/** Validation or error message for address. */
function isAddressInvalid() {
    const regex = /^[a-zA-Z0-9À-ÿ-. ]+$/;
    const address = document.querySelector("#address").value;
    if (regex.test(address) === false) {
        document.querySelector("#addressErrorMsg").textContent =
        "Please enter a valid address.";
        return true;
    } else {
        document.querySelector("#addressErrorMsg").textContent = "";
}
} 

/** Validation or error message for city. */
function isCityInvalid() {
    const regex = /^[a-zA-ZÀ-ÿ-. ]+$/;
    const city = document.querySelector("#city").value;
    if (regex.test(city) === false) {
        document.querySelector("#cityErrorMsg").textContent =
        "Please enter a valid city.";
        return true;
    } else {
        document.querySelector("#cityErrorMsg").textContent = "";
}
}

/** Validation or error message for email. */
function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address")
        return true;
    } else {
        document.querySelector("#emailErrorMsg").textContent = "";
}
}


/** Validation or error message for all fields. */
function isFormInvalid() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Please fill in all fields")
            return true
        }
        return false    
    }) 
}

