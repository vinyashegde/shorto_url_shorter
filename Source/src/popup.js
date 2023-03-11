let generateBtn = document.querySelector("#shortURL");
let generateSelTabBtn = document.querySelector("#shortSelTab");
let shortbut = document.querySelector("#shortbut");
let copyBtn = document.querySelector("#shortcopy");
let copy = document.querySelector("#copied");
let copiedQr = document.querySelector("#copiedQr");
let downloadedQr = document.querySelector("#downloadedQr");
let api = document.querySelector("#myurl")
let toastError = document.querySelector('.toast-error')
let toastSuccess = document.querySelector('.toast-success')
let loader = document.querySelector('.loading')
const url = new URL("https://t.ly/api/v1/link/shorten");
const codeDiv = document.getElementById("qrcode")
const copyQr = document.getElementById("copyQr")
const downloadQr = document.getElementById("downloadQr")
var qrcode = new QRCode(codeDiv);


const resultDiv = document.getElementById('result');
const historyBtn = document.getElementById('history-btn');
const storageKey = 'shortenedUrls';

// Retrieve the shortened URLs from local storage
let shortenedUrls = JSON.parse(localStorage.getItem(storageKey)) || [];

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

function urlValidate(url) {
    const regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return regex.test(url);
  }

  

generateBtn.addEventListener('click', () => {
    shortenUrl(api.value)
})
generateSelTabBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tab => {
        tab = tab[0];
        shortenUrl(tab.url)
    })
})

// Display the shortened URLs in the history table
      
shortenedUrls.slice(-3).reverse().forEach(urlPair => {
    const row = document.createElement('tr');
    row.innerHTML = `<td><a href="${urlPair[1]}" target="_blank">${urlPair[1]}</a></td><td><a href="${urlPair[0]}" target="_blank">${urlPair[0].substring(0,22) + String("...")}</a></td>`;
    historyBody.appendChild(row);
  });

function shortenUrl(longURL) {
    if (longURL && urlValidate(longURL)) {
        loader.classList.remove('d-hide')
        chrome.storage.local.get(['API'], function (result) {
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "long_url": longURL, 
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

                    const copyText=json.short_url;

                    var dummy = document.createElement("textarea");
                    document.body.appendChild(dummy);
                    dummy.value = copyText;
                    dummy.select();
                    document.execCommand("copy");
                    document.body.removeChild(dummy);

                    
                    // Add the shortened URL to the history list and local storage
                    const urlPair = [longURL, json.short_url];
                    shortenedUrls.push(urlPair);
                    shortenedUrls = shortenedUrls.slice(-3).reverse();
                    localStorage.setItem(storageKey, JSON.stringify(shortenedUrls));

                    
                    qrcode.makeCode(copyText);
                    codeDiv.classList.remove('d-hide')
                    downloadQr.classList.remove('d-hide')
                    copyQr.classList.remove('d-hide')
                    
                })
                .catch(err => { alert(err) })
        });
    } else {
        toastError.classList.remove('d-hide')
        
        setTimeout(() => {
            toastError.classList.add('d-hide')
        }, 1500)
    }
}

// Function to COPY QR to clipboard
copyQr.addEventListener('click',()=>{
    copyQrfunc();
})

async function copyQrfunc(){
    const imgQr= document.querySelector('div.qr img')
    const data=await fetch(imgQr.src);
    const blob = await data.blob();
    
    try{
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]:blob,
            })
        ])
        console.log('success');
        copiedQr.classList.remove('d-hide')
        setTimeout(() => {
            copiedQr.classList.add('d-hide')
        }, 2000)
    } catch(e){
        alert(e);
    }
}

// Function to download QR
downloadQr.addEventListener('click',()=>{
    const imgQr= document.querySelector('div.qr img')
    let imgPath=imgQr.getAttribute('src');
    console.log('1')
    try{
        const filename=imgPath.substring(imgPath.lastIndexOf('/')+1);
        saveAs(imgPath, filename);
        downloadedQr.classList.remove('d-hide')
        setTimeout(() => {
            downloadedQr.classList.add('d-hide')
        }, 2000)
    } catch(e){
        alert(e);
    }
})


backBtn.addEventListener('click', () => {
    
})

