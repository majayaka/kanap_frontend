const orderId = getOrderId()
displayOrderId(orderId)
deleteAllCache()

/** Get Order ID. */
function getOrderId() {
    const queryString = window.location.search /** To find the Query String of URL */
    const urlParams = new URLSearchParams(queryString) /** To get IDs in the Query String of URL */
    return urlParams.get("orderId")
}

/** Display Order ID. */
function displayOrderId() {
    const orderIdElement = document.querySelector("#orderId")
    orderIdElement.textContent = orderId
}

/** Delete all cache in local strage. */
function deleteAllCache() {
    const cache = window.localStorage
    cache.clear()
}
