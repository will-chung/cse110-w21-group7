class IndexedDBWrapper{constructor(e,t){this._dbName=e,this._version=t}get dbName(){return this._dbName}set dbName(e){this._dbName=e}get version(){return this._version}set version(e){this._version=e}init(e,t){const r=e.target.result;if(r.objectStoreNames.contains("currentLogStore"))console.log("currentLogStore already created!");else{r.createObjectStore("currentLogStore",{autoIncrement:!0}).transaction.oncomplete=e=>{r.transaction(["currentLogStore"],"readwrite").objectStore("currentLogStore").transaction.oncomplete=e=>{};const o=new XMLHttpRequest;o.onreadystatechange=()=>{if(o.readyState===XMLHttpRequest.DONE&&200===o.status){const e=JSON.parse(o.responseText),t=r.transaction("currentLogStore","readwrite").objectStore("currentLogStore");e.current_log=String(Date.now()),t.put(e)}},o.open("GET",t),o.send()}}}addNewLog(e,t=!1){e.target.result}transaction(e=(e=>{}),t=this.init,r=!1){const o=window.indexedDB.open(this._dbName,this._version);o.onupgradeneeded=function(e){t(e,r?"./models/mock_data.json":"./models/schema_empty.json")},o.onsuccess=function(t){e(t)}}}export{IndexedDBWrapper};