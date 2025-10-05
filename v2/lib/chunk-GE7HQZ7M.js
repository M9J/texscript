var p='Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>',c=`
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-banner">
    <div>${p}</div>
    <br/>
    <div>$&gt; texscript run</div>
    <br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`,d=`
.texscript-splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;  
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #252529;
  margin: 0;
  box-sizing: border-box;
  display: none;
}

.texscript-banner {
  font-family: monospace;
  background: #fff;
  color: #000;
  padding: 16px;
  box-shadow: -4px -8px 16px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.texscript-splash-status {
  overflow: auto;
}

.texscript-splash-status-error {
  color: #a00;
}
`;async function u(){try{o("8");let t=document.createElement("style");t.innerHTML=d,document.head.appendChild(t);let e=document.createElement("div");e.innerHTML=c,document.body.appendChild(e),r("Fetching Texscript Loader...");let s=await import("./loader-I5ZUI23B.js");o("10"),r("Fetched Texscript Loader"),r("Loading Texscript modules..."),await s.load()}catch(t){r(t,"error"),console.log(t)}}function r(t,e){let s="";e==="error"?s=(i=>`<div class="texscript-splash-status-${i}">${t}</div>`)("error"):s=t;let n=document.getElementById("texscript-splash-status");if(n&&(a=>{n.innerHTML+=a+"<br/>"})(s),e&&["error"].includes(e)){let i=document.getElementById("texscript-splash");i&&(i.style.display="flex")}}function g(){let t=document.getElementById("texscript-splash");t&&(t.style.display=t.style.display==="flex"?"none":"flex")}function o(t){if(t){let e=document.getElementById("texscript-splash-progress");e&&e.setAttribute("value",t),parseInt(t)>99&&l()}}function l(){let t=document.getElementById("texscript-splash-progress");t&&(t.style.display="none")}export{u as a,r as b,g as c,o as d,l as e};
