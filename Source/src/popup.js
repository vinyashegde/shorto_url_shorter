let generateBtn = document.querySelector("#shortURL");
let shortbut = document.querySelector("#shortbut");
let copyBtn = document.querySelector("#shortcopy");
let copy = document.querySelector("#copied");
let api = document.querySelector("#myurl")
let toastError = document.querySelector('.toast-error')
let toastSuccess = document.querySelector('.toast-success')
let loader = document.querySelector('.loading')
const url = new URL("https://t.ly/api/v1/link/shorten");
var qrcode = new QRCode(document.getElementById("qrcode"));

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}
generateBtn.addEventListener('click', () => {

    var copyText;

    
    if (api.value) {
        loader.classList.remove('d-hide')
        chrome.storage.local.get(['API'], function (result) {
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "long_url": api.value,
                    "domain": "https://t.ly/",
                    "api_token": result.API
                })
            }).then(response => response.json())
                .then(json => {
                    loader.classList.add('d-hide')
                    toastSuccess.classList.remove('d-hide');
                    toastSuccess.textContent = json.short_url;

                    copy.classList.remove('d-hide')
                    setTimeout(() => {
                        copy.classList.add('d-hide')
                    }, 2000)

                    copyText=json.short_url;

                    var dummy = document.createElement("textarea");
                    document.body.appendChild(dummy);
                    dummy.value = copyText;
                    dummy.select();
                    document.execCommand("copy");
                    document.body.removeChild(dummy);


                    qrcode.makeCode(copyText);
                    
                })
                .catch(err => { alert(err) })
        });
    } else {
        toastError.classList.remove('d-hide')
        
        setTimeout(() => {
            toastError.classList.add('d-hide')
        }, 1500)
    }
})

backBtn.addEventListener('click', () => {
    
})


