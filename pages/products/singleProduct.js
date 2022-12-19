const SERVER_URL = "http://localhost:8080/api/products"

import { sanitizeStringWithTableRows } from "../../utils.js"
let id

export async function initProduct(match) {
    document.getElementById("status").innerText = ""
    document.getElementById("status-count").innerText = ""
    document.getElementById("input-name").innerText = ""
    document.getElementById("input-price").innerText = ""
    document.getElementById("input-weight").innerText = ""

    if (match?.params?.id) {
        id = match.params.id
        try {
            await getProduct(id);
        } catch (err) {

        }
    }



    document.getElementById("submit-change").onclick = () =>{
        change();
    }

}

async function getProduct(id){
    let product
    try {
        product = await fetch(SERVER_URL + "/" + id)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    console.log(product)
    document.getElementById("input-name").placeholder = product.name
    document.getElementById("input-price").placeholder = product.price + ",-"
    document.getElementById("input-weight").placeholder = product.weight + "g"

}

async function change(){
    const name =  document.getElementById("input-name").value
    const price =  document.getElementById("input-price").value
    const weight =  document.getElementById("input-weight").value

    const updatedProduct = {
        id: id,
        name: name,
        price: price,
        weight: weight
    };
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    };
    try {
        await fetch(SERVER_URL, options)
        document.getElementById("status").innerHTML = "Product with id: "+id+" was successfully updated. You will be redirected in: "
        document.getElementById("status-count").innerText = "3 seconds"
        setTimeout( () =>{
            router.navigate(`products`)
        }, 3000);
        setTimeout( () =>{
            document.getElementById("status-count").innerText = "1 second"
        }, 2000);
        setTimeout( () =>{
            document.getElementById("status-count").innerText = "2 seconds"
        }, 1000);
    }catch (e) {
        console.log(e)
        document.getElementById("status").innerHTML = "An error occurred while trying to edit delivery with id: "+id;
    }




}

