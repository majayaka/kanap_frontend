/** Request to the api to get data. */
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => addProducts(data))
    .catch((err) => console.error(err));
        
/** Change data into "products" and loop each kanap and distribute, and name each elements.*/
function addProducts(products) {
    products.forEach((kanap) => {
        const {_id, imageUrl, altTxt, name, description} = kanap
        const anchor = makeAnchor(_id)
        const article = document.createElement("article")/** Make element "article" in index.html*/
        const image = makeImage(imageUrl, altTxt)
        const h3 = makeH3(name)
        const p =  makeParagraph(description)

/** Append all elements to distribute to articles and each elements of "array".*/
    appendArticleToAnchor(anchor, article)
    appendElementsToArticle(article, [image, h3, p]) 
})
}

/** Loop and append all elements to distribute to articles and each elements of "array".*/
function appendElementsToArticle(article, array) {
    array.forEach((item)=> {
        article.appendChild(item)
    })
}

/** Make Anchor "a.href" in index.html*/   
function makeAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
} 

/** Append article and Anchor "a.href" to section "items" in index.html*/
function appendArticleToAnchor(anchor, article) {
    const items = document.querySelector("#items")
    items.appendChild(anchor)
    anchor.appendChild(article)
}
   

/** Make "img" in article in index.html*/  
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

/** Make "h3" in article in index.html*/  
function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

/** Make "p" in article in index.html*/  
function makeParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescrirption")
    return p
}
    