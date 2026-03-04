
// simple slider
let imgs=["assets/hero1.jpg","assets/hero2.jpg","assets/hero3.jpg"];
let i=0;
setInterval(()=>{
let el=document.querySelector(".hero img");
i=(i+1)%imgs.length;
el.src=imgs[i];
},3000);
