import{a}from"./chunk-MANGVJK4.js";var d='Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>',l=`
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-banner">
    <div>${d}</div>
    <br/><hr/><br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`,x=`
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
`;async function u(){try{p("8");let t=document.createElement("style");t.innerHTML=x,document.head.appendChild(t);let e=document.createElement("div");e.innerHTML=l,a().appendChild(e),i("Fetching Texscript Loader...");let n=await import("./loader-UTRKE6NW.js");p("10"),i("Fetched Texscript Loader"),i("Loading Texscript modules..."),await n.load()}catch(t){i(t,"error")}}function i(t,e){let r="";e==="error"?r=(s=>`<div class="texscript-splash-status-${s}">${t}</div>`)("error"):r=`<div>${t}</div>`;let o=document.getElementById("texscript-splash-status");if(o&&(c=>{o.innerHTML+=c})(r),e&&["error"].includes(e)){let s=document.getElementById("texscript-splash");s&&(s.style.display="flex")}e==="error"&&console.error(t)}function g(){let t=document.getElementById("texscript-splash");t&&(t.style.display=t.style.display==="flex"?"none":"flex")}function p(t){if(t){let e=document.getElementById("texscript-splash-progress");e&&e.setAttribute("value",t),parseInt(t)>99&&h()}}function h(){let t=document.getElementById("texscript-splash-progress");t&&(t.style.display="none")}export{u as a,i as b,g as c,p as d,h as e};
