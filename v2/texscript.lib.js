var le=Object.defineProperty;var I=t=>{throw TypeError(t)};var u=(t,e)=>()=>(t&&(e=t(t=0)),e);var f=(t,e)=>{for(var s in e)le(t,s,{get:e[s],enumerable:!0})};var K=(t,e,s)=>e.has(t)||I("Cannot "+s);var R=(t,e,s)=>(K(t,e,"read from private field"),s?s.call(t):e.get(t)),x=(t,e,s)=>e.has(t)?I("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),C=(t,e,s,o)=>(K(t,e,"write to private field"),o?o.call(t,s):e.set(t,s),s);var U={};f(U,{default:()=>a});var ce,a,w=u(()=>{"use strict";ce={ERR0001:"Unable to find the raw code to be compiled",ERR0002:"'rawCode' not provided",ERR0003:'Make sure the code is wrapped in &lt;script type="text/texscript">...&lt;/script&gt;',ERR0004:"'codeLOC' not provided",ERR0005:"'rule' not provided",ERR0006:"'matches' not provided",ERR0007:"'tokens' not provided",ERR0008:"token.type is null",ERR0009:"'ast' is not provided",ERR0010:"'node' is not provided",ERR0011:"'lang' is not provided",ERR0012:"Code generator for mentioned language is not provided",ERR0013:"'metricsName' not provided",ERR0014:"Unable to find any code written in Texscript",ERR0015:"Not able to find any Texscript code inside &lt;script&gt; element",ERR0016:"&lt;script&gt; element not found",ERR0017:"Compilation failed",ERR0018:"Dependency not found",ERR0019:"Unable to find any Texscript source URL inside &lt;script&gt; element",ERR0020:'Texscript code should be provided inside &lt;script type="text/texscript">...&lt;/script&gt; or as URL using &lt;script src="file.txs" type="text/texscript">&lt;/script&gt;'},a=ce});var j={};f(j,{findCodeFromDOM:()=>pe});async function pe(){try{let t=[],e=document.querySelectorAll('script[type="text/texscript"]');if(!e)throw new Error(a.ERR0003);if(e.length>1)for(let n of Array.from(e)){let r=await D(n);r&&t.push(r)}else{let n=e[0];if(n){let r=await D(n);r&&t.push(r)}}if(!(t.length>0))throw new Error(a.ERR0014);return t.join(`
`)}catch(t){l(t,"error"),console.log(t)}}async function D(t){var r;if(!t)throw new Error(a.ERR0016);let e=(r=t.innerText)!=null?r:null,s=t.getAttribute("src");if(!e&&!s)throw new Error(a.ERR0020);let o=null,n=null;if(e&&(o=e.trim(),!o))throw new Error(a.ERR0014);if(s&&(n=(await(await fetch(s)).text()).trim(),!n))throw new Error(a.ERR0014);if(o&&n)return`${o}
${n}`;if(o)return o;if(n)return n}var W=u(()=>{"use strict";w();A()});var Y={};f(Y,{loadTexscriptStyles:()=>de});async function de(){let t=document.querySelector('script[src$="texscript.js"]');if(t instanceof HTMLScriptElement&&t.src){let e=t.src.replace("texscript.js","texscript.css");await ue(e),await me()}}async function ue(t){try{let e=await fetch(t);if(e){let s=await e.text();if(s){let o=document.createElement("style");o.innerHTML=s,document.head.appendChild(o)}}}catch(e){l(e,"error"),console.log(e)}}async function me(){let t=document.createElement("meta");t.setAttribute("name","viewport"),t.setAttribute("content","initial-scale=1.0, maximum-scale=1.0, user-scalable=no"),document.head.appendChild(t)}var Q=u(()=>{"use strict";A()});var k,y,v,L,z=u(()=>{"use strict";w();L=class{constructor(e){x(this,k,null);x(this,y,null);x(this,v,null);if(!e)throw new Error(a.ERR0013);C(this,k,e)}start(){C(this,y,performance.now())}end(){C(this,v,performance.now());let e=this.getFormattedTime();console.log(`[Texscript: Metrics] > ${R(this,k)} finished in ${e}`)}getTotalTimeMilliseconds(){return R(this,v)&&R(this,y)?R(this,v)-R(this,y):0}getFormattedTime(){let e=this.getTotalTimeMilliseconds();return e<1e3?`${e.toFixed(3)}ms`:`${(e/1e3).toFixed(3)}s`}};k=new WeakMap,y=new WeakMap,v=new WeakMap});var O,b,H,M,F,P,V=u(()=>{"use strict";b=class{constructor(e){x(this,O,null);C(this,O,e)}getNodeType(){return R(this,O)}};O=new WeakMap;H=class extends b{constructor(){super("ROOT");this.value=null;this.meta={};this.body=[];this.dependencies={}}},M=class extends b{constructor(){super("TAG");this.value=null;this.htmlElement=null;this.customCSSClasses=[];this.parameters=null;this.children=[]}},F=class extends b{constructor(){super("LITERAL");this.value=null}},P=class extends b{constructor(){super("SPEC_TAG");this.htmlElement=null;this.value=null}}});function Te(t,e){let s=new Map;for(let o of t){let n=o.split("|").map(c=>{let i=e[c];if(!i)throw new Error(`Unknown token: ${c}`);return i.source}),r=new RegExp(n.join(""));s.set(o,r)}return s}var ge,Ee,he,Re,fe,Se,X,Z=u(()=>{"use strict";ge={KEYWORD:/(^[A-Z][a-z]*)/,STRING:/"(.*)"$|(\\\"(.*)\\\"$)/},Ee={CSS_CLASS:/\.([a-z]+[a-zA-Z]*)/,EXTERNAL_REFERENCE:/(@[A-Z][a-zA-Z]*:\s".*")/,PARAMETERS:/(\([\s*\w+:\s*\w+,*\s*]*\))/},he={BRACKET_SQUARE_CLOSE:/(\])/,BRACKET_SQUARE_OPEN:/(\[)/,COLON:/(:)/,SPACE:/(\s)/},Re={BR:/(::)/,HR:/(--)/},fe={...ge,...Ee,...he,...Re},Se=["BR","BRACKET_SQUARE_CLOSE","HR","KEYWORD|COLON|SPACE|STRING","KEYWORD|CSS_CLASS|COLON|SPACE|STRING","KEYWORD|CSS_CLASS|SPACE|BRACKET_SQUARE_OPEN","KEYWORD|CSS_CLASS|SPACE|PARAMETERS|COLON|SPACE|STRING","KEYWORD|CSS_CLASS|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN","KEYWORD|SPACE|BRACKET_SQUARE_OPEN","KEYWORD|SPACE|PARAMETERS|COLON|SPACE|STRING","KEYWORD|SPACE|PARAMETERS|SPACE|BRACKET_SQUARE_OPEN","STRING","EXTERNAL_REFERENCE"];X=Te(Se,fe)});var S,q=u(()=>{"use strict";S=class{constructor(){this.items=[]}push(e){this.items.push(e)}pop(){if(this.isEmpty())throw new Error("Stack underflow");return this.items.pop()}isEmpty(){return this.items.length===0}size(){return this.items.length}peek(){return this.isEmpty()?null:this.items[this.items.length-1]}}});var J={};f(J,{default:()=>$});var $,ee=u(()=>{"use strict";z();w();V();Z();q();$=class{constructor(){this.version="v0.2";this.repourl="https://github.com/M9J/texscript.git";this.metricsCompilation=new L("Compilation");this.metricsCodeGeneration=new L("Code Generation");this.rawCode=null;this.loc=null;this.tokens=null;this.ast=null;console.log(`[Texscript: Info] > Compiler ${this.version}`)}toString(){return{version:this.version,repoURL:this.repourl,lastCompilation:new Map([["loc",this.loc],["tokens",this.tokens],["ast",this.ast]])}}compile(e){this.rawCode=e,this.metricsCompilation.start(),this.loc=this.convertToLinesOfCode(),this.tokens=this.lexicalAnalysis(),this.ast=this.syntaxAnalysis(),this.metricsCompilation.end()}generateCodeFor(e){if(!e)throw new Error(a.ERR0011);this.metricsCodeGeneration.start();let s=null;if(e==="HTML")s=this.generateCodeForHTML();else throw new Error(a.ERR0012);return this.metricsCodeGeneration.end(),s}generateCodeForHTML(){if(!this.ast)throw new Error(a.ERR0009);let e="";for(let s of this.ast.body){let o=s.getNodeType();(o==="TAG"||o==="SPEC_TAG"||o==="LITERAL")&&(e+=this.generateHTMLForNode(s))}return e.trim()}generateHTMLForNode(e){if(!e)throw new Error(a.ERR0010);let s=e.getNodeType(),o=e.value,n=e.htmlElement,r=e.parameters,c=e.customCSSClasses,i=e.children||[],g="",E="";if(Array.isArray(c)&&c.length>0&&(g=` ${c.join(" ")}`),r)for(let d in r){let T=r[d];E+=` texscript-${o}-${d.toUpperCase()}-${T.toUpperCase()}`}return s==="TAG"?`<${n} class="texscript-${o}${g}${E}">
    ${i.filter(d=>{let T=d.getNodeType();return T==="TAG"||T==="SPEC_TAG"||T==="LITERAL"}).map(d=>this.generateHTMLForNode(d)).join("")}
  </${n}>`:s==="SPEC_TAG"?`<${n} class="texscript-${o}"/>`:s==="LITERAL"?`${o}`:""}syntaxAnalysis(){if(!this.tokens)throw new Error(a.ERR0007);let e=new H;e.value="Program",e.meta.languageName="Texscript",e.meta.languageCompilerVersion=this.version;let s=new S,o=new S,n=new S,r=null;for(let c of this.tokens)for(let i of c){if(!i.type)throw new Error(a.ERR0008);switch(i.type){case"BR":let g=new P;g.htmlElement="br",g.value="BR",r==null||r.children.push(g);break;case"BRACKET_SQUARE_CLOSE":{s.isEmpty()||s.pop(),s.isEmpty()||(r=s.isEmpty()?null:s.peek());break}case"BRACKET_SQUARE_OPEN":r&&s.push(r);break;case"COLON":o.push(i);break;case"CSS_CLASS":r==null||r.customCSSClasses.push(i.value);break;case"EXTERNAL_REFERENCE":if(i.value){let m=i.value.replace(/[\@\s\"]/g,""),[N,_]=m.split(":");N==="CustomCSSFilePath"&&(e.dependencies[N]=_)}break;case"HR":let E=new P;E.htmlElement="hr",E.value="HR",r==null||r.children.push(E);break;case"KEYWORD":let d=new M;if(d.value=i.value,d.htmlElement=i.value==="Section"?"section":i.value==="List"?"ul":"div",r=d,s.isEmpty())e.body.push(r);else{let m=s.isEmpty()?null:s.peek();m&&m.children.push(r)}break;case"PARAMETERS":let ae=i.value.replace(/[\(\)\s]/g,"").split(",");for(let m of ae){let[N,_]=m.split(":");N&&_&&(r!=null&&r.parameters||(r.parameters={}),r.parameters[N]=_)}break;case"SPACE":n.push(i);break;case"STRING":let B=new F;B.value=i.value;let h=new M;if(s.isEmpty())h.value="Line",h.htmlElement="div";else{let m=s.isEmpty()?null:s.peek();(m==null?void 0:m.value)==="List"?(h.value="ListItem",h.htmlElement="li"):(h.value="Line",h.htmlElement="div")}if(h.children.push(B),!r)throw new Error("'currentNode' doesn't exist");r.children.push(h),!o.isEmpty()&&!n.isEmpty()&&(r=s.isEmpty()?null:s.peek(),o.pop(),n.pop());break}}return e}lexicalAnalysis(){if(!this.loc)throw new Error(a.ERR0004);let e=[];for(let[s,o]of this.loc.entries()){let n=!1;for(let[r,c]of X){let i=o.match(c);if(i&&i.length>0){n=!0;let[g,...E]=i;if(g===o){let d=this.convertLineToTokens(r,E);e.push(d);break}}}if(!n){let r=s+1,c=`${a.ERR0017}, line: ${r}<br/>${o}`;throw new Error(c)}}return e}convertLineToTokens(e,s){if(!e)throw new Error(a.ERR0005);if(!s)throw new Error(a.ERR0006);let o=[],n=e.split("|");for(let[r,c]of n.entries()){let i=s[r];i!==void 0&&o.push({type:c,value:i})}return o}convertToLinesOfCode(){if(!this.rawCode)throw new Error(a.ERR0002);return this.rawCode.split(`
`).map(e=>e.trim()).filter(e=>e.length>0)}}});var te={};f(te,{process:()=>xe});async function xe(t,e){try{if(l("Compiling..."),t.compile(e),t.ast){let c=t.ast.dependencies;l("Loading dependencies..."),await Ce(c),p("80")}let s=t.generateCodeFor("HTML");l("Compilation done."),p("90");let o=document.querySelector(".texscript-banner-container");o instanceof HTMLElement&&(o.style.display="none");let n=document.createElement("div");n.className="texscript-pages",p("100"),n.innerHTML=s;let r=document.createElement("div");r.className="texscript-pages-container",r.appendChild(n),document.body.appendChild(r),window.TexscriptCompiler={...t.toString(),toggleSplashStatus:()=>G()}}catch(s){l(s,"error"),console.log(s)}}async function Ce(t){try{if(t!=null&&t.CustomCSSFilePath){let e=t.CustomCSSFilePath;await we(e)}}catch(e){l(e,"error"),console.log(e)}}async function we(t){let e=document.createElement("link");e.rel="stylesheet",e.href=t;try{document.head.appendChild(e),await new Promise((s,o)=>{e.onload=()=>s(),e.onerror=()=>{let n=a.ERR0018+"<br/>"+t;o(new Error(n))}})}catch(s){l(s,"error"),console.log(s)}}var se=u(()=>{"use strict";w();A()});var re={};f(re,{load:()=>Ae});async function Ae(){try{l("Getting handy tools..."),p("20");let t=await Promise.resolve().then(()=>(W(),j)),e=await Promise.resolve().then(()=>(Q(),Y));l("Opening curse words..."),p("30");let s=await Promise.resolve().then(()=>(w(),U));l("Applying beauty makeup..."),p("40"),await e.loadTexscriptStyles(),l("Loading brain power..."),p("50");let o=await Promise.resolve().then(()=>(ee(),J)),n=new o.default,r=await Promise.resolve().then(()=>(se(),te));p("60"),l("Finding your story...");let c=await t.findCodeFromDOM();if(!c)throw new Error(s.default.ERR0001);p("70"),r.process(n,c)}catch(t){l(t,"error"),console.log(t)}}var oe=u(()=>{"use strict";A()});var ie={};f(ie,{hideSplashProgress:()=>ne,loadSplash:()=>be,toggleSplashStatus:()=>G,updateSplashProgress:()=>p,updateSplashStatus:()=>l});async function be(){try{let t=document.createElement("style");t.innerHTML=Le,document.head.appendChild(t);let e=document.createElement("div");e.innerHTML=ve,document.body.appendChild(e),l("Fetching Texscript Loader...");let s=await Promise.resolve().then(()=>(oe(),re));p("10"),l("Fetched Texscript Loader"),l("Loading Texscript modules..."),await s.load()}catch(t){l(t,"error"),console.log(t)}}function l(t,e){let s="";e==="error"?s=(r=>`<div class="texscript-splash-status-${r}">${t}</div>`)("error"):s=t;let n=document.getElementById("texscript-splash-status");if(n&&(c=>{n.innerHTML+=c+"<br/>"})(s),e&&["error"].includes(e)){let r=document.getElementById("texscript-splash");r&&(r.style.display="flex")}}function G(){let t=document.getElementById("texscript-splash");t&&(t.style.display=t.style.display==="flex"?"none":"flex")}function p(t){if(t){let e=document.getElementById("texscript-splash-progress");e&&e.setAttribute("value",t),parseInt(t)>99&&ne()}}function ne(){let t=document.getElementById("texscript-splash-progress");t&&(t.style.display="none")}var ye,ve,Le,A=u(()=>{"use strict";ye='Texscript Markup Language [Version 0.2]<br/>Free and Open Source. Licensed under GPL-3.0.<br/>Hosted on GitHub: <a href="https://github.com/M9J/texscript.git">texscript.git</a>',ve=`
<div class="texscript-splash-container" id="texscript-splash">
  <div class="texscript-banner">
    <div>${ye}</div>
    <br/>
    <div>$&gt; texscript run</div>
    <br/>
    <div id="texscript-splash-status"></div>
  </div>
</div>
`,Le=`
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
`});var Ne=`
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
`;async function Ve(){let t=document.createElement("style");t.innerHTML=Ne,document.head.appendChild(t);let e=document.createElement("progress");e.setAttribute("class","texscript-splash-progress-bar"),e.setAttribute("id","texscript-splash-progress"),e.setAttribute("value","0"),e.setAttribute("max","100"),document.body.appendChild(e),await(await Promise.resolve().then(()=>(A(),ie))).loadSplash()}export{Ve as load};
