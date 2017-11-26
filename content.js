
//////////////////////////////////////////////
// !!! JQuery and others "content script" Global objects is not accessible here
//////////////////////////////////////////////

if (/uptobox/i.test(window.location.hostname)) {
  uptobox();
}

if (/1fichier/i.test(window.location.hostname)) {
  unFichier();
}

////////////////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == "liensTelechargementCom" )
    liensTelechargementCom();
});

////////////////////////////////////////////////////////////////////////////////

function uptobox () {
  // activating download button and simulate click
  let a = document.getElementById('btn_download');
  if (a) {
    a.disabled = null;
    a.click();
  }

  // force https !!
  let o = document.querySelector(".col_name_green a");
  if (o)  {
    o.href = o.href.replace(/^http:/,"https:");
    o.click();
  }
}

function unFichier () {
  // simulate click on 1st download button
  let b = document.querySelector("input[type=submit]");
  if (b) {
    // do nothing if pending download ?
    let d = document.querySelector("form>div>div");
    if (d && /un seul fichier à la fois/i.test(d.innerText))
      return;
    // do nothing if waiting counter
    for (let c of document.querySelectorAll(".clock.flip-clock-wrapper>.flip.play")) {
      if (c.querySelector(".flip-clock-active .inn").innerText != "0")
      return;
    }
    b.click();
  }
  // simulate click on second download button
  let a = document.querySelector("a.ok.btn-general.btn-orange");
  if (a) {
    //if (a.innerText == "Cliquer ici pour télécharger le fichier")
      a.click();
  }
}

function liensTelechargementCom () {
  document.querySelector(".magic").style.display = "block";
  $(".trtbl").hide();
}
