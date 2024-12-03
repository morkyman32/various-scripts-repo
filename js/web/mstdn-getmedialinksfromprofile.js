nstr=""
Array.from(document.querySelectorAll(".media-gallery__item-thumbnail")).forEach(item => {
    if(!nstr.includes(item.href)) { nstr=nstr+item.href+"\n" }
})
console.log(nstr)
