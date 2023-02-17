
const password = "Forsting123"


export async function initAccess2(){

    document.getElementById("access-text").innerText = ""

    document.getElementById("submit-verification").onclick = () => {
        if(checkAccess() === true){
            router.navigate("calendar")
        }
        else{
            document.getElementById("access-text").innerText = "Adgang nægtet! Prøv igen!"
        }
    }

}

function checkAccess(){
    const passwordInput = document.getElementById("password").value

    if(passwordInput === password){
        return true
    }
    else {
        return false
    }

}