import{a as r}from"./chunk-5JDLMCPB.js";import"./chunk-GKXYOKXO.js";var a=`
progress.texscript-splash-progress-bar {
  width: 100%;
  height: 4px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  appearance: none;
  block-size: 4px;
  vertical-align: top;
}

/* Chrome, Safari, Edge */
progress.texscript-splash-progress-bar::-webkit-progress-bar {
  background-color: #252529;
}

/* Firefox */
progress.texscript-splash-progress-bar::-moz-progress-bar {
  background-color: #252529;
}

progress.texscript-splash-progress-bar::-webkit-progress-value {
  background-color: #2196F3;
}

progress.texscript-splash-progress-bar::-webkit-progress-value {
  transition: width 1s ease-in-out;
}
`;async function i(){let t=r(),e=document.createElement("style");e.innerHTML=a,document.head.appendChild(e);let s=document.createElement("progress");s.setAttribute("class","texscript-splash-progress-bar"),s.setAttribute("id","texscript-splash-progress"),s.setAttribute("value","0"),s.setAttribute("max","100"),t.appendChild(s),s.setAttribute("value","2");let o=await import("./splash.js");s.setAttribute("value","5"),await o.loadSplash()}export{i as load};
