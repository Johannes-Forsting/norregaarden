import {URL_DELIVERIES} from "/settings.js"

import { sanitizeStringWithTableRows } from "../../utils.js"


let deliveries = []
export async function initAllDeliveries() {

    await getDeliveries()
    document.getElementById("submit-delivery").onclick = () =>{
        addDelivery();
    }

    document.getElementById("main-table").onclick = (element) => {
        let id = element.target.id
        console.log(id)
        if (id.includes("-delete")) {
            deleteDelivery(id.split('-delete')[0])
        }
        if (id.includes("-see")) {
            router.navigate(`single-delivery?id=${id.split('-see')[0]}`)
        }
    }
}

async function getDeliveries(){

    try {
        deliveries = await fetch(URL_DELIVERIES)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    showDeliveries()
}

function showDeliveries(){
    console.log(deliveries)
    document.getElementById("tbody").innerHTML = ""
    const rows = deliveries.map(delivery => `
      <tr>
        <td>${delivery.deliveryDate}</td>
        <td>${delivery.fromWarehouse}</td>
        <td>${delivery.destination}</td>        
        <td><button class="btn btn-primary" id="${delivery.id}-see">See Delivery</button></td>
        <td><button class="btn btn-primary" id="${delivery.id}-delete">Delete</button></td>
      `).join("")
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)
}




async function addDelivery(){
    const deliveryDate = document.getElementById("input-delivery-date").value
    const fromWarehouse = document.getElementById("input-from-warehouse").value
    const destination = document.getElementById("input-destination").value


    if(deliveryDate !== "" || fromWarehouse !== "" || destination !== ""){
        const newDelivery = {
            deliveryDate,
            fromWarehouse,
            destination
        }
        console.log(newDelivery)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newDelivery)
        };
        try{
            const response = await fetch(URL_DELIVERIES, options)
                .then((res) => res.json())
            deliveries.push(response)
            showDeliveries()
        }catch (e){
            console.log(e.error)
        }
    }


}

async function deleteDelivery(id){
    var confirming = confirm("If you delete this delivery all productOrders containing this delivery will be deleted. Confirm?");
    if (confirming === true)
    {
        const options = {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        };
        try {
            const response = await fetch(URL_DELIVERIES + "/" + id, options).then((res) => res.json())
            deliveries = deliveries.filter(delivery => delivery.id !== response.id);
        }catch (e){
            console.log(e.error)
        }
        showDeliveries()
    }

}














