
//////////////////////////////////////////////
// !!! JQuery and others "content script" Global objects is not accessible here
//////////////////////////////////////////////

if (/uptobox/i.test(window.location.hostname)) {
  uptobox();
}

if (/1fichier/i.test(window.location.hostname)) {
  unFichier();
}

if (/dl-protect1/i.test(window.location.hostname)) {
  dlProtect1();
}

if (/ed-protect/i.test(window.location.hostname)) {
  edProtect();
}

////////////////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == "liensTelechargementCom" )
    liensTelechargementCom();
});

////////////////////////////////////////////////////////////////////////////////

function uptobox () {
  // reload while captcha not ended
  let z = document.querySelector('.download-btn');
  if (z) {
    z.click();
    return;
  }
  // force https and launch download
  let b = document.querySelector('td>a.big-button-green-flat');
  if (b) {
    b.href = b.href.replace(/^http:/,"https:");
    b.click();
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

function dlProtect1 () {
  let a = document.querySelector("input[type=submit].continuer");
  if (a)
    a.click();
  let b = document.querySelector("div.lienet a");
  if (b)
    b.click();
}

function edProtect () {
  //  let a = document.querySelector('.g-recaptcha iframe');
  let a = document.querySelector('.g-recaptcha');
  let b = document.querySelector('[name="submit_captcha"]')
  if (!a && b)
    b.click();
}
