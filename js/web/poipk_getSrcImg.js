if(typeof str === 'undefined') str=""
Array.from(document.querySelectorAll("img.IllustItemThumbImg")).forEach(item=>{
    str=str+item.src.replace("_640.jpg","")+"\n"
})
console.log(str)
