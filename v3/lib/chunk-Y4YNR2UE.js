import{a}from"./chunk-J7FAPHSG.js";var c='Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>',d=`
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-splash">
    <div>${c}</div>
    <br/><hr/><br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`,l=`
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

.texscript-splash {
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
`;async function u(){try{p("8");let t=document.createElement("style");t.innerHTML=l,document.head.appendChild(t);let e=document.createElement("div");e.innerHTML=d,a().appendChild(e),o("Fetching Texscript Loader...");let r=await import("./loader-IND6JY6Q.js");p("10"),o("Fetched Texscript Loader"),o("Loading Texscript modules..."),await r.load()}catch(t){o(t,"error")}}function o(t,e){let s="";e==="error"?s=(n=>`<div class="texscript-splash-status-${n}">${t.toString().replaceAll(`
`,"<br/>")}</div>`)("error"):s=`<div>${t}</div>`;let r=document.getElementById("texscript-splash-status");if(r&&(n=>{r.innerHTML+=n})(s),e&&["error"].includes(e)){let i=document.getElementById("texscript-splash");i&&(i.style.display="flex")}e==="error"&&console.error(t)}function p(t){if(t){let e=document.getElementById("texscript-splash-progress");e&&e.setAttribute("value",t),parseInt(t)>99&&x()}}function x(){let t=document.getElementById("texscript-splash-progress");t&&(t.style.display="none")}export{u as a,o as b,p as c,x as d};
