if(typeof str === 'undefined') str=""

cnt=0
function scrollDown() {
  window.scrollBy(0, 1400)
  Array.from(document.querySelectorAll(".r-kzbkwu")).forEach(item => {
    strtoadd=item.querySelector('time').parentElement.href
    strtoadd=strtoadd.replace(/(.*status\/\d+)(.*)/i,"$1")
    if(strtoadd.includes("/status/") && !str.includes(strtoadd)) str=str+strtoadd+"\n"
    if(item.querySelector('button[data-testid="like"]')) item.querySelector('button[data-testid="like"]').click()
    if(item.querySelector('*[data-testid="removeBookmark"]')) item.querySelector('*[data-testid="removeBookmark"]').click()
  })
  cnt++
  if(cnt==20)
  {
      clearInterval(timout)
  }
  console.log(str)
}

timout=setInterval(scrollDown, 800)
