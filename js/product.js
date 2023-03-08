const queryString = window.location.search /** To find the Query String of URL */
const urlParams = new URLSearchParams(queryString) /** To get IDs in the Query String of URL */
const id = urlParams.get("id")

if (id != null) {
    let itemPrice = 0 /** To get the prices in data in line 97*/
    let imgUrl, altText, articleName /** To get them in data after line 98*/
}

/** Request to the api the product data from the ID. */
fetch(`http://localhost:3000/api/products/${id}`)
.then((response) => response.json())
.then((res) => handleData(res))
.catch((err) => console.error(err));

/** Handle data of "sofa" and name each elements.*/
function handleData(sofa) {
    const { altTxt, colors, description, imageUrl, name, price } = sofa
    itemPrice = price /** To get the prices in data in line 97*/
    imgUrl = imageUrl /** To get them in data after line 98*/
    altText = altTxt
    articleName = name
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeDescription(description)
    makeColors(colors)
}

/** Make "img" in item__img in product.html*/  
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null)parent.appendChild(image)
}

/** Make title in item__content__titlePrice in product.html*/
function makeTitle(name) {
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}

/** Make "span"=price in item__content__titlePrice in product.html*/
function makePrice(price) {
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

/** Make "p"=description in item__content in product.html*/
function makeDescription(description) {
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}

/** Make "select"=colors to cart in article in product.html*/
function makeColors(colors) {
    const select = document.querySelector("#colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color  
            select.appendChild(option)
        })

}
}

/** Handle the click on the add to cart button. */
const button = document.querySelector("#addToCart")
button.addEventListener("click", handleClick)

function handleClick() {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
    if (color == null || color === "" || quantity == null || quantity == 0 || quantity < 0 || quantity > 100)  {
        alert("Please select correct color and quantity")
        return
        }
        saveOrder(color, quantity)
    
        window.location.href = "cart.html" /** Redirecting to cart.html*/

    }

/** Add the product to local Storage. */
    function saveOrder(color, newQuantity)  { 
        const key = `${id}-${color}`
        let quantity = 0
        const product = localStorage.getItem(key)
        if (product != null) {
            quantity = JSON.parse(product).quantity
            console.log(JSON.parse(product))
        }
        const data = {
        id: id,
        color: color,
        quantity: Number(quantity) + Number(newQuantity) /** To get it in Number, not in string*/
    }

    localStorage.setItem(key, JSON.stringify(data))
/** local Storage cannot save objects so they has to be changed in string type.*/
}