const SERVER_URL = "http://localhost:8080/api/cars"

import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 10
const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend


let cars = [];

const models = ["Wind", "100 NX", "Civic Aerodeck", "323 Combi", "Countryman", "Logan MCV", "T5 Caravelle", "407 SW", "A2", "A5", "Supra", "A7", "Alto", "Grand Vitara XL-7", "Superb", "C4 Coupé", "Altea", "Getz", "Mégane", "Scudo Kombi", "A L", "Ignis", "350 Z", "Exeo ST", "2", "City-Coupé", "5", "1100", "207 CC", "924", "Fabia Sedan", "ix55", "807", "IS-F", "A", "Passat Variant Van", "Accord Tourer", "A4 Cabriolet", "E", "Pajero", "G", "i10", "Carina", "Cooper D Clubman", "H200", "RX 300", "M", "C2", "Duster", "3000 GT", "C4", "Q", "Cordoba", "BT", "Stratus Cabrio", "C8", "Sandero", "Seicento", "Outback", "Lublin", "Lacetti SW", "Xsara", "Corolla Combi", "Cayman", "CC", "9-3 Cabriolet", "i20", "Galloper", "CL", "Rapid", "Corolla sedan", "S-Max", "CT", "HR-V", "Cruze SW", "Venga", "Defender", "Marea Weekend", "944", "T4 Multivan", "Patrol", "Cooper", "Legacy", "Espero", "i30", "911 Targa", "Legacy Wagon", "Aerostar", "Crossfire", "Evasion", "Cruze", "9-3 SportCombi", "Astra caravan", "80 Avant", "Exeo", "Sequoia", "Justy", "i40", "Nubira", "Stratus", "L200 Pick up Allrad", "MX-6", "Levorg", "Bora Variant", "EX", "Town & Country", "Kadett", "MX-5", "Talisman", "Pulsar", "XJ12", "605", "Primera", "CX-7", "Ibiza ST", "Doblo Cargo", "CX-3", "S-Type", "FX", "850", "Strada", "Uno", "Tribeca B9", "H1", "H2", "Kizashi", "i3", "H3", "GT", "Transit Tourneo", "i8", "GX", "620", "9-5 SportCombi", "200 - 300", "Spider", "Rio", "626", "Grandis", "CX-9", "Multipla", "Grand Modus", "307 CC", "Rad 6 Cabrio", "GTV", "Cooper S", "Besta", "997", "SLR", "Leon", "Plymouth", "IS", "RAV4", "Range Rover Sport", "Cabrio", "Solenza", "Accord Coupé", "Pajero Pinin Wagon", "Brera", "400", "A6 Allroad", "Swift", "Rad 3 Touring", "Escort", "Lanos", "Ibiza", "Z4 Roadster", "508 SW", "Leon ST", "F-Pace", "C5 Tourer", "Lupo", "Rad 1 Coupé", "Integra", "Patriot", "Tacuma", "Qashqai", "V40", "414", "416", "Optima", "Caddy", "Phaeton", "Cortina", "King Cab", "X-type Estate", "Scénic", "Boxster", "MiTo", "Sovereign", "Splash", "Veloster", "306", "Toledo", "309", "Compact Pulse", "Magentis", "Galaxy", "Maxima QX", "T5 Transporter Shuttle", "L300", "DS4", "Pajero Wagon", "DS3", "M3", "DS5", "Viper", "M5", "Wagon R+", "Voyager", "LX", "Leganza", "Jumper", "Escort Cabrio", "Panamera", "Doblo Cargo Combi", "4007", "4008", "Nemo", "S3/S3 Sportback", "Magnum", "Transit Valnik", "Barchetta", "Jumpy", "NP300 Pickup", "350 Z Roadster", "Samurai", "Mini One", "Discovery", "City", "V70", "Felicia Combi", "Stealth", "Primera Combi", "206", "Patrol GR", "Saxo", "A3 Limuzina", "Nubira kombi", "Trieda E", "Trieda G", "Trieda A", "Trieda B", "Carisma", "Omega", "Corsa", "Vectra", "Terrano", "Neon", "Pride", "Monte Carlo", "214", "218", "Cooper S Cabrio", "Epica", "Sorento", "Fabia Combi", "C30", "Tico", "Sephia", "Yaris", "Camry", "V90", "460", "Vectra Caravan", "Felicia", "Trieda M", "Meriva", "Verso", "Vanette Cargo", "GS 300", "Macan", "106", "Range Rover Evoque", "Mégane CC", "Cooper D", "109", "Trieda S", "C70 Cabrio", "Q5", "Rad 3 Cabrio", "Xedox 6", "Antara", "Challenger", "Elantra", "BRZ", "Celica", "S40", "Palio Weekend", "Vitara", "Rad 3 Coupé", "Matiz", "Giulietta", "Nexia", "Cherokee", "B-Fighter", "QX", "Thalia", "C70 Coupé", "Civic", "Mii", "Transit", "240", "Marea", "RC F", "911 Carrera", "Logan", "Campo", "Passat", "Soul", "Fortwo cabrio", "Fabia", "207 SW", "Caravelle", "Fusion", "25", "S7", "S8", "Coupé", "RX", "Kangoo", "S60", "Lacetti", "Punto Van", "SVX", "Kalos", "LHS", "RX-7", "RX-8", "Punto Cabriolet", "C4 Aircross", "Agila", "Rad 8 Coupé", "Corolla", "C70", "159 Sportwagon", "T4", "100 Avant", "Grande Punto", "Express", "CR-X", "Civic Type R", "CR-V", "Accord", "Transit Van", "S70", "Insignia kombi", "SX4", "146", "Freelander", "147", "Rad 2", "Rad 1", "Rad 3", "Spark", "Scudo Van", "Laguna Grandtour", "911 Carrera Cabrio", "Yeti", "S80", "RX 400h", "E Coupé", "Avensis Combi", "156", "F-Type", "159", "NV200", "SC 430", "X1/9", "S90", "Linea", "164", "Grand Vitara", "166", "Lancer Sportback", "C4 Cactus", "Arosa", "Focus kombi", "XC60", "G Coupé", "H1 Van", "Giulia", "Cascada", "X3", "75", "Impreza Wagon", "C-Zero", "308 SW", "XE", "XF", "XJ", "Jazz", "Pixo", "Shuma", "80", "PT Cruiser", "Sebring", "Cayenne", "Grand Voyager", "XV", "Captur", "Commander", "Eclipse", "Lancer", "Maxima", "Escort kombi", "Racer", "MPV", "Beetle", "Passat Alltrack", "Tiida", "Suburban", "Kangoo Express", "Rapid Spaceback", "MR2", "Compass", "XC70", "Colt", "H1 Bus", "Baleno kombi", "Roadster", "Freemont", "Legend", "Bora", "Galant", "Avenger", "Alhambra", "TT Roadster", "9000", "Renegade", "Clio", "Fortwo coupé", "Daimler", "HHR", "GT-R", "Carens", "SX4 Sedan", "Ducato Van", "Leaf", "310 Van", "Charger", "Range Rover", "Aygo", "X-Type", "C3 Picasso", "Hilux", "Wrangler", "XC90", "Dokker", "Trax", "C4 Grand Picasso", "Liana", "Cooper Cabrio", "210 Van", "C-Max", "Octavia", "200 D", "Ranger", "Auris", "XJ6", "XJ8", "Sportage", "Logan Van", "Discovery Sport", "Scudo", "Pacifica", "Forfour", "Crafter Kombi", "200 SX", "9-3", "9-5", "Carnival", "XJR", "Clio Grandtour", "Civic Coupé", "Avella", "Orion", "Lodgy", "FR-V", "XKR", "Cordoba Vario", "Kuga", "Cooper Clubman", "4-Runner", "i40 CW", "Talento", "Maverick", "Movano", "RX 450h", "Rio Combi", "Grand Cherokee", "Focus C-Max", "Roomster", "900 C Turbo", "Tribeca", "Twingo", "Hiace", "Crosswagon", "Astra cabrio", "XKR Convertible", "911 Turbo", "Baleno", "Mégane Combi", "Citigo", "Z3 Roadster", "Murano", "IS 250 C", "900", "Genesis", "GLA", "RAM"]
const brands = ["Volkswagen", "Seat", "Volvo", "Lexus", "Subaru", "Dodge", "Audi", "Chevrolet", "Citroën", "Alfa Romeo", "Chrysler", "Opel", "Honda", "Rover", "Škoda", "Infiniti", "Dacia", "Suzuki", "Porsche", "Hyundai", "Kia", "Renault", "Jeep", "Mazda", "Saab", "Mitsubishi", "Smart", "BMW", "Peugeot", "Land Rover", "MINI", "Toyota", "Fiat", "Jaguar", "Mercedes-Benz", "Ford", "Hummer", "Nissan", "Daewoo"]
const colors = ["Red", "Silver", "Metalic silver", "Metalic blue", "Blue", "Black"]
//If not used with Navigo, just leave out match
export async function start(pg) {
    choices()
    document.getElementById("input-column").onclick = (element) =>{
        choices()
    }

    document.getElementById("submit-btn").onclick = (element) =>{
        load(pg)

    }
}

async function load(pageNo){
    var column = document.getElementById("input-column").value
    var value = document.getElementById("input-value").value

    let url = SERVER_URL + "/filter?column=" + column + "&value=" + value + "&page=" + pageNo + "&size=20"
    try {
        cars = await fetch(url)
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
    window.router?.navigate(`/pagination${queryString}`, { callHandler: false, updateBrowserURL: true })
}



function choices(){
    var choices;
    const select = document.getElementById("input-value");
    var column = document.getElementById("input-column").value

    switch(column) {
        case "brand":
            choices = brands
            break;
        case "model":
            choices = models
            break;
        case "color":
            choices = colors
            break;
        default:
    }
    var i, L = select.options.length - 1;
    for(i = L; i >= 0; i--) {
        select.remove(i);
    }

    for (let i = 0; i < choices.length; i++) {
        var objOption = document.createElement('option');
        objOption.text = choices[i];
        objOption.value = choices[i];
        select.options.add(objOption);
    }



}

