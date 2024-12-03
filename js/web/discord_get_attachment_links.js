liststr=""
Array.from(document.querySelectorAll("a")).forEach(item => {
    if(item.href.includes("attachments") && !liststr.includes(item.href)) liststr+=item.href+"\n"
})
console.log(liststr)
