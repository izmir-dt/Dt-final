
// topbar professional behavior
document.addEventListener("DOMContentLoaded",()=>{
  const h=document.querySelector("header");
  if(!h) return;
  window.addEventListener("scroll",()=>{
    if(window.scrollY>40)h.classList.add("pro-shrink");
    else h.classList.remove("pro-shrink");
  });
  document.querySelectorAll("header a").forEach(a=>{
    a.addEventListener("click",()=>{
      document.querySelectorAll("header a").forEach(x=>x.classList.remove("active"));
      a.classList.add("active");
    });
  });
});
