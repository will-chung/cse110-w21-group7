import{IndexedDBWrapper}from"../indexedDB/IndexedDBWrapper.js";import{DateConverter}from"../utils/DateConverter.js";class WeeklyViewItem extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._entry={name:""}}render(){this.shadowRoot.innerHTML='<style>\n                                    #single-weekday {\n                                      overflow-wrap:break-word;\n                                      padding: 5px;\n                                      display: flex;\n                                      flex-direction: column;\n                                      flex-wrap: wrap;\n                                      align-items:flex-start;\n\n                                    }\n                                    #single-weekday > p {\n                                      font-family: "Montserrat", sans-serif;\n                                      padding:10px;\n                                      font-size: 1vw;\n                                      margin:10px;\n                                      box-shadow: 5px 10px 5px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);\n                                    }\n                                    #single-weekday p:nth-child(odd) {\n                                      background: rgb(247,240,63);\nbackground: linear-gradient(335deg, rgba(247,240,63,1) 0%, rgba(254,255,156,1) 100%);\n                                      border-bottom-right-radius:10px;\n                                      border-bottom-left-radius:10px;\n                                    }\n                                    #single-weekday p:nth-child(even) {\n                                      background: rgb(247,240,63);\nbackground: linear-gradient(335deg, rgba(247,240,63,1) 0%, rgba(254,255,156,1) 100%);\n                                      border-bottom-right-radius:10px;\n                                      border-bottom-left-radius:10px;\n                                    }\n                                    #single-weekday p:hover {\n                                      background: white;\n                                    }\n                                    .weekday-entries {\n                                        // border-style: solid;\n                                        // border-left-style: none;\n                                        // border-right-style:none;\n                                        // border-width: 2px;\n                                        // border-radius: 5px;\n                                        margin:auto;\n                                        text-align:left;\n                                    }\n                                    a {\n                                        font-size: 40px;\n                                    }\n                                      </style>\n                                    <div id="single-weekday">\n                                        \n                                    </div>';const e=this.shadowRoot.getElementById("single-weekday"),t=this._entry.properties.tasks,n=this._entry.properties.notes,r=this._entry.properties.events,i=t=>{t.forEach(((t,n)=>{const r=this.getEntryToWeeklyView(t),i=this.makeRow(r);r.shadowRoot.querySelector("button").style.display="none",e.appendChild(i)}))};i(this._entry.properties.reflection),i(r),i(t),i(n)}makeRow(e){const t=document.createElement("p");return t.setAttribute("class","weekday-entries"),t.appendChild(e),t}getDate(){const e=this._entry.date.time;return new DateConverter(e).toLocaleDateString()}getEntryToWeeklyView(e){const t=document.createElement("log-item");return t.itemEntry=e,t.dataset.timestamp=this._entry.properties.date.time,t.itemEntry.editable=!1,t}set entry(e){this._entry=e,this.render()}get entry(){return this._entry}}customElements.define("weekly-view-item",WeeklyViewItem);export{WeeklyViewItem};