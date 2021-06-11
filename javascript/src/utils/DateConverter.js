class DateConverter extends Date{constructor(e=Date.now()){super(e)}get timestamp(){return this.getTime()-60*this.getTimezoneOffset()*1e3}set timestamp(e){this.setTime(e)}getDaysFromTimeStamp(e=this.timestamp){return Math.floor(e/864e5)}timestampsInSameWeek(e){const t=this;let m,r;e>t.getTime()?(m=new DateConverter(e),r=new DateConverter(this.getBeginningOfWeek())):(m=t,r=new DateConverter(new DateConverter(e).getBeginningOfWeek()));const n=m.getDaysFromTimeStamp()-r.getDaysFromTimeStamp();return n>=0&&n<7}oldTimestampInSameWeek(e){const t=new DateConverter(e),m=this.getDaysFromTimeStamp()-(this.getDay()+6)%7,r=m+6;return m<=t.getDaysFromTimeStamp()&&t.getDaysFromTimeStamp()<=r}getBeginningOfWeek(){const e=24*((this.getDay()+6)%7)*60*60*1e3;return this.getTime()-e}equals(e){const t=new DateConverter(e);return this.getDaysFromTimeStamp()===t.getDaysFromTimeStamp()}}export{DateConverter};