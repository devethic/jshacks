
//////////////////////////////////////////////
// !!! JQuery and others Global objects is not accessible here
//////////////////////////////////////////////

if (/uptobox/i.test(window.location.hostname)) {
  // activating download button
  let a = document.getElementById('btn_download');
  if (a) a.disabled = null;
  // force https !!
  let o = document.querySelector(".col_name_green a");
  if (o)  o.href = o.href.replace(/^http:/,"https:")
}
