if(typeof str === 'undefined') str=""

cnt=0
function scrollDown() {
  window.scrollBy(0, 1400)
  Array.from(document.querySelectorAll("a")).forEach(item => {
  strtoadd=item.href.replace(/(.*status\/\d+)(.*)/i,"$1")
  if(strtoadd.includes("/p/") && !str.includes(strtoadd))
        str=str+item.href+"\n"
  })
  cnt++
  if(cnt==20)
  {
      clearInterval(timout)
  }
  console.log(str)
}

timout=setInterval(scrollDown, 500)
