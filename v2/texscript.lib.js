const t=`
progress.texscript-splash-progress-bar {
  width: 100%;
  height: 4px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  appearance: none;
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
`;async function o(){const r=document.createElement("style");r.innerHTML=t,document.head.appendChild(r);const s=document.createElement("progress");s.setAttribute("class","texscript-splash-progress-bar"),s.setAttribute("id","texscript-splash-progress"),s.setAttribute("value","0"),s.setAttribute("max","100"),document.body.appendChild(s),s.setAttribute("value","2");const e=await import("./lib/splash.js");s.setAttribute("value","5"),await e.loadSplash()}export{o as load};
