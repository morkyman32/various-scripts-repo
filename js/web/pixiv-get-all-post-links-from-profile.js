if(typeof str === 'undefined') str=""
Array.from(document.querySelectorAll("a")).forEach(item => {
    strtoadd=item.href.replace(/(.*status\/\d+)(.*)/i,"$1")
    if(strtoadd.includes("/artworks/") && !str.includes(strtoadd))
        str=str+item.href+"\n"
})
console.log(str)
