import {URL_PRODUCTS} from "/settings.js"

let id
let product
let name
let price
let weight

export async function initProduct(match) {
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
    document.getElementById("status").innerText = ""
    document.getElementById("status-count").innerText = ""
    document.getElementById("input-name").value = ""
    document.getElementById("input-price").value = ""
    document.getElementById("input-weight").value = ""
    let product
    try {
        product = await fetch(URL_PRODUCTS + "/" + id)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    console.log(product)
    name = product.name
    price = product.price
    weight = product.weight
    document.getElementById("input-name").placeholder = product.name
    document.getElementById("input-price").placeholder = product.price + ",-"
    document.getElementById("input-weight").placeholder = product.weight + "g"

}

async function change(){

    const updatedProduct = getUpdatedProduct()
    console.log(updatedProduct)
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    };
    try {
        await fetch(URL_PRODUCTS, options)
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


function getUpdatedProduct(){
    const newName =  document.getElementById("input-name").value
    const newPrice =  document.getElementById("input-price").value
    const newWeight =  document.getElementById("input-weight").value

    if(newName !== ""){
        name = newName
    }
    if(newPrice !== ""){
        price = newPrice
    }
    if(newWeight !== ""){
        weight = newWeight
    }

    const updatedProduct = {
        id,
        name,
        price,
        weight
    };

    return updatedProduct

}

