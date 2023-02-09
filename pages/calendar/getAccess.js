let clickedPics = []

export async function initAccess(){
    clickedPics = []
    document.getElementById("access-text").innerText = ""

    document.getElementById("submit-verification").onclick = () => {
        if(checkAccess() === true){
            router.navigate("calendar")
        }
        else{
            document.getElementById("access-text").innerText = "Adgang nægtet! Vælg kun de personer med Forsting i deres navn."
            console.log("Access not granted")
        }
    }


    document.getElementById("verification-pictures").onclick = (element) => {
        let id = element.target.id
        console.log(id + isNaN(id))
        if(!isNaN(id)){
            clicked(id)
        }
    }


    getPics()
}
function getPics(){
    const picLength = 6
    let pictures = getPicArray(picLength)
    pictures.sort(() => Math.random() - 0.5);


    const picsToShow = pictures.map(pic => `
        <div class="img-box">
            <img id="${pic}" src="${"media/access/" + pic + ".jpg"}" alt="" class="img-img" />
        </div>
    `).join("")
    document.getElementById("verification-pictures").innerHTML = picsToShow
}

function getPicArray(size){
    let arr = []
    arr.push(getRandomInt(16, 22))
    arr.push(getRandomInt(23, 30))
    while (arr.length <size){
        let number = getRandomInt(1, 10)
        if(!arr.includes(number)){
            arr.push(number)
        }
    }
    return arr
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function checkAccess(){
    let hasAccess = true
    if(clickedPics.length !== 4){
        return false
    }
    for (let i = 0; i < clickedPics.length; i++) {
        if(parseInt(clickedPics[i]) > 10){
            hasAccess = false
        }
    }
    console.log("has access is " + hasAccess)
    return hasAccess
}

function clicked(id){
    console.log("clickedpics before " + clickedPics)
    if(clickedPics.includes(id)){
        revertPicShade(id, 100)
        clickedPics = clickedPics.filter(element => element !== id);
    }
    else{
        clickedPics.push(id)
        revertPicShade(id, 30)
    }
    console.log("clickedpics after " + clickedPics)
}


function revertPicShade(id, brightness){
    document.getElementById(id).style.filter = "brightness("  + brightness + "%)";
}