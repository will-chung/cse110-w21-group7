import{CollectionItem,wrapper}from"./components/CollectionItem.js";const customAdd=document.getElementById("cb");function addCollection(e){let o;if(null===e)return;const t=new CollectionItem;t.entry={name:e},wrapper.transaction((t=>{t.target.result.transaction(["currentLogStore"],"readwrite").objectStore("currentLogStore").openCursor().onsuccess=function(t){const n=t.target.result;if(n){const t=n.value,c=t.properties.collections;if(o=c.find((o=>o.name===e)),void 0!==o)window.alert("Cannot create collections of the same name!");else{const o={type:"array",name:e,logs:[],tasks:[],images:[],videos:[]};c.push(o);const r=n.update(t);r.onerror=function(e){},r.onsuccess=function(o){console.log('successfully added "'+e+'"')}}}}})),void 0!==o&&document.querySelector(".collection-area").append(t)}function getLogInfoAsJSON(e){wrapper.transaction((o=>{o.target.result.transaction(["currentLogStore"],"readonly").objectStore("currentLogStore").openCursor().onsuccess=function(o){const t=o.target.result;t&&e(t.value)}}))}function populateCollections(e){const o=e.properties.collections,t=document.querySelector(".collection-area");o.forEach(((e,o)=>{const n=function(e){const o=new CollectionItem;return o.entry={name:e.name},o}(e);t.appendChild(n)}))}function populatePage(e){populateCollections(e)}customAdd.addEventListener("click",(()=>{addCollection(window.prompt("Please enter the name of your new collection:"))})),document.addEventListener("DOMContentLoaded",(e=>{getLogInfoAsJSON(populatePage)}));