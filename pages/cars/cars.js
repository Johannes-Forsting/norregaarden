const SERVER_URL = "http://localhost:8080/api/cars"

import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"

let cars = [];

//If not used with Navigo, just leave out match
export async function load() {
    try {
        cars = await fetch(SERVER_URL)
            .then(res => res.json())
        console.log(cars)
    } catch (e) {
        console.error(e)
    }
    const rows = cars.map(car => `
  <tr>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)


    // (C1-2) REDRAW PAGINATION

    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: load
    });


    //Update URL to allow for CUT AND PASTE when used with the Navigo Router (callHandler: false ensures the handler will not be called twice)
    window.router?.navigate(`/cars${queryString}`, { callHandler: false, updateBrowserURL: true })
}