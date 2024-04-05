import API_KEY from "./API_KEY.js"
let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=`
let latitude,longitude
const ipAddressLabel= document.querySelector('.ip_address')
const locationLabel= document.querySelector('.location')
const timezoneLabel= document.querySelector('.timezone')
const ispLabel= document.querySelector('.isp')
var map = L.map('map').setView([51.505, -0.09], 19).fitWorld();
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const ipInput = document.getElementById('ip__input')
const form = document.getElementById('form')
const error = document.querySelector('.error')

ipInput.addEventListener('input',function(e){
    ipFormat(e.target.value)
})
form.addEventListener('submit',async function(e){
    e.preventDefault()
    let parts=[]
    let flag = false
    parts = ipInput.value.split('.');
    if(ipInput.value == ''){
        error.innerHTML=`Please enter correct IP address`
        return
    }
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length < 4) {
            flag=false
        }
        else{
            flag=true
        }
    }
    if(flag){
        error.innerHTML=`Please enter correct IP address`
    }
    else{
        error.innerHTML=''
        const data =await fetchIP(ipInput.value)
        drawMap(data)
        
    }

})


window.addEventListener('load',async function(){
    const data =await fetchIP(geoplugin_request())
    drawMap(data)
})
function drawMap(data){
    ipAddressLabel.innerHTML=data.ip
    ipAddressLabel.classList.add('textAnimation')
    timezoneLabel.classList.add('textAnimation')
    ispLabel.classList.add('textAnimation')
    locationLabel.classList.add('textAnimation')
    timezoneLabel.innerHTML=data.time_zone.name
    ispLabel.innerHTML=data.isp
    locationLabel.innerHTML=`${data.city}, ${data.country_name}`
    console.log(data.ip)
    map.setView([data.latitude, data.longitude], 19)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: false,
    }).addTo(map)
   
    map.setView([data.latitude, data.longitude],18)
    L.marker([data.latitude,  data.longitude]).addTo(map);
    setTimeout(()=>{
        ipAddressLabel.classList.remove('textAnimation')
        timezoneLabel.classList.remove('textAnimation')
        ispLabel.classList.remove('textAnimation')
        locationLabel.classList.remove('textAnimation')
    },1000)
}

async function fetchIP(ipaddress){
    try{
        const res = await fetch(`${url}${ipaddress}`)
        const data =await res.json()
        if(res.status>400){
            throw error()
        }
       return data
    }
    catch(err){
        error.innerHTML=`Please enter correct IP address`
    }
}
function ipFormat(val){
    val = val.replace(/[^0-9.]{0,3}/g, "");
    let dotCount = (ipInput.value.match(/\./g) || []).length;
    
    if (dotCount > 3 || val.includes('..')) {
     
        ipInput.value = ipInput.value.substring(0, ipInput.value.lastIndexOf('.'));
        return
    }
    let parts=[]
    parts = val.split('.');
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length > 3) {
            parts[i] = parts[i].substring(0, 3);

            return
        }
    }
    ipInput.value = parts.join('.');
}