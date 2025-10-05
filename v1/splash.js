const a=`
.texscript-splash {
  font-family: monospace;
  position: fixed;
  background: #fff;
  color: #000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 8px;
}

.texscript-splash-status-error {
  color: #a00;
}
`,c=s=>`
<div class="texscript-splash">
  ${s}
  <br/><br/>
  <div>$&gt; texscript run</div>
  <br/>
  <div id="texscript-splash-status"></div>
</div>
`;async function d(s){try{const t=document.createElement("style");t.innerHTML=a,document.head.appendChild(t),document.body.innerHTML=c(s),r("Fetching Texscript Loader...");const e=await import("./lib/loader.js");r("Fetched Texscript Loader"),r("Loading Texscript modules..."),await e.load()}catch(t){r(t,"error"),console.log(t)}}function r(s,t){let e="";t==="error"?e=(i=>`<div class="texscript-splash-status-${i}">${s}</div>`)("error"):e=s;const o=document.getElementById("texscript-splash-status");(i=>{o.innerHTML+=i+"<br/>"})(e)}export{d as loadSplash,r as updateSplashStatus};
