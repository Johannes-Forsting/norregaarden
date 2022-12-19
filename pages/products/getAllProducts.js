const SERVER_URL = "http://localhost:8080/api/products"

import { sanitizeStringWithTableRows } from "../../utils.js"

let products = []
let router
export async function initAllProducts(navigoRouter) {
    router = navigoRouter
    await showProducts()
    document.getElementById("submit-product").onclick = () =>{
        addProduct();
    }
    document.getElementById("submit-search").onclick = () =>{
        showFiltered();
    }
    document.getElementById("see-all").onclick = () =>{
        showProducts();
    }

    document.getElementById("main-table").onclick = (element) => {
        let id = element.target.id

        if (id.includes("-delete")) {
            deleteProduct(id.split('-delete')[0])
        }
        if (id.includes("-see")) {
            router.navigate(`single-product?id=${id.split('-see')[0]}`)
        }

    }
}

async function showProducts(){
    document.getElementById("tbody").innerHTML = ""
    try {
        products = await fetch(SERVER_URL)
            .then(res => res.json())
        console.log(products)
    } catch (e) {
        console.error(e)
    }
    postResult(products)

}

async function showFiltered(){
    const filter = document.getElementById("filter-name").value
    document.getElementById("tbody").innerHTML = ""
    try {
        products = await fetch(SERVER_URL)
            .then(res => res.json())
        console.log(products)
    } catch (e) {
        console.error(e)
    }
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(filter.toLowerCase()));

    postResult(filteredProducts)
}

function postResult(items){
    const rows = items.map(product => `
      <tr>
        <td>${product.name}</td>
        <td>${product.price},-</td>
        <td>${product.weight}</td>
        <td><button class="btn btn-primary" id="${product.id}-see">Edit</button></td>
        <td><button class="btn btn-primary" id="${product.id}-delete">Delete</button></td>
      `).join("")
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

}




async function addProduct(){
    const name = document.getElementById("input-name").value
    const price = document.getElementById("input-price").value
    const weight = document.getElementById("input-weight").value

    const newProduct = {
        name,
        price,
        weight
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newProduct)
    };

    const response = await fetch(SERVER_URL, options)
        .then((res) => res.json())
    //window.location.reload();
    if(response.ok){
        products.push(response)
    }
    await showProducts()
}

async function deleteProduct(id){
    var confirming = confirm("If you delete this product all productOrders containging this product will be deleted. Confirm?");
    if (confirming === true)
    {
        const options = {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        };
        const response = await fetch(SERVER_URL + "/" + id, options).then((res) => res.json())
        if(response.ok){
            products = products.filter(product => product.id !== response.id);
        }
        await showProducts()
    }

}














