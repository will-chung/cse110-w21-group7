import{DateConverter}from"../utils/DateConverter.js";import{wrapper}from"./CollectionItem.js";import{ROUTES,Router}from"../utils/Router.js";const template=document.createElement("template");template.innerHTML='\n  <style>\n    @import \'./css/font/bootstrap-icons.css\';\n\n    :host {\n      display: inline-flex;\n      margin-left: 5px;\n      align-items: center;\n      background: #EE6C4D;\n      color: white;\n      padding: 5px 5px 5px 10px;\n      border-radius: 15px;\n      border: none;\n    }\n\n    :host(:hover) .bi-x {\n      visibility: visible;\n    }\n\n    .tag-name {\n      font-size: 16px;\n      font-weight: bold;\n      font-family: sans-serif;\n    }\n\n    .tag-name:hover {\n      cursor: pointer;\n    }\n\n    .bi-x {\n      visibility: hidden;\n      transition: transform 0.5s;\n    }\n\n    .bi-x:hover {\n      cursor: pointer;\n      color: red;\n      transform: scale(1.4);\n    }\n  </style>\n  <span class="tag-name">Test</span>\n  <i class="bi bi-x" style="font-size: 24px;"></i>\n';class Tag extends HTMLElement{constructor(e){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(template.content.cloneNode(!0)),this.name=e,this.shadowRoot.querySelector(".tag-name").addEventListener("click",(()=>{const e=new URL(ROUTES["collection-edit"],window.location.origin);e.searchParams.append("name",this.name),new Router(e).navigate()})),this.shadowRoot.querySelector(".bi-x").addEventListener("click",(()=>{const e=this.shadowRoot.querySelector(".tag-name").textContent;this.removeCollectionTag(e),this.remove()}))}get name(){return this.shadowRoot.querySelector(".tag-name").textContent}set name(e){this.shadowRoot.querySelector(".tag-name").textContent=e}removeCollectionTag(e){wrapper.transaction((t=>{t.target.result.transaction(["currentLogStore"],"readwrite").objectStore("currentLogStore").openCursor().onsuccess=function(t){const n=t.target.result;if(n){const t=n.value,o=t.properties.collections,r=(new Router).url.searchParams,s=new DateConverter(Number(r.get("timestamp"))),a=(s.timestamp,e=>e.findIndex((e=>s.equals(new DateConverter(e)))));o.forEach((t=>{if(t.name===e){const e=a(t.logs);void 0!==e&&t.logs.splice(e,1)}})),n.update(t)}}}));const t=document.querySelector(".tag-options"),n=document.createElement("a");n.setAttribute("href","#"),n.textContent=e,t.append(n)}}customElements.define("collection-tag",Tag);export{Tag};