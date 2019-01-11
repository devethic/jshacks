
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
  let a = document.querySelector('span.red>p');
  if (a && /sans attendre/.test(a.textContent)) {
    return;
  }
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

  // do nothing if pending download ?
  let d = document.querySelector("form>div.ct_warn");
  if (d && /Sans souscription/i.test(d.innerText)) {
    return;
  }

  // simulate click on 1st download button
  let b = document.querySelectorAll("input[type=submit]");
  if (b && b.length) {
    // ensure submit button is the last and is not a save button
    b = b[b.length-1];
    if (!/sauvegarder/i.test(b.value)) {
      // fill password if there
      let e = document.querySelector("input#pass.input-text.ui-corner-all[type=password]");
      if (e) {
        // check if the password has been rejected
        // stop if it's the case
        let f = document.querySelectorAll("div.ct_warn");
        if (f && f.length && f[f.length-1] == "L'accès à ce fichier est protégé par un mot de passe") {
          return;
        }
        // set password
        e.value = "annuaire-telechargement.com";
      }
      b.click();
    }
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
