
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

if (/extreme-protect/i.test(window.location.hostname)) {
  extremeProtect();
}

if (/zt-protect/i.test(window.location.hostname)) {
  ztProtect();
}

if (/linkcaptcha/i.test(window.location.hostname)) {
  linkcaptcha();
}

////////////////////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == "liensTelechargementCom" ) {
    liensTelechargementCom();
  }
  else if (msg == "edProtectFuckCaptcha") {
    edProtectFuckCaptcha();
  }
  else if (msg == "adblocker") {
    // // TODO:
    // if (document.querySelectorAll("script")) {
    //   console.log("scripts!!!");
    //   let scripts = document.querySelectorAll("script");
    //   for(var i = 0; i < scripts.length; i++)
    //   if (/ad blocker/.test(scripts[i].innerText)) {
    //     console.log(window.onload);
    //     scripts[i].remove();
    //     window.onload = null;
    //   }
    //
    // }
  }
});

////////////////////////////////////////////////////////////////////////////////

function uptobox () {
  let a = document.querySelector('span.red p');
  if (a && (/sans attendre/.test(a.textContent) || /premium/.test(a.textContent))) {
    return;
  }
  // reload while captcha not ended
  let z = document.querySelector('.download-btn');
  if (z) {
    z.click();
    return;
  }
  // force https and launch download
  let b = document.querySelectorAll('td>a.big-button-green-flat');
  if (b) {
    b.forEach(e => {
      if (/téléchargement\n/i.test(e.innerHTML)) {
        e.href = e.href.replace(/^http:/,"https:");
        e.click();
      }
    })
  }
}

function unFichier () {

  // do nothing if pending download ?
  let d = document.querySelector("form div.ct_warn");
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

function edProtectFuckCaptcha () {
  console.log("call edProtectFuckCaptcha");
  // click on button "afficher les liens"
  let c = document.querySelector('#captcha_form>#submit_button[value="Afficher les liens"');
  if (c){
    c.click();
  }
}

function edProtect () {
  // // useless ?
  // //  let a = document.querySelector('.g-recaptcha iframe');
  // let a = document.querySelector('.g-recaptcha');
  // let b = document.querySelector('[name="submit_captcha"]')
  // if (!a && b){
  //   console.log("b.click()");
  //   b.click();
  //   return;
  // }

  // click on the first link
  let d = document.querySelector("table.affichier_lien span.lien>a");
  if (d && d.href)
    d.click();
}

function extremeProtect () {
  let a = document.querySelector(".captcha>#Protect");
  if (a) {
    a.click();
    return;
  }
  a = document.querySelector('td>a[href*="uptobox"]');
  if (a) {
    a.click();
  }
}

function ztProtect() {
  let a = document.querySelector('form center>button[type="submit"]');
  if (a) {
      a.click();
      return;
  }
  let b = document.querySelector('div[role="alert"]>a');
  if (b) {
    b.click();
  }
}

function linkcaptcha() {
  // // marche pas, il faut rechercher la position de l'élt. cliquable dans le canvas
  // let a = document.querySelector('div#captcha>canvas');
  // if (a) {
  //     a.click();
  //     return;
  // }
  // a = document.querySelector('span.hidden-links a');
  // if (a) {
  //   a.target="";
  //   a.click();
  //   return;
  // }
  // // free.fr : marche pas...
  // a = document.querySelector('input[type="submit"].form-button');
  // if (a) {
  //   a.click();
  // }
}
