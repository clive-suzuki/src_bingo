let lmin = 1, lmax = 50;//最小値，最大値
let ddikebomb = 0.5;//    土堤が飛ぶ割合
let lrow = 10;//           結果一行の数



let bgm;
let se_bomb, se_flash, se_drum, se_fall;
let center;
let dvol;
let dbombalpha;
let lres;
let table;
let colors = ['c1','c2','c3','c4','c5'];
let ldsp, ldspid = 0;
let lprm = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,57,59,61,67,71,73,79,83,89,97];
let lprmnum = lprm.length
let ctrl, fg_ctrl;
let ldik;
let bomb;
let maintbl;
let pdspid;
let pshfl, lshfl;
let stopbtn;

function init(){
  bgm = document.getElementById("bgm");
  dbombalpha = 0
  dvol = 10;
  bgm.play();
  se_bomb = document.getElementById("bomb");
  se_drum = document.getElementById("drum");
  se_flash = document.getElementById("flash");
  se_fall = document.getElementById("fall");

  table = document.getElementById("table");
  lres = [];

  center = document.getElementById("center");
  ldsp = 0;
  setInterval(dspLoop,140);

  ctrl = document.getElementById("ctrl");
  ctrl.style.display = "none";
  fg_ctrl = false;

  bomb = document.getElementById("bombimg");

  maintbl = document.getElementById("maintbl");

  stopbtn = document.getElementById("stop");

  document.getElementById("pdike").value = ddikebomb;
  document.getElementById("prow").value = lrow;
  pdspid = document.getElementById("pdspid");
  pdspid.value = 0;
  pshfl = document.getElementById("pshfl");
  lshfl = 0;
  pshfl.selectedIndex = lshfl;
}

function changepropaty(txt){
  if(txt == 'dike'){
    ddikebomb = document.getElementById("pdike").value;
  }else if(txt == 'row'){
    lrow = document.getElementById("prow").value;
  }else if(txt == 'dspid'){
    ldspid = pdspid.value;
  }else if(txt == 'shfl'){
    lshfl = pshfl.selectedIndex;
    if(lshfl == 0){
      stopbtn.style.visibility = 'hidden';
    }else if(lshfl == 1){
      stopbtn.style.visibility = 'visible';
    }
  }
}

function fadein(){
  if (dvol <= 9){
    dvol++;
    bgm.volume = dvol*0.1;
    setTimeout(fadein,50);
  }
}

function ready(){
  ldspid = 0;
  pdspid.value = ldspid;
  if(lres.length >= (lmax-lmin+1)){
    alert("試合終了！");
    ldspid = 1;
    pdspid.value = ldspid;
  }
}

function fadeout(){
  if (dvol >= 2){
    dvol--;
    bgm.volume = dvol*0.1;
    setTimeout(fadeout,50);
  }
}
function imgalpha(){
  bombimg.style.filter = "alpha(opacity:" + dbombalpha*10 + ")";
  bombimg.style.opacity = dbombalpha*0.1;
}
function imgfadeout(){
  if (dbombalpha >= 1){
    dbombalpha--;
    imgalpha();
    setTimeout(imgfadeout, 200);
  }
}

function add(i){
  let len;
  let j,k,l;
  let jmax, kmax, jj;
  if((i<lmin) || (i>lmax)){
    return;
  }
  lres.push(i);
  len = table.rows.length;
  for(k=0; k<len; k++){
    table.deleteRow(0);
  }
  len = lres.length;
  jmax = (len-1) % lrow + 1;
  kmax = Math.floor((len-1)/lrow) + 1;
  for(k=0; k<kmax; k++){
    table.insertRow(-1);
    for(l=0; l<lrow; l++){
      table.rows[k].insertCell(-1);
    }
    jj = (k == kmax-1)? jmax: lrow;
    for(j=0; j<jj; j++){
      table.rows[k].cells[j].innerHTML = getMark(lres[lrow*k+j], 'small');
    }
  }
  setTimeout(fadein, 2000);
  setTimeout(ready, 2600);
  se_flash.play();
}

function getMark(i,size){
  return (primeNumber(i)? '<div class="'+size+' '+colors[i%5]+' dike">' : '<div class="'+size+' '+colors[i%5]+' circle">') + '<div class="inner">' + ('00'+i).slice(-2) + '</div></div>';
}
function primeNumber(num){
  let i;
  for(i=0; i<lprmnum; i++){
    if(num == lprm[i]){
      return true;
    }
  }
  return false;
}

function onStartBtn(){
  if(ldspid == 0){
    ldspid = 1
    ldspid = setInterval(disp,150);
    pdspid.value = ldspid;
    if(lshfl == 0){
      setTimeout(bingo,Math.floor(3000+5000*Math.random()));
    }
    fadeout();
    se_drum.play();
  }
}

function onStopBtn(){
  bingo();
}

function disp(){
  center.innerHTML = getMark(ldsp, 'big');
}
function bingo(){
  let ires, fg_ok;
  let fg_loop;
  let i, len, ilen;
  clearInterval(ldspid);
  se_drum.pause();
  se_drum.currentTime = 0;
  len=lres.length;
  do{
    ires = Math.floor(Math.random()*(lmax+1-lmin)) + lmin;
    fg_loop = false
    if(len<2){
      if(primeNumber(ires)){
        fg_loop = true;
        continue;
      }
    }
    for(i=0; i<len; i++){
      if(lres[i] == ires){
        fg_loop = true;
      }
    }
  }while(fg_loop);
  center.innerHTML = getMark(ires, 'big');
  if(primeNumber(ires)){
    ldik = ires;
    setTimeout(bingodike1, 1000);
  }else{
    add(ires);
  }
}

/*
exp-> futtobu
*/
function bingodike1(){
  bomb.style.visibility = 'visible';
  se_bomb.play();
  setTimeout(bingodike2, 4000);
  dbombalpha = 10;
  imgalpha();
  imgfadeout();
}

function bingodike2(){
  if(Math.random() > ddikebomb){
    add(ldik);
    ldik = lmin-1;
  }else{
    ldik = lmin-1;
    maintbl.setAttribute("data-out", "out");
    se_fall.play();
    setTimeout(bingodike3, 2000);
  }
}

function bingodike3(){
  let ires;
  let fg_loop;
  let len;
  let i;
  do{
    ires = Math.floor(Math.random()*(lmax+1-lmin)) + lmin;
    fg_loop = false
    len=lres.length;
    if(!primeNumber(ires)){
      if(Math.random()<0.9){
        fg_loop = true;
        continue;
      }
    }
    for(i=0; i<len; i++){
      if(lres[i] == ires){
        fg_loop = true;
      }
    }
  }while(fg_loop);
  center.innerHTML = getMark(ires, 'big');
  maintbl.removeAttribute("data-out");
  add(ires);
}

function dspLoop(){
  ldsp = Math.floor(Math.random()*(lmax+1-lmin)) + lmin;
}

function onCtrl(){
  if(fg_ctrl){
    ctrl.style.display = "none";
    fg_ctrl = false;
  }else{
    ctrl.style.display = "block";
    fg_ctrl = true;
  }
}
