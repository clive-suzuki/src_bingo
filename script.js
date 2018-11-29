let lmin = 1, lmax = 50;//最小値，最大値






let vol;
let bgm;
let center;
let dvol, dvolmax;
let lres;
let table;
let colors = ['c1','c2','c3','c4','c5'];
let ldsp, ldspid = 0;
let lprm = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,57,59,61,67,71,73,79,83,89,97];
let lprmnum = lprm.length
let ctrl, fg_ctrl;
let ldik;
let bomb;

function init(){
  bgm = document.getElementById("bgm");
  vol = document.getElementById("vol");
  dvolmax = 1.0;
  dvol = 1.0;
  vol.value=1.0;
  bgm.play();

  table = document.getElementById("table");
  lres = [];

  center = document.getElementById("center");
  ldsp = 0;
  setInterval(dspLoop,140);

  ctrl = document.getElementById("ctrl");
  ctrl.style.display = "none";
  fg_ctrl = false;

  bomb = document.getElementById("bomb");
}

function onVolBox(){
  dvolmax = vol.value;
}

function fadein(){
  if (dvol < 1.0){
    dvol = Math.ceil((dvol+0.1)*10)/10;
    bgm.volume = dvol * dvolmax;
    setTimeout(fadein,200);
  }
}

function fadeout(){
  var vl = bgm.volume;
  if (vl > 0.0){
    dvol = Math.ceil((dvol-0.1)*10)/10;
    bgm.volume = dvol * dvolmax;
    setTimeout(fadeout,200);
  }
}

function add(i){
  let len;
  let j,k;
  let jmax, kmax, jj;
  fadein();
  lres.push(i);
  len = table.rows.length;
  for(k=0; k<len; k++){
    table.deleteRow(k);
  }
  len = lres.length;
  jmax = (len-1) % 5 + 1;
  kmax = Math.floor((len-1)/5) + 1;
  for(k=0; k<kmax; k++){
    table.insertRow(-1);
    table.rows[k].insertCell(-1);
    table.rows[k].insertCell(-1);
    table.rows[k].insertCell(-1);
    table.rows[k].insertCell(-1);
    table.rows[k].insertCell(-1);
    jj = (k == kmax-1)? jmax: 5;
    for(j=0; j<jj; j++){
      table.rows[k].cells[j].innerHTML = getMark(lres[5*k+j], 'small');
    }
  }
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
    ldspid = setInterval(disp,150);
    setTimeout(bingo,Math.floor(3000+5000*Math.random()));
    fadeout();
  }
}
function disp(){
  center.innerHTML = getMark(ldsp, 'big');
}
function bingo(){
  clearInterval(ldspid);
  let ires, fg_ok;
  let fg_loop;
  let i, len;
  do{
    ires = Math.floor(Math.random()*(lmax+1-lmin)) + lmin;
    fg_loop = false
    len=lres.length;
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
    ldspid = 0;
  }
}

/*
exp-> futtobu
*/
function bingodike1(){
  bomb.style.visibility = 'visible';

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
