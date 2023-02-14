import {URL_API} from "/settings.js"

import { sanitizeStringWithTableRows } from "../../utils.js"

let bookings = []

export async function initAllBookings() {

    await getBookings()

    document.getElementById("main-table").onclick = (element) => {
        let id = element.target.id
        console.log(id)
        if (id.includes("-delete")) {
            deleteBooking(id.split('-delete')[0])
        }
    }

    document.getElementById("submit-booking").onclick = () =>{
        addBooking()
    }


}

async function getBookings(){


    try {
        bookings = await fetch(URL_API)
            .then(res => res.json())
        console.log(bookings)
    } catch (e) {
        console.error(e)
    }
    sortBookings(bookings)
}

function sortBookings(items){

    items.sort(function (a, b) {
        var dateA = new Date(a.startDate), dateB = new Date(b.startDate)
        return dateA - dateB
    });

    const months = ["march", "april", "may", "june", "july", "august", "september", "october", "november"]

    const monthNumbers = ["03", "04", "05", "06","07", "08","09","10", "11",]
    for (let i = 0; i < months.length; i++) {
        let currentBookings = items.filter(booking => booking.startDate.split("-")[1].includes(monthNumbers[i]));
        postBookings(currentBookings, months[i])
    }

}

function postBookings(listOfBookings, month){
    document.getElementById("tbody-" + month).innerHTML = ""
    const rows = listOfBookings.map(booking => `
      <tr>
        <td>${booking.name}</td>
        <td>${booking.startDate.split('-').reverse().join('-')}</td>
        <td>${booking.days}</td>
        <td><button class="btn btn-warning" id="${booking.id}-delete">Slet</button></td>
      `).join("")
    document.getElementById("tbody-" + month).innerHTML = sanitizeStringWithTableRows(rows)
}









async function deleteBooking(id){
    const URL_ENDING = "/id/" + id
    var confirming = confirm("Er du sikker?");
    if (confirming === true)
    {
        const options = {
            method: "DELETE",
        };
        await fetch(URL_API + URL_ENDING, options).then((res) => res.json())
        await getBookings()
    }

}


async function addBooking(){
    const name = document.getElementById("input-name").value
    const startDate = document.getElementById("input-date").value
    const days = document.getElementById("input-days").value
    const id = getNextId()
    if(name !== "" && startDate !== "" && days !== ""){
        const newBooking = {
            id,
            name,
            startDate,
            days
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newBooking)
        };

        try{
            const response = await fetch(URL_API, options)
                .then((res) => res.json()).then()
            bookings.push(newBooking)
            sortBookings(bookings)
        }catch (e){
            console.log(e.error)
        }
    }
}

function getNextId(){

    const value = Math.max(...bookings.map(booking => booking.id))
    console.log(value)
    return value + 1
}














