OPuname=document.querySelector("#pageDescription a.username").innerHTML;
document.querySelector(".redactor_MessageEditor").contentDocument.querySelector("body").innerHTML=`<p>ありがとうございます ${OPuname}さん!</p>`
document.querySelector(".quickReply .submitUnit .button.primary").click()

document.querySelector(".LikeLink.control.like").click()
