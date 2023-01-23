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

    let marBookings = items.filter(booking => booking.startDate.split("-")[1].includes("03"));
    let aprBookings = items.filter(booking => booking.startDate.split("-")[1].includes("04"));
    let mayBookings = items.filter(booking => booking.startDate.split("-")[1].includes("05"));
    let junBookings = items.filter(booking => booking.startDate.split("-")[1].includes("06"));
    let julBookings = items.filter(booking => booking.startDate.split("-")[1].includes("07"));
    let augBookings = items.filter(booking => booking.startDate.split("-")[1].includes("08"));
    let sepBookings = items.filter(booking => booking.startDate.split("-")[1].includes("09"));
    let octBookings = items.filter(booking => booking.startDate.split("-")[1].includes("10"));
    let novBookings = items.filter(booking => booking.startDate.split("-")[1].includes("11"));

    postBookings(marBookings, "march")
    postBookings(aprBookings, "april")
    postBookings(mayBookings, "may")
    postBookings(junBookings, "june")
    postBookings(julBookings, "july")
    postBookings(augBookings, "august")
    postBookings(sepBookings, "september")
    postBookings(octBookings, "october")
    postBookings(novBookings, "november")

}

function postBookings(listOfBookings, month){
    document.getElementById("tbody-" + month).innerHTML = ""
    const rows = listOfBookings.map(booking => `
      <tr>
        <td>${booking.name}</td>
        <td>${booking.startDate}</td>
        <td>${booking.days}</td>
        <td><button class="btn btn-primary" id="${booking.startDate}-delete">Slet</button></td>
      `).join("")
    document.getElementById("tbody-" + month).innerHTML = sanitizeStringWithTableRows(rows)
}









async function deleteBooking(id){
    const URL_ENDING = "/startDate/" + id
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
    if(name !== "" && startDate !== "" && days !== ""){
        const newBooking = {
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














