
// unified data layer
(async function(){
const URL="https://script.google.com/macros/s/AKfycbxkjToAu7jHkNabphwLT8B1PmjsBc8-cXohz8ZUUwim-11Xfg6n-d8KYbaZfN9tej0b/exec?action=master";
window.APP_DATA=null;
try{
 const r=await fetch(URL);
 window.APP_DATA=await r.json();
}catch(e){console.error("master load fail",e);}

// intercept fetch
const realFetch=window.fetch.bind(window);
window.fetch=function(u,o){
 if(typeof u==="string" && u.includes("/exec")){
   return Promise.resolve(new Response(JSON.stringify(window.APP_DATA),{headers:{'Content-Type':'application/json'}}));
 }
 return realFetch(u,o);
};

// intercept xhr
const open=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(method,url){
 this.__isExec=url&&url.includes("/exec");
 return open.apply(this,arguments);
};
const send=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send=function(){
 if(this.__isExec){
   this.readyState=4;this.status=200;
   this.responseText=JSON.stringify(window.APP_DATA);
   if(this.onload)this.onload();
   if(this.onreadystatechange)this.onreadystatechange();
   return;
 }
 return send.apply(this,arguments);
};
})();