import {URL_PRODUCTS, URL_DELIVERIES, URL_VANS, URL_PRODUCT_ORDERS} from "/settings.js"

import { sanitizeStringWithTableRows } from "../../utils.js"
let id
let totalPrice = 0
let totalWeight = 0
let productOrders = []
let vans = []

export async function initDelivery(match) {

    document.getElementById("van").style.display = "none"
    document.getElementById("van-header").innerText = ""

    document.getElementById("secondary-table").onclick = (element) => {
        let clickedId = element.target.id
        console.log(clickedId)
        if (clickedId.includes("-delete")) {
            deleteProductOrder(clickedId.split('-delete')[0])
        }
    }
    document.getElementById("submit-new-order").onclick = () => {
        addProductOrder()
    }

    document.getElementById("submit-van").onclick = () => {
        checkVanCapacity()
    }

    if (match?.params?.id) {
        id = match.params.id
        try {
            await getDelivery(id);
        } catch (err) {

        }
    }

}

async function getDelivery(id){
    let delivery
    try {
        delivery = await fetch(URL_DELIVERIES + "/" + id)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    const data = `
      <tr>
        <td>${delivery.deliveryDate}</td>
        <td>${delivery.fromWarehouse}</td>
        <td>${delivery.destination}</td>        
      `
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(data)

    try {
        const check = delivery.vanResponse
        document.getElementById("van-header").innerText = delivery.vanResponse.brand + " " + delivery.vanResponse.model + " has been assigned this delivery"
    }catch (e){
        console.log(e.error)
        document.getElementById("van-header").innerText = "This delivery has not been assigned a van. Do so below:"
        document.getElementById("van").style.display = "block"
        await getVans()
    }

    await getProductOrders()

}

async function getProductOrders(){
    try {
        productOrders = await fetch(URL_PRODUCT_ORDERS + "/by-delivery-id/" + id)

            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    showProductOrders()
}

function showProductOrders(){
    document.getElementById("secondary-tbody").innerHTML = ""
    console.log(productOrders)
    const rows = productOrders.map(productOrder => `
      <tr>
        <td>${productOrder.productResponse.name}</td>
        <td>${productOrder.productResponse.price}</td>
        <td>${productOrder.productResponse.weight}</td>        
        <td>${productOrder.quantity}</td>        
        <td><button class="btn btn-primary" id="${productOrder.id}-delete">Delete</button></td>
      `).join("")
    document.getElementById("secondary-tbody").innerHTML = sanitizeStringWithTableRows(rows)
    calculateWeightAndPrice()
    getOptions()
}

function calculateWeightAndPrice(){
    totalPrice = 0
    totalWeight = 0
    for (let i = 0; i < productOrders.length; i++) {
        totalPrice += productOrders[i].productResponse.price * productOrders[i].quantity
        totalWeight += productOrders[i].productResponse.weight * productOrders[i].quantity
    }
    document.getElementById("total-price").innerText = "Total price: " + totalPrice + ",-"
    document.getElementById("total-weight").innerText = "Total weight: " + totalWeight + "g"
}

async function getOptions(){
    try {
        const options = await fetch(URL_PRODUCTS).then(res => res.json())

        const optionsArray = options.map(
            product =>
                `
                <option value="${product.id}">${product.name}, ${product.price},-</option>
                `);
        const optionString = optionsArray.join("\n");
        document.getElementById("select-products").innerHTML = optionString;
    } catch (err) {
        console.log(err);
    }

}

async function deleteProductOrder(id){
    var confirming = confirm("Are you sure you want to delete this item?");
    if (confirming === true) {
        const options = {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        };
        try{
        const response = await fetch(URL_PRODUCT_ORDERS + "/" + id, options).then((res) => res.json())
            productOrders = productOrders.filter(productOrder => productOrder.id !== response.id);
        }
        catch (e){
            console.log(e.error)
        }

        await showProductOrders()
    }

}


async function addProductOrder(){
    const quantity = document.getElementById("input-quantity").value
    const productId = document.getElementById("select-products").value
    const deliveryId = id

    const newProductOrder = {
        quantity,
        productId,
        deliveryId
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newProductOrder)
    };

    const response = await fetch(URL_PRODUCT_ORDERS, options)
        .then((res) => res.json()).then()

    productOrders.push(response)
    showProductOrders()
}


async function getVans(){
    try {
        vans = await fetch(URL_VANS).then(res => res.json())

        const optionsArray = vans.map(
            van =>
                `
                <option value="${van.id}">${van.brand} ${van.model}, Capacity: ${van.capacity}g</option>
                `);
        const optionString = optionsArray.join("\n");
        document.getElementById("van-select").innerHTML = optionString;
    } catch (err) {
        console.log(err);
    }
}


async function checkVanCapacity(){
    const vanId = document.getElementById("van-select").value

    console.log(vans)
    console.log(vanId)
    for (let i = 0; i <vans.length ; i++) {
        if(vans[i].id == vanId){
            console.log("Van found")
            if(vans[i].capacity > totalWeight){
                await addVan(vanId)
            }else alert("Van cannot carry this heavy of a delivery")
        }
    }
}

async function addVan(vanId){
    const updatedDelivery = {
        id,
        vanId
    }
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updatedDelivery)
    }
    try {
        console.log(updatedDelivery)
        await fetch(URL_DELIVERIES, options)
        router.navigate(`deliveries`)
    }catch (e){
        console.log(e.error)
    }


}





