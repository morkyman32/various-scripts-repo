tags=""
Array.from(document.querySelectorAll(".search-tag")).forEach(item=>{
    item.innerHTML=item.innerHTML.replaceAll(" ","_")
    tags+=item.innerHTML+" "
})
console.log(tags)
