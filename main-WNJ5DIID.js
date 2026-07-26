import{a as Cc,b as Mc,c as vc,d as Pc,e as Lc,f as Dc,g as Pr,h as yc,i as Ic,j as wc,k as Uc,l as Vc,m as Bc,n as Fc,o as kc,p as Gc,q as Hc,r as Yc,s as Kc,t as zc,u as hi,v as H,w as jc,x as Wc,y as qc,z as Xc}from"./chunk-7DCXHTOW.js";import{a as fc,b as Ec}from"./chunk-QNFORZPU.js";import{a as Sc,b as hc,c as Ac,d as gc,e as vr,f as Rc,g as Oc,h as Si,i as xc}from"./chunk-7X3T5YQC.js";import{c as bc,d as Nc}from"./chunk-VFD4ASY2.js";import{a as Tc}from"./chunk-MH4SROBL.js";import{a as Tn,c as Cr,g as pc,h as kt,i as Mr}from"./chunk-IZQBMMB2.js";import{a as ic,d as sc,e as ac,f as Or,g as xr,i as br,j as Nr,k as En,m as cc,n as lc,o as dc,p as _c,q as uc,r as mc}from"./chunk-5JG66B6G.js";import{$ as Ze,$a as P,$b as za,A as Ea,Aa as mr,Ab as Se,B as Be,Ba as La,Bb as Ne,Bc as Ti,C as yt,Cb as pi,Cc as rc,D as te,Da as de,Db as fi,Dc as oc,E as Ta,Ea as b,Ec as ft,Fa as N,G as Sa,Gc as ue,Ha as pr,Hb as Ua,I as ie,Ia as fr,J as U,Ja as ne,Ka as p,Kb as Va,L as d,La as E,M as ha,Ma as G,Mb as Ba,Mc as Ft,N as Fe,Na as Je,Nb as Fa,Nc as Ce,O as ke,Oa as et,P as ut,Pa as tt,Q as dr,Qb as ka,R as _n,Ra as mn,Rb as Ga,S as se,Sa as It,T as K,Ta as X,Tb as Ha,Ub as Ya,V as Aa,Va as w,Vb as Vt,W as ae,Wa as Ge,Wb as Ar,X as ga,Xa as z,Ya as wt,Yb as Ka,Za as nt,Zb as gr,_a as v,_b as Rr,a as Dt,aa as Ra,ab as Da,ac as ja,b as ln,ba as _r,bb as Er,bc as Wa,c as k,ca as Oa,cb as pn,cc as qa,da as ur,db as rt,dc as _e,e as ma,ea as q,eb as Ut,fa as xa,fb as B,fc as Ei,g as ui,gb as Tr,gc as Xa,hb as L,hc as $a,ib as ot,j as Ee,ja as un,jb as Sr,k as pa,ka as A,kc as Qa,l as sr,la as ba,lb as be,ma as Na,mc as Za,na as ce,nb as ya,o as Qe,oa as Ca,p as W,pa as Ma,pc as Ja,qc as ec,ra as va,rc as tc,s as ar,sb as Ia,t as dn,tb as He,tc as Bt,u as mi,ua as V,uc as nc,v as cr,va as le,vc as pt,w as fa,wa as Te,wb as fn,xb as hr,y as lr,yb as mt,za as Pa,zb as wa}from"./chunk-MNFIV4FL.js";import{a as xe,b as Pt,d as u,e as Lt,f as Wm,g as _i,h as qm}from"./chunk-PCOOZPAX.js";var Ye,vi=u(()=>{"use strict";Ye="1.9.1"});function df(e){let n=new Set([e]),t=new Set,r=e.match(Ll);if(!r)return()=>!1;let o={major:+r[1],minor:+r[2],patch:+r[3],prerelease:r[4]};if(o.prerelease!=null)return function(c){return c===e};function i(a){return t.add(a),!1}function s(a){return n.add(a),!0}return function(c){if(n.has(c))return!0;if(t.has(c))return!1;let l=c.match(Ll);if(!l)return i(c);let _={major:+l[1],minor:+l[2],patch:+l[3],prerelease:l[4]};return _.prerelease!=null||o.major!==_.major?i(c):o.major===0?o.minor===_.minor&&o.patch<=_.patch?s(c):i(c):o.minor<=_.minor?s(c):i(c)}}var Ll,Dl,yl=u(()=>{"use strict";vi();Ll=/^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;Dl=df(Ye)});function Me(e,n,t,r=!1){var o;let i=gn[An]=(o=gn[An])!==null&&o!==void 0?o:{version:Ye};if(!r&&i[e]){let s=new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e}`);return t.error(s.stack||s.message),!1}if(i.version!==Ye){let s=new Error(`@opentelemetry/api: Registration of version v${i.version} for ${e} does not match previously registered API v${Ye}`);return t.error(s.stack||s.message),!1}return i[e]=n,t.debug(`@opentelemetry/api: Registered a global for ${e} v${Ye}.`),!0}function oe(e){var n,t;let r=(n=gn[An])===null||n===void 0?void 0:n.version;if(!(!r||!Dl(r)))return(t=gn[An])===null||t===void 0?void 0:t[e]}function ve(e,n){n.debug(`@opentelemetry/api: Unregistering a global for ${e} v${Ye}.`);let t=gn[An];t&&delete t[e]}var _f,An,gn,Et=u(()=>{"use strict";vi();yl();_f=Ye.split(".")[0],An=Symbol.for(`opentelemetry.js.api.${_f}`),gn=typeof globalThis=="object"?globalThis:typeof self=="object"?self:typeof window=="object"?window:typeof global=="object"?global:{}});function Rn(e,n,t){let r=oe("diag");if(r)return r[e](n,...t)}var Ir,Il=u(()=>{"use strict";Et();Ir=class{constructor(n){this._namespace=n.namespace||"DiagComponentLogger"}debug(...n){return Rn("debug",this._namespace,n)}error(...n){return Rn("error",this._namespace,n)}info(...n){return Rn("info",this._namespace,n)}warn(...n){return Rn("warn",this._namespace,n)}verbose(...n){return Rn("verbose",this._namespace,n)}}});var y,wr=u(()=>{"use strict";y=(function(e){return e[e.NONE=0]="NONE",e[e.ERROR=30]="ERROR",e[e.WARN=50]="WARN",e[e.INFO=60]="INFO",e[e.DEBUG=70]="DEBUG",e[e.VERBOSE=80]="VERBOSE",e[e.ALL=9999]="ALL",e})(y||{})});function wl(e,n){e<y.NONE?e=y.NONE:e>y.ALL&&(e=y.ALL),n=n||{};function t(r,o){let i=n[r];return typeof i=="function"&&e>=o?i.bind(n):function(){}}return{error:t("error",y.ERROR),warn:t("warn",y.WARN),info:t("info",y.INFO),debug:t("debug",y.DEBUG),verbose:t("verbose",y.VERBOSE)}}var Ul=u(()=>{"use strict";wr()});var uf,$,Tt=u(()=>{"use strict";Il();Ul();wr();Et();uf="diag",$=class e{static instance(){return this._instance||(this._instance=new e),this._instance}constructor(){function n(o){return function(...i){let s=oe("diag");if(s)return s[o](...i)}}let t=this,r=(o,i={logLevel:y.INFO})=>{var s,a,c;if(o===t){let f=new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");return t.error((s=f.stack)!==null&&s!==void 0?s:f.message),!1}typeof i=="number"&&(i={logLevel:i});let l=oe("diag"),_=wl((a=i.logLevel)!==null&&a!==void 0?a:y.INFO,o);if(l&&!i.suppressOverrideMessage){let f=(c=new Error().stack)!==null&&c!==void 0?c:"<failed to generate stacktrace>";l.warn(`Current logger will be overwritten from ${f}`),_.warn(`Current logger will overwrite one already registered from ${f}`)}return Me("diag",_,t,!0)};t.setLogger=r,t.disable=()=>{ve(uf,t)},t.createComponentLogger=o=>new Ir(o),t.verbose=n("verbose"),t.debug=n("debug"),t.info=n("info"),t.warn=n("warn"),t.error=n("error")}}});var Ur,Vl=u(()=>{"use strict";Ur=class e{constructor(n){this._entries=n?new Map(n):new Map}getEntry(n){let t=this._entries.get(n);if(t)return Object.assign({},t)}getAllEntries(){return Array.from(this._entries.entries())}setEntry(n,t){let r=new e(this._entries);return r._entries.set(n,t),r}removeEntry(n){let t=new e(this._entries);return t._entries.delete(n),t}removeEntries(...n){let t=new e(this._entries);for(let r of n)t._entries.delete(r);return t}clear(){return new e}}});var Bl,Fl=u(()=>{"use strict";Bl=Symbol("BaggageEntryMetadata")});function kl(e={}){return new Ur(new Map(Object.entries(e)))}function On(e){return typeof e!="string"&&(mf.error(`Cannot create baggage metadata from unknown type: ${typeof e}`),e=""),{__TYPE__:Bl,toString(){return e}}}var mf,Pi=u(()=>{"use strict";Tt();Vl();Fl();mf=$.instance()});function Ae(e){return Symbol.for(e)}var Li,Ke,xn=u(()=>{"use strict";Li=class e{constructor(n){let t=this;t._currentContext=n?new Map(n):new Map,t.getValue=r=>t._currentContext.get(r),t.setValue=(r,o)=>{let i=new e(t._currentContext);return i._currentContext.set(r,o),i},t.deleteValue=r=>{let o=new e(t._currentContext);return o._currentContext.delete(r),o}}},Ke=new Li});function Nn(){return ki}var Di,Gt,yi,Ii,wi,Ui,bn,Vi,Bi,Fi,ki,pf,ff,Ef,Tf,Sf,hf,Af,Gi=u(()=>{"use strict";Di=class{constructor(){}createGauge(n,t){return ff}createHistogram(n,t){return Ef}createCounter(n,t){return pf}createUpDownCounter(n,t){return Tf}createObservableGauge(n,t){return hf}createObservableCounter(n,t){return Sf}createObservableUpDownCounter(n,t){return Af}addBatchObservableCallback(n,t){}removeBatchObservableCallback(n){}},Gt=class{},yi=class extends Gt{add(n,t){}},Ii=class extends Gt{add(n,t){}},wi=class extends Gt{record(n,t){}},Ui=class extends Gt{record(n,t){}},bn=class{addCallback(n){}removeCallback(n){}},Vi=class extends bn{},Bi=class extends bn{},Fi=class extends bn{},ki=new Di,pf=new yi,ff=new wi,Ef=new Ui,Tf=new Ii,Sf=new Vi,hf=new Bi,Af=new Fi});var Gl,Hl,Yl=u(()=>{"use strict";Gl={get(e,n){if(e!=null)return e[n]},keys(e){return e==null?[]:Object.keys(e)}},Hl={set(e,n,t){e!=null&&(e[n]=t)}}});var Vr,Kl=u(()=>{"use strict";xn();Vr=class{active(){return Ke}with(n,t,r,...o){return t.call(r,...o)}bind(n,t){return t}enable(){return this}disable(){return this}}});var Hi,gf,Pe,Cn=u(()=>{"use strict";Kl();Et();Tt();Hi="context",gf=new Vr,Pe=class e{constructor(){}static getInstance(){return this._instance||(this._instance=new e),this._instance}setGlobalContextManager(n){return Me(Hi,n,$.instance())}active(){return this._getContextManager().active()}with(n,t,r,...o){return this._getContextManager().with(n,t,r,...o)}bind(n,t){return this._getContextManager().bind(n,t)}_getContextManager(){return oe(Hi)||gf}disable(){this._getContextManager().disable(),ve(Hi,$.instance())}}});var Q,Yi=u(()=>{"use strict";Q=(function(e){return e[e.NONE=0]="NONE",e[e.SAMPLED=1]="SAMPLED",e})(Q||{})});var Br,Fr,Mn,kr=u(()=>{"use strict";Yi();Br="0000000000000000",Fr="00000000000000000000000000000000",Mn={traceId:Fr,spanId:Br,traceFlags:Q.NONE}});var Le,Gr=u(()=>{"use strict";kr();Le=class{constructor(n=Mn){this._spanContext=n}spanContext(){return this._spanContext}setAttribute(n,t){return this}setAttributes(n){return this}addEvent(n,t){return this}addLink(n){return this}addLinks(n){return this}setStatus(n){return this}updateName(n){return this}end(n){}isRecording(){return!1}recordException(n,t){}}});function Hr(e){return e.getValue(Ki)||void 0}function zl(){return Hr(Pe.getInstance().active())}function vn(e,n){return e.setValue(Ki,n)}function jl(e){return e.deleteValue(Ki)}function Wl(e,n){return vn(e,new Le(n))}function Yr(e){var n;return(n=Hr(e))===null||n===void 0?void 0:n.spanContext()}var Ki,zi=u(()=>{"use strict";xn();Gr();Cn();Ki=Ae("OpenTelemetry Context Key SPAN")});function ql(e,n){if(typeof e!="string"||e.length!==n)return!1;let t=0;for(let r=0;r<e.length;r+=4)t+=(Kr[e.charCodeAt(r)]|0)+(Kr[e.charCodeAt(r+1)]|0)+(Kr[e.charCodeAt(r+2)]|0)+(Kr[e.charCodeAt(r+3)]|0);return t===n}function zr(e){return ql(e,32)&&e!==Fr}function Xl(e){return ql(e,16)&&e!==Br}function ge(e){return zr(e.traceId)&&Xl(e.spanId)}function $l(e){return new Le(e)}var Kr,jr=u(()=>{"use strict";kr();Gr();Kr=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1])});function Rf(e){return e!==null&&typeof e=="object"&&"spanId"in e&&typeof e.spanId=="string"&&"traceId"in e&&typeof e.traceId=="string"&&"traceFlags"in e&&typeof e.traceFlags=="number"}var ji,Ht,Wi=u(()=>{"use strict";Cn();zi();Gr();jr();ji=Pe.getInstance(),Ht=class{startSpan(n,t,r=ji.active()){if(!!t?.root)return new Le;let i=r&&Yr(r);return Rf(i)&&ge(i)?new Le(i):new Le}startActiveSpan(n,t,r,o){let i,s,a;if(arguments.length<2)return;arguments.length===2?a=t:arguments.length===3?(i=t,a=r):(i=t,s=r,a=o);let c=s??ji.active(),l=this.startSpan(n,i,c),_=vn(c,l);return ji.with(_,a,void 0,l)}}});var Of,Wr,Ql=u(()=>{"use strict";Wi();Of=new Ht,Wr=class{constructor(n,t,r,o){this._provider=n,this.name=t,this.version=r,this.options=o}startSpan(n,t,r){return this._getTracer().startSpan(n,t,r)}startActiveSpan(n,t,r,o){let i=this._getTracer();return Reflect.apply(i.startActiveSpan,i,arguments)}_getTracer(){if(this._delegate)return this._delegate;let n=this._provider.getDelegateTracer(this.name,this.version,this.options);return n?(this._delegate=n,this._delegate):Of}}});var qr,Zl=u(()=>{"use strict";Wi();qr=class{getTracer(n,t,r){return new Ht}}});var xf,Pn,Jl=u(()=>{"use strict";Ql();Zl();xf=new qr,Pn=class{getTracer(n,t,r){var o;return(o=this.getDelegateTracer(n,t,r))!==null&&o!==void 0?o:new Wr(this,n,t,r)}getDelegate(){var n;return(n=this._delegate)!==null&&n!==void 0?n:xf}setDelegate(n){this._delegate=n}getDelegateTracer(n,t,r){var o;return(o=this._delegate)===null||o===void 0?void 0:o.getTracer(n,t,r)}}});var Ln,ed=u(()=>{"use strict";Ln=(function(e){return e[e.NOT_RECORD=0]="NOT_RECORD",e[e.RECORD=1]="RECORD",e[e.RECORD_AND_SAMPLED=2]="RECORD_AND_SAMPLED",e})(Ln||{})});var De,td=u(()=>{"use strict";De=(function(e){return e[e.INTERNAL=0]="INTERNAL",e[e.SERVER=1]="SERVER",e[e.CLIENT=2]="CLIENT",e[e.PRODUCER=3]="PRODUCER",e[e.CONSUMER=4]="CONSUMER",e})(De||{})});var re,nd=u(()=>{"use strict";re=(function(e){return e[e.UNSET=0]="UNSET",e[e.OK=1]="OK",e[e.ERROR=2]="ERROR",e})(re||{})});var O,rd=u(()=>{"use strict";Cn();O=Pe.getInstance()});var m,od=u(()=>{"use strict";Tt();m=$.instance()});var qi,id,sd=u(()=>{"use strict";Gi();qi=class{getMeter(n,t,r){return ki}},id=new qi});var Xi,Xr,ad=u(()=>{"use strict";sd();Et();Tt();Xi="metrics",Xr=class e{constructor(){}static getInstance(){return this._instance||(this._instance=new e),this._instance}setGlobalMeterProvider(n){return Me(Xi,n,$.instance())}getMeterProvider(){return oe(Xi)||id}getMeter(n,t,r){return this.getMeterProvider().getMeter(n,t,r)}disable(){ve(Xi,$.instance())}}});var Dn,cd=u(()=>{"use strict";ad();Dn=Xr.getInstance()});var $r,ld=u(()=>{"use strict";$r=class{inject(n,t){}extract(n,t){return n}fields(){return[]}}});function Qi(e){return e.getValue($i)||void 0}function dd(){return Qi(Pe.getInstance().active())}function _d(e,n){return e.setValue($i,n)}function ud(e){return e.deleteValue($i)}var $i,md=u(()=>{"use strict";Cn();xn();$i=Ae("OpenTelemetry Baggage Key")});var Zi,bf,Qr,pd=u(()=>{"use strict";Et();ld();Yl();md();Pi();Tt();Zi="propagation",bf=new $r,Qr=class e{constructor(){this.createBaggage=kl,this.getBaggage=Qi,this.getActiveBaggage=dd,this.setBaggage=_d,this.deleteBaggage=ud}static getInstance(){return this._instance||(this._instance=new e),this._instance}setGlobalPropagator(n){return Me(Zi,n,$.instance())}inject(n,t,r=Hl){return this._getGlobalPropagator().inject(n,t,r)}extract(n,t,r=Gl){return this._getGlobalPropagator().extract(n,t,r)}fields(){return this._getGlobalPropagator().fields()}disable(){ve(Zi,$.instance())}_getGlobalPropagator(){return oe(Zi)||bf}}});var F,fd=u(()=>{"use strict";pd();F=Qr.getInstance()});var Ji,Zr,Ed=u(()=>{"use strict";Et();Jl();jr();zi();Tt();Ji="trace",Zr=class e{constructor(){this._proxyTracerProvider=new Pn,this.wrapSpanContext=$l,this.isSpanContextValid=ge,this.deleteSpan=jl,this.getSpan=Hr,this.getActiveSpan=zl,this.getSpanContext=Yr,this.setSpan=vn,this.setSpanContext=Wl}static getInstance(){return this._instance||(this._instance=new e),this._instance}setGlobalTracerProvider(n){let t=Me(Ji,this._proxyTracerProvider,$.instance());return t&&this._proxyTracerProvider.setDelegate(n),t}getTracerProvider(){return oe(Ji)||this._proxyTracerProvider}getTracer(n,t){return this.getTracerProvider().getTracer(n,t)}disable(){ve(Ji,$.instance()),this._proxyTracerProvider=new Pn}}});var x,Td=u(()=>{"use strict";Ed();x=Zr.getInstance()});var g=u(()=>{"use strict";Pi();xn();wr();Gi();ed();td();nd();Yi();jr();kr();rd();od();cd();fd();Td()});var Nd=u(()=>{"use strict"});var Cd=u(()=>{"use strict";Nd()});var wf,Md,vd=u(()=>{"use strict";wf="deployment.environment",Md=wf});var Pd=u(()=>{"use strict";vd()});var st,to,Ld,no,ro,oo,io,so,ao,co,Dd,ht,lo,At,gt,_o,yd,Id=u(()=>{"use strict";st="error.type",to="exception.message",Ld="exception.stacktrace",no="exception.type",ro="http.request.method",oo="http.request.method_original",io="http.response.status_code",so="server.address",ao="server.port",co="service.name",Dd="service.version",ht="telemetry.sdk.language",lo="webjs",At="telemetry.sdk.name",gt="telemetry.sdk.version",_o="url.full",yd="user_agent.original"});var wd=u(()=>{"use strict"});var Ud=u(()=>{"use strict"});var ze=u(()=>{"use strict";Cd();Pd();Id();wd();Ud()});var $d=Lt(me=>{"use strict";Object.defineProperty(me,"__esModule",{value:!0});me.toAnyValue=me.toKeyValue=me.toAttributes=me.createInstrumentationScope=me.createResource=void 0;function lE(e){return{attributes:Xd(e.attributes),droppedAttributesCount:0}}me.createResource=lE;function dE(e){return{name:e.name,version:e.version}}me.createInstrumentationScope=dE;function Xd(e){return Object.keys(e).map(n=>_s(n,e[n]))}me.toAttributes=Xd;function _s(e,n){return{key:e,value:us(n)}}me.toKeyValue=_s;function us(e){let n=typeof e;return n==="string"?{stringValue:e}:n==="number"?Number.isInteger(e)?{intValue:e}:{doubleValue:e}:n==="boolean"?{boolValue:e}:e instanceof Uint8Array?{bytesValue:e}:Array.isArray(e)?{arrayValue:{values:e.map(us)}}:n==="object"&&e!=null?{kvlistValue:{values:Object.entries(e).map(([t,r])=>_s(t,r))}}:{}}me.toAnyValue=us});function go(e){return e.setValue(ms,!0)}function Qd(e){return e.deleteValue(ms)}function zt(e){return e.getValue(ms)===!0}var ms,Bn=u(()=>{"use strict";g();ms=Ae("OpenTelemetry SDK Context Key SUPPRESS_TRACING")});var Ro,Zd=u(()=>{"use strict";Ro="baggage"});function e_(e){return e.reduce((n,t)=>{let r=`${n}${n!==""?",":""}${t}`;return r.length>8192?n:r},"")}function t_(e){return e.getAllEntries().map(([n,t])=>{let r=`${encodeURIComponent(n)}=${encodeURIComponent(t.value)}`;return t.metadata!==void 0&&(r+=";"+t.metadata.toString()),r})}function ps(e){let n=e.split(";");if(n.length<=0)return;let t=n.shift();if(!t)return;let r=t.indexOf("=");if(r<=0)return;let o=decodeURIComponent(t.substring(0,r).trim()),i=decodeURIComponent(t.substring(r+1).trim()),s;return n.length>0&&(s=On(n.join(";"))),{key:o,value:i,metadata:s}}function n_(e){let n={};return typeof e=="string"&&e.length>0&&e.split(",").forEach(t=>{let r=ps(t);r!==void 0&&r.value.length>0&&(n[r.key]=r.value)}),n}var fs=u(()=>{"use strict";g()});var xo,r_=u(()=>{"use strict";g();Bn();Zd();fs();xo=class{inject(n,t,r){let o=F.getBaggage(n);if(!o||zt(n))return;let i=t_(o).filter(a=>a.length<=4096).slice(0,180),s=e_(i);s.length>0&&r.set(t,Ro,s)}extract(n,t,r){let o=r.get(t,Ro),i=Array.isArray(o)?o.join(","):o;if(!i)return n;let s={};return i.length===0||(i.split(",").forEach(c=>{let l=ps(c);if(l){let _={value:l.value};l.metadata&&(_.metadata=l.metadata),s[l.key]=_}}),Object.entries(s).length===0)?n:F.setBaggage(n,F.createBaggage(s))}fields(){return[Ro]}}});var bo,o_=u(()=>{"use strict";bo=class{_monotonicClock;_epochMillis;_performanceMillis;constructor(n,t){this._monotonicClock=t,this._epochMillis=n.now(),this._performanceMillis=t.now()}now(){let n=this._monotonicClock.now()-this._performanceMillis;return this._epochMillis+n}}});function i_(e){let n={};if(typeof e!="object"||e==null)return n;for(let[t,r]of Object.entries(e)){if(!mE(t)){m.warn(`Invalid attribute key: ${t}`);continue}if(!Es(r)){m.warn(`Invalid attribute value set for key: ${t}`);continue}Array.isArray(r)?n[t]=r.slice():n[t]=r}return n}function mE(e){return typeof e=="string"&&e.length>0}function Es(e){return e==null?!0:Array.isArray(e)?pE(e):s_(e)}function pE(e){let n;for(let t of e)if(t!=null){if(!n){if(s_(t)){n=typeof t;continue}return!1}if(typeof t!==n)return!1}return!0}function s_(e){switch(typeof e){case"number":case"boolean":case"string":return!0}return!1}var a_=u(()=>{"use strict";g()});function No(){return e=>{m.error(fE(e))}}function fE(e){return typeof e=="string"?e:JSON.stringify(EE(e))}function EE(e){let n={},t=e;for(;t!==null;)Object.getOwnPropertyNames(t).forEach(r=>{if(n[r])return;let o=t[r];o&&(n[r]=String(o))}),t=Object.getPrototypeOf(t);return n}var Ts=u(()=>{"use strict";g()});function l_(e){c_=e}function d_(e){try{c_(e)}catch{}}var c_,__=u(()=>{"use strict";Ts();c_=No()});function Ss(e){}function hs(e){}function As(e){}function gs(e){}var u_=u(()=>{"use strict"});var Rs,m_=u(()=>{"use strict";Rs=typeof globalThis=="object"?globalThis:typeof self=="object"?self:typeof window=="object"?window:typeof global=="object"?global:{}});var xt,p_=u(()=>{"use strict";xt=performance});var f_,E_=u(()=>{"use strict";f_="2.0.1"});var T_,S_=u(()=>{"use strict";T_="process.runtime.name"});var Os,h_=u(()=>{"use strict";E_();ze();S_();Os={[At]:"opentelemetry",[T_]:"browser",[ht]:lo,[gt]:f_}});function xs(e){}var A_=u(()=>{"use strict"});var bs=u(()=>{"use strict";u_();m_();p_();h_();A_()});function jt(e){let n=e/1e3,t=Math.trunc(n),r=Math.round(e%1e3*SE);return[t,r]}function Mo(){let e=xt.timeOrigin;if(typeof e!="number"){let n=xt;e=n.timing&&n.timing.fetchStart}return e}function Ns(e){let n=jt(Mo()),t=jt(typeof e=="number"?e:xt.now());return Cs(n,t)}function R_(e){if(vo(e))return e;if(typeof e=="number")return e<Mo()?Ns(e):jt(e);if(e instanceof Date)return jt(e.getTime());throw TypeError("Invalid input type")}function O_(e,n){let t=n[0]-e[0],r=n[1]-e[1];return r<0&&(t-=1,r+=Co),[t,r]}function x_(e){let n=g_,t=`${"0".repeat(n)}${e[1]}Z`,r=t.substring(t.length-n-1);return new Date(e[0]*1e3).toISOString().replace("000Z",r)}function b_(e){return e[0]*Co+e[1]}function N_(e){return e[0]*1e3+e[1]/1e6}function C_(e){return e[0]*1e6+e[1]/1e3}function vo(e){return Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}function M_(e){return vo(e)||typeof e=="number"||e instanceof Date}function Cs(e,n){let t=[e[0]+n[0],e[1]+n[1]];return t[1]>=Co&&(t[1]-=Co,t[0]+=1),t}var g_,TE,SE,Co,v_=u(()=>{"use strict";bs();g_=9,TE=6,SE=Math.pow(10,TE),Co=Math.pow(10,g_)});var Ms,P_=u(()=>{"use strict";Ms=(function(e){return e[e.SUCCESS=0]="SUCCESS",e[e.FAILED=1]="FAILED",e})(Ms||{})});var Po,L_=u(()=>{"use strict";g();Po=class{_propagators;_fields;constructor(n={}){this._propagators=n.propagators??[],this._fields=Array.from(new Set(this._propagators.map(t=>typeof t.fields=="function"?t.fields():[]).reduce((t,r)=>t.concat(r),[])))}inject(n,t,r){for(let o of this._propagators)try{o.inject(n,t,r)}catch(i){m.warn(`Failed to inject with ${o.constructor.name}. Err: ${i.message}`)}}extract(n,t,r){return this._propagators.reduce((o,i)=>{try{return i.extract(o,t,r)}catch(s){m.warn(`Failed to extract with ${i.constructor.name}. Err: ${s.message}`)}return o},n)}fields(){return this._fields.slice()}}});function D_(e){return gE.test(e)}function y_(e){return RE.test(e)&&!OE.test(e)}var vs,hE,AE,gE,RE,OE,I_=u(()=>{"use strict";vs="[_0-9a-z-*/]",hE=`[a-z]${vs}{0,255}`,AE=`[a-z0-9]${vs}{0,240}@[a-z]${vs}{0,13}`,gE=new RegExp(`^(?:${hE}|${AE})$`),RE=/^[ -~]{0,255}[!-~]$/,OE=/,|=/});var w_,xE,U_,V_,Wt,Ps=u(()=>{"use strict";I_();w_=32,xE=512,U_=",",V_="=",Wt=class e{_internalState=new Map;constructor(n){n&&this._parse(n)}set(n,t){let r=this._clone();return r._internalState.has(n)&&r._internalState.delete(n),r._internalState.set(n,t),r}unset(n){let t=this._clone();return t._internalState.delete(n),t}get(n){return this._internalState.get(n)}serialize(){return this._keys().reduce((n,t)=>(n.push(t+V_+this.get(t)),n),[]).join(U_)}_parse(n){n.length>xE||(this._internalState=n.split(U_).reverse().reduce((t,r)=>{let o=r.trim(),i=o.indexOf(V_);if(i!==-1){let s=o.slice(0,i),a=o.slice(i+1,r.length);D_(s)&&y_(a)&&t.set(s,a)}return t},new Map),this._internalState.size>w_&&(this._internalState=new Map(Array.from(this._internalState.entries()).reverse().slice(0,w_))))}_keys(){return Array.from(this._internalState.keys()).reverse()}_clone(){let n=new e;return n._internalState=new Map(this._internalState),n}}});function Ls(e){let n=PE.exec(e);return!n||n[1]==="00"&&n[5]?null:{traceId:n[2],spanId:n[3],traceFlags:parseInt(n[4],16)}}var Fn,kn,bE,NE,CE,ME,vE,PE,Lo,B_=u(()=>{"use strict";g();Bn();Ps();Fn="traceparent",kn="tracestate",bE="00",NE="(?!ff)[\\da-f]{2}",CE="(?![0]{32})[\\da-f]{32}",ME="(?![0]{16})[\\da-f]{16}",vE="[\\da-f]{2}",PE=new RegExp(`^\\s?(${NE})-(${CE})-(${ME})-(${vE})(-.*)?\\s?$`);Lo=class{inject(n,t,r){let o=x.getSpanContext(n);if(!o||zt(n)||!ge(o))return;let i=`${bE}-${o.traceId}-${o.spanId}-0${Number(o.traceFlags||Q.NONE).toString(16)}`;r.set(t,Fn,i),o.traceState&&r.set(t,kn,o.traceState.serialize())}extract(n,t,r){let o=r.get(t,Fn);if(!o)return n;let i=Array.isArray(o)?o[0]:o;if(typeof i!="string")return n;let s=Ls(i);if(!s)return n;s.isRemote=!0;let a=r.get(t,kn);if(a){let c=Array.isArray(a)?a.join(","):a;s.traceState=new Wt(typeof c=="string"?c:void 0)}return x.setSpanContext(n,s)}fields(){return[Fn,kn]}}});function F_(e,n){return e.setValue(Ds,n)}function k_(e){return e.deleteValue(Ds)}function G_(e){return e.getValue(Ds)}var Ds,ys,H_=u(()=>{"use strict";g();Ds=Ae("OpenTelemetry SDK Context Key RPC_METADATA"),ys=(function(e){return e.HTTP="http",e})(ys||{})});function Is(e){if(!VE(e)||BE(e)!==LE)return!1;let n=UE(e);if(n===null)return!0;let t=z_.call(n,"constructor")&&n.constructor;return typeof t=="function"&&t instanceof t&&Y_.call(t)===wE}function VE(e){return e!=null&&typeof e=="object"}function BE(e){return e==null?e===void 0?yE:DE:bt&&bt in Object(e)?FE(e):kE(e)}function FE(e){let n=z_.call(e,bt),t=e[bt],r=!1;try{e[bt]=void 0,r=!0}catch{}let o=j_.call(e);return r&&(n?e[bt]=t:delete e[bt]),o}function kE(e){return j_.call(e)}var LE,DE,yE,IE,Y_,wE,UE,K_,z_,bt,j_,W_=u(()=>{"use strict";LE="[object Object]",DE="[object Null]",yE="[object Undefined]",IE=Function.prototype,Y_=IE.toString,wE=Y_.call(Object),UE=Object.getPrototypeOf,K_=Object.prototype,z_=K_.hasOwnProperty,bt=Symbol?Symbol.toStringTag:void 0,j_=K_.toString});function X_(...e){let n=e.shift(),t=new WeakMap;for(;e.length>0;)n=$_(n,e.shift(),0,t);return n}function ws(e){return yo(e)?e.slice():e}function $_(e,n,t=0,r){let o;if(!(t>GE)){if(t++,Do(e)||Do(n)||Q_(n))o=ws(n);else if(yo(e)){if(o=e.slice(),yo(n))for(let i=0,s=n.length;i<s;i++)o.push(ws(n[i]));else if(Gn(n)){let i=Object.keys(n);for(let s=0,a=i.length;s<a;s++){let c=i[s];o[c]=ws(n[c])}}}else if(Gn(e))if(Gn(n)){if(!HE(e,n))return n;o=Object.assign({},e);let i=Object.keys(n);for(let s=0,a=i.length;s<a;s++){let c=i[s],l=n[c];if(Do(l))typeof l>"u"?delete o[c]:o[c]=l;else{let _=o[c],f=l;if(q_(e,c,r)||q_(n,c,r))delete o[c];else{if(Gn(_)&&Gn(f)){let S=r.get(_)||[],T=r.get(f)||[];S.push({obj:e,key:c}),T.push({obj:n,key:c}),r.set(_,S),r.set(f,T)}o[c]=$_(o[c],l,t,r)}}}}else o=n;return o}}function q_(e,n,t){let r=t.get(e[n])||[];for(let o=0,i=r.length;o<i;o++){let s=r[o];if(s.key===n&&s.obj===e)return!0}return!1}function yo(e){return Array.isArray(e)}function Q_(e){return typeof e=="function"}function Gn(e){return!Do(e)&&!yo(e)&&!Q_(e)&&typeof e=="object"}function Do(e){return typeof e=="string"||typeof e=="number"||typeof e=="boolean"||typeof e>"u"||e instanceof Date||e instanceof RegExp||e===null}function HE(e,n){return!(!Is(e)||!Is(n))}var GE,Z_=u(()=>{"use strict";W_();GE=20});function J_(e,n){let t,r=new Promise(function(i,s){t=setTimeout(function(){s(new Hn("Operation timed out."))},n)});return Promise.race([e,r]).then(o=>(clearTimeout(t),o),o=>{throw clearTimeout(t),o})}var Hn,eu=u(()=>{"use strict";Hn=class e extends Error{constructor(n){super(n),Object.setPrototypeOf(this,e.prototype)}}});function Us(e,n){return typeof n=="string"?e===n:!!e.match(n)}function tu(e,n){if(!n)return!1;for(let t of n)if(Us(e,t))return!0;return!1}var nu=u(()=>{"use strict"});var Io,ru=u(()=>{"use strict";Io=class{_promise;_resolve;_reject;constructor(){this._promise=new Promise((n,t)=>{this._resolve=n,this._reject=t})}get promise(){return this._promise}resolve(n){this._resolve(n)}reject(n){this._reject(n)}}});var wo,ou=u(()=>{"use strict";ru();wo=class{_callback;_that;_isCalled=!1;_deferred=new Io;constructor(n,t){this._callback=n,this._that=t}get isCalled(){return this._isCalled}get promise(){return this._deferred.promise}call(...n){if(!this._isCalled){this._isCalled=!0;try{Promise.resolve(this._callback.call(this._that,...n)).then(t=>this._deferred.resolve(t),t=>this._deferred.reject(t))}catch(t){this._deferred.reject(t)}}return this._deferred.promise}}});function su(e){if(e==null)return;let n=iu[e.toUpperCase()];return n??(m.warn(`Unknown log level "${e}", expected one of ${Object.keys(iu)}, using default`),y.INFO)}var iu,au=u(()=>{"use strict";g();iu={ALL:y.ALL,VERBOSE:y.VERBOSE,DEBUG:y.DEBUG,INFO:y.INFO,WARN:y.WARN,ERROR:y.ERROR,NONE:y.NONE}});function cu(e,n){return new Promise(t=>{O.with(go(O.active()),()=>{e.export(n,r=>{t(r)})})})}var lu=u(()=>{"use strict";g();Bn()});var du={};Wm(du,{AnchoredClock:()=>bo,BindOnceFuture:()=>wo,CompositePropagator:()=>Po,ExportResultCode:()=>Ms,RPCType:()=>ys,SDK_INFO:()=>Os,TRACE_PARENT_HEADER:()=>Fn,TRACE_STATE_HEADER:()=>kn,TimeoutError:()=>Hn,TraceState:()=>Wt,W3CBaggagePropagator:()=>xo,W3CTraceContextPropagator:()=>Lo,_globalThis:()=>Rs,addHrTimes:()=>Cs,callWithTimeout:()=>J_,deleteRPCMetadata:()=>k_,diagLogLevelFromString:()=>su,getBooleanFromEnv:()=>hs,getNumberFromEnv:()=>As,getRPCMetadata:()=>G_,getStringFromEnv:()=>Ss,getStringListFromEnv:()=>gs,getTimeOrigin:()=>Mo,globalErrorHandler:()=>d_,hrTime:()=>Ns,hrTimeDuration:()=>O_,hrTimeToMicroseconds:()=>C_,hrTimeToMilliseconds:()=>N_,hrTimeToNanoseconds:()=>b_,hrTimeToTimeStamp:()=>x_,internal:()=>YE,isAttributeValue:()=>Es,isTimeInput:()=>M_,isTimeInputHrTime:()=>vo,isTracingSuppressed:()=>zt,isUrlIgnored:()=>tu,loggingErrorHandler:()=>No,merge:()=>X_,millisToHrTime:()=>jt,otperformance:()=>xt,parseKeyPairsIntoRecord:()=>n_,parseTraceParent:()=>Ls,sanitizeAttributes:()=>i_,setGlobalErrorHandler:()=>l_,setRPCMetadata:()=>F_,suppressTracing:()=>go,timeInputToHrTime:()=>R_,unrefTimer:()=>xs,unsuppressTracing:()=>Qd,urlMatches:()=>Us});var YE,_u=u(()=>{"use strict";r_();o_();a_();__();Ts();v_();P_();fs();bs();L_();B_();H_();Bn();Ps();Z_();eu();nu();ou();au();lu();YE={_export:cu}});var mu=Lt(Uo=>{"use strict";Object.defineProperty(Uo,"__esModule",{value:!0});Uo.hexToBinary=void 0;function uu(e){return e>=48&&e<=57?e-48:e>=97&&e<=102?e-87:e-55}function KE(e){let n=new Uint8Array(e.length/2),t=0;for(let r=0;r<e.length;r+=2){let o=uu(e.charCodeAt(r)),i=uu(e.charCodeAt(r+1));n[t++]=o<<4|i}return n}Uo.hexToBinary=KE});var Su=Lt(pe=>{"use strict";Object.defineProperty(pe,"__esModule",{value:!0});pe.getOtlpEncoder=pe.encodeAsString=pe.encodeAsLongBits=pe.toLongBits=pe.hrTimeToNanos=void 0;var zE=(_u(),qm(du)),Vs=mu();function Bs(e){let n=BigInt(1e9);return BigInt(e[0])*n+BigInt(e[1])}pe.hrTimeToNanos=Bs;function fu(e){let n=Number(BigInt.asUintN(32,e)),t=Number(BigInt.asUintN(32,e>>BigInt(32)));return{low:n,high:t}}pe.toLongBits=fu;function Fs(e){let n=Bs(e);return fu(n)}pe.encodeAsLongBits=Fs;function Eu(e){return Bs(e).toString()}pe.encodeAsString=Eu;var jE=typeof BigInt<"u"?Eu:zE.hrTimeToNanoseconds;function pu(e){return e}function Tu(e){if(e!==void 0)return(0,Vs.hexToBinary)(e)}var WE={encodeHrTime:Fs,encodeSpanContext:Vs.hexToBinary,encodeOptionalSpanContext:Tu};function qE(e){if(e===void 0)return WE;let n=e.useLongBits??!0,t=e.useHex??!1;return{encodeHrTime:n?Fs:jE,encodeSpanContext:t?pu:Vs.hexToBinary,encodeOptionalSpanContext:t?pu:Tu}}pe.getOtlpEncoder=qE});var Ru=Lt(ye=>{"use strict";Object.defineProperty(ye,"__esModule",{value:!0});ye.createExportTraceServiceRequest=ye.toOtlpSpanEvent=ye.toOtlpLink=ye.sdkSpanToOtlpSpan=void 0;var Yn=$d(),XE=Su();function hu(e,n){let t=e.spanContext(),r=e.status,o=e.parentSpanContext?.spanId?n.encodeSpanContext(e.parentSpanContext?.spanId):void 0;return{traceId:n.encodeSpanContext(t.traceId),spanId:n.encodeSpanContext(t.spanId),parentSpanId:o,traceState:t.traceState?.serialize(),name:e.name,kind:e.kind==null?0:e.kind+1,startTimeUnixNano:n.encodeHrTime(e.startTime),endTimeUnixNano:n.encodeHrTime(e.endTime),attributes:(0,Yn.toAttributes)(e.attributes),droppedAttributesCount:e.droppedAttributesCount,events:e.events.map(i=>gu(i,n)),droppedEventsCount:e.droppedEventsCount,status:{code:r.code,message:r.message},links:e.links.map(i=>Au(i,n)),droppedLinksCount:e.droppedLinksCount}}ye.sdkSpanToOtlpSpan=hu;function Au(e,n){return{attributes:e.attributes?(0,Yn.toAttributes)(e.attributes):[],spanId:n.encodeSpanContext(e.context.spanId),traceId:n.encodeSpanContext(e.context.traceId),traceState:e.context.traceState?.serialize(),droppedAttributesCount:e.droppedAttributesCount||0}}ye.toOtlpLink=Au;function gu(e,n){return{attributes:e.attributes?(0,Yn.toAttributes)(e.attributes):[],name:e.name,timeUnixNano:n.encodeHrTime(e.time),droppedAttributesCount:e.droppedAttributesCount||0}}ye.toOtlpSpanEvent=gu;function $E(e,n){let t=(0,XE.getOtlpEncoder)(n);return{resourceSpans:ZE(e,t)}}ye.createExportTraceServiceRequest=$E;function QE(e){let n=new Map;for(let t of e){let r=n.get(t.resource);r||(r=new Map,n.set(t.resource,r));let o=`${t.instrumentationScope.name}@${t.instrumentationScope.version||""}:${t.instrumentationScope.schemaUrl||""}`,i=r.get(o);i||(i=[],r.set(o,i)),i.push(t)}return n}function ZE(e,n){let t=QE(e),r=[],o=t.entries(),i=o.next();for(;!i.done;){let[s,a]=i.value,c=[],l=a.values(),_=l.next();for(;!_.done;){let S=_.value;if(S.length>0){let T=S.map(h=>hu(h,n));c.push({scope:(0,Yn.createInstrumentationScope)(S[0].instrumentationScope),spans:T,schemaUrl:S[0].instrumentationScope.schemaUrl})}_=l.next()}let f={resource:(0,Yn.createResource)(s),scopeSpans:c,schemaUrl:void 0};r.push(f),i=o.next()}return r}});var Ou=Lt(ct=>{"use strict";Object.defineProperty(ct,"__esModule",{value:!0});ct.EStatusCode=ct.ESpanKind=void 0;var JE;(function(e){e[e.SPAN_KIND_UNSPECIFIED=0]="SPAN_KIND_UNSPECIFIED",e[e.SPAN_KIND_INTERNAL=1]="SPAN_KIND_INTERNAL",e[e.SPAN_KIND_SERVER=2]="SPAN_KIND_SERVER",e[e.SPAN_KIND_CLIENT=3]="SPAN_KIND_CLIENT",e[e.SPAN_KIND_PRODUCER=4]="SPAN_KIND_PRODUCER",e[e.SPAN_KIND_CONSUMER=5]="SPAN_KIND_CONSUMER"})(JE=ct.ESpanKind||(ct.ESpanKind={}));var eT;(function(e){e[e.STATUS_CODE_UNSET=0]="STATUS_CODE_UNSET",e[e.STATUS_CODE_OK=1]="STATUS_CODE_OK",e[e.STATUS_CODE_ERROR=2]="STATUS_CODE_ERROR"})(eT=ct.EStatusCode||(ct.EStatusCode={}))});var Xu=Lt(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.ATTR_HTTP_USER_AGENT=Y.ATTR_HTTP_URL=Y.ATTR_HTTP_STATUS_CODE=Y.ATTR_HTTP_SCHEME=Y.ATTR_HTTP_RESPONSE_CONTENT_LENGTH=Y.ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED=Y.ATTR_HTTP_REQUEST_BODY_SIZE=Y.ATTR_HTTP_METHOD=Y.ATTR_HTTP_HOST=void 0;Y.ATTR_HTTP_HOST="http.host";Y.ATTR_HTTP_METHOD="http.method";Y.ATTR_HTTP_REQUEST_BODY_SIZE="http.request.body.size";Y.ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED="http.request_content_length_uncompressed";Y.ATTR_HTTP_RESPONSE_CONTENT_LENGTH="http.response_content_length";Y.ATTR_HTTP_SCHEME="http.scheme";Y.ATTR_HTTP_STATUS_CODE="http.status_code";Y.ATTR_HTTP_URL="http.url";Y.ATTR_HTTP_USER_AGENT="http.user_agent"});var $c=[{path:"blog",loadChildren:()=>import("./chunk-YN2ZDF5A.js")},{path:"query",loadChildren:()=>import("./chunk-Q5AI3UT6.js")},{path:"",redirectTo:"blog",pathMatch:"full"}];var Lr=class extends Ya{serialize(n){return this._withTrailingSlash(super.serialize(n))}_withTrailingSlash(n){let t=n.indexOf("?")>-1?"?":"#",r=n.split(t);return r[0].endsWith("/")||n.substring(n.lastIndexOf("/")+1).indexOf(".")===-1&&(r[0]+="/"),r.join(t)}};var Qc={providers:[Aa(),ja($c),Ga(ka()),Ba(Fa()),{provide:ga,useValue:"fullstackladder-app"},{provide:Ha,useClass:Lr}]};function Xm(e,n){e&1&&tt(0,"div",2)}var $m=new U("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var Jc=(()=>{class e{_elementRef=d(q);_ngZone=d(K);_changeDetectorRef=d(Se);_renderer=d(ce);_cleanupTransitionEnd;constructor(){let t=oc(),r=d($m,{optional:!0});this._isNoopAnimation=t==="di-disabled",t==="reduced-motion"&&this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion"),r&&(r.color&&(this.color=this._defaultColor=r.color),this.mode=r.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(t){this._color=t}_color;_defaultColor="primary";get value(){return this._value}set value(t){this._value=Zc(t||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(t){this._bufferValue=Zc(t||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new se;get mode(){return this._mode}set mode(t){this._mode=t,this._changeDetectorRef.markForCheck()}_mode="determinate";ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,"transitionend",this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}_transitionendHandler=t=>{this.animationEnd.observers.length===0||!t.target||!t.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(r,o){r&2&&(de("aria-valuenow",o._isIndeterminate()?null:o.value)("mode",o.mode),Tr("mat-"+o.color),B("_mat-animation-noopable",o._isNoopAnimation)("mdc-linear-progress--animation-ready",!o._isNoopAnimation)("mdc-linear-progress--indeterminate",o._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",pi],bufferValue:[2,"bufferValue","bufferValue",pi],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(r,o){r&1&&(Je(0,"div",0),tt(1,"div",1),b(2,Xm,1,0,"div",2),et(),Je(3,"div",3),tt(4,"span",4),et(),Je(5,"div",5),tt(6,"span",4),et()),r&2&&(A(),Ut("flex-basis",o._getBufferBarFlexBasis()),A(),N(o.mode==="buffer"?2:-1),A(),Ut("transform",o._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--mat-progress-bar-track-height, 4px), var(--mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));
  border-top-width: var(--mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--mat-progress-bar-track-height, 4px);
  border-radius: var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant)) calc(var(--mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2})}return e})();function Zc(e,n=0,t=100){return Math.max(n,Math.min(t,e))}var el=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({imports:[Ce]})}return e})();var tl=["*"],Jm=["content"],ep=[[["mat-drawer"],["mat-sidenav"]],[["mat-drawer-content"],["mat-sidenav-content"]],"*"],tp=["mat-drawer, mat-sidenav","mat-drawer-content, mat-sidenav-content","*"];function np(e,n){if(e&1){let t=mn();p(0,"div",1),X("click",function(){Fe(t);let o=w();return ke(o._onBackdropClicked())}),E()}if(e&2){let t=w();B("mat-drawer-shown",t._isShowingBackdrop())}}function rp(e,n){e&1&&(p(0,"mat-drawer-content"),z(1,2),E())}var op=new U("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),nl=new U("MAT_DRAWER_CONTAINER"),Sn=(()=>{class e extends br{_platform=d(_e);_changeDetectorRef=d(Se);_element=d(q);_ngZone=d(K);_isInert=!1;_container=d(gi);ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>this._changeDetectorRef.markForCheck())}_drawerToggled(t){t.opened?this._ngZone.runOutsideAngular(()=>{t._animationEnd.pipe(cr(50),dn(1)).subscribe(()=>this._updateInert())}):this._updateInert()}_drawerModeChanged(){this._updateInert()}_updateInert(){let t=this._container._isShowingBackdrop();if(t!==this._isInert){let r=this._element.nativeElement;this._isInert=t,t?r.setAttribute("inert","true"):r.removeAttribute("inert")}}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:t,end:r}=this._container;return t!=null&&t.mode!=="over"&&t.opened||r!=null&&r.mode!=="over"&&r.opened}static \u0275fac=(()=>{let t;return function(o){return(t||(t=Oa(e)))(o||e)}})();static \u0275cmp=V({type:e,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(r,o){r&2&&(Ut("margin-left",o._container._contentMargins.left,"px")("margin-right",o._container._contentMargins.right,"px"),B("mat-drawer-content-hidden",o._shouldBeHidden()))},features:[be([{provide:br,useExisting:e}]),Pa],ngContentSelectors:tl,decls:1,vars:0,template:function(r,o){r&1&&(Ge(),z(0))},encapsulation:2})}return e})(),Ai=(()=>{class e{_elementRef=d(q);_focusTrapFactory=d(tc);_focusMonitor=d(Xa);_platform=d(_e);_ngZone=d(K);_renderer=d(ce);_interactivityChecker=d(ec);_doc=d(dr);_container=d(nl,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(t){t=t==="end"?"end":"start",t!==this._position&&(this._isAttached&&this._updatePositionInParent(t),this._position=t,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(t){this._mode=t,this._updateFocusTrapState(),this._modeChanged.next(),this._getContent()?._drawerModeChanged()}_mode="over";get disableClose(){return this._disableClose}set disableClose(t){this._disableClose=ue(t)}_disableClose=!1;get autoFocus(){let t=this._autoFocus;return t??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(t){(t==="true"||t==="false"||t==null)&&(t=ue(t)),this._autoFocus=t}_autoFocus;get opened(){return this._opened()}set opened(t){this.toggle(ue(t))}_opened=ae(!1);_openedVia=null;_animationStarted=new k;_animationEnd=new k;openedChange=new se(!0);_openedStream=this.openedChange.pipe(W(t=>t),Ee(()=>{}));openedStart=this._animationStarted.pipe(W(()=>this.opened),mi(void 0));_closedStream=this.openedChange.pipe(W(t=>!t),Ee(()=>{}));closedStart=this._animationStarted.pipe(W(()=>!this.opened),mi(void 0));_destroyed=new k;onPositionChanged=new se;_content;_modeChanged=new k;_injector=d(ut);_changeDetectorRef=d(Se);constructor(){this.openedChange.pipe(te(this._destroyed)).subscribe(t=>{t?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let t=this._renderer,r=this._elementRef.nativeElement;return[t.listen(r,"keydown",o=>{o.keyCode===27&&!this.disableClose&&!Bt(o)&&this._ngZone.run(()=>{this.close(),o.stopPropagation(),o.preventDefault()})}),t.listen(r,"transitionend",this._handleTransitionEvent),t.listen(r,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_focusByCssSelector(t,r){let o=this._elementRef.nativeElement.querySelector(t);o&&(this._interactivityChecker.isFocusable(o)||(o.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let i=()=>{s(),a(),o.removeAttribute("tabindex")},s=this._renderer.listen(o,"blur",i),a=this._renderer.listen(o,"mousedown",i)})),o.focus(r))}_takeFocus(){if(!this._focusTrap)return;let t=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":un(()=>{!this._focusTrap.focusInitialElement()&&typeof t.focus=="function"&&t.focus()},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(t){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,t):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let t=this._doc.activeElement;return!!t&&this._elementRef.nativeElement.contains(t)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(t=>t()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(t){return this.toggle(!0,t)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(t=!this.opened,r){t&&r&&(this._openedVia=r);let o=this._setOpen(t,!t&&this._isFocusWithinDrawer(),this._openedVia||"program");return t||(this._openedVia=null),o}_setOpen(t,r,o){return t===this.opened?Promise.resolve(t?"open":"close"):(this._opened.set(t),this._getContent()?._drawerToggled(this),this._container?._transitionsEnabled?(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()}),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",t),!t&&r&&this._restoreFocus(o),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(i=>{this.openedChange.pipe(dn(1)).subscribe(s=>i(s?"open":"close"))}))}_getContent(){return this._container?._content||this._container?._userContent}_setIsAnimating(t){this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",t)}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(t){if(!this._platform.isBrowser)return;let r=this._elementRef.nativeElement,o=r.parentNode;t==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),o.insertBefore(this._anchor,r)),o.appendChild(r)):this._anchor&&this._anchor.parentNode.insertBefore(r,this._anchor)}_handleTransitionEvent=t=>{let r=this._elementRef.nativeElement;t.target===r&&this._ngZone.run(()=>{t.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(t)})};static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["mat-drawer"]],viewQuery:function(r,o){if(r&1&&nt(Jm,5),r&2){let i;v(i=P())&&(o._content=i.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(r,o){r&2&&(de("align",null)("tabIndex",o.mode!=="side"?"-1":null),Ut("visibility",!o._container&&!o.opened?"hidden":null),B("mat-drawer-end",o.position==="end")("mat-drawer-over",o.mode==="over")("mat-drawer-push",o.mode==="push")("mat-drawer-side",o.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:tl,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(r,o){r&1&&(Ge(),p(0,"div",1,0),z(2),E())},dependencies:[br],encapsulation:2})}return e})(),gi=(()=>{class e{_dir=d(Ft,{optional:!0});_element=d(q);_ngZone=d(K);_changeDetectorRef=d(Se);_animationDisabled=ft();_transitionsEnabled=!1;_allDrawers;_drawers=new xa;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(t){this._autosize=ue(t)}_autosize=d(op);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(t){this._backdropOverride=t==null?null:ue(t)}_backdropOverride=null;backdropClick=new se;_start=null;_end=null;_left=null;_right=null;_destroyed=new k;_doCheckSubject=new k;_contentMargins={left:null,right:null};_contentMarginChanges=new k;get scrollable(){return this._userContent||this._content}_injector=d(ut);constructor(){let t=d(_e),r=d(Nr);this._dir?.change.pipe(te(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),r.change().pipe(te(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&t.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(Be(this._allDrawers),te(this._destroyed)).subscribe(t=>{this._drawers.reset(t.filter(r=>!r._container||r._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(Be(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(t=>{this._watchDrawerToggle(t),this._watchDrawerPosition(t),this._watchDrawerMode(t)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(ar(10),te(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(t=>t.open())}close(){this._drawers.forEach(t=>t.close())}updateContentMargins(){let t=0,r=0;if(this._left&&this._left.opened){if(this._left.mode=="side")t+=this._left._getWidth();else if(this._left.mode=="push"){let o=this._left._getWidth();t+=o,r-=o}}if(this._right&&this._right.opened){if(this._right.mode=="side")r+=this._right._getWidth();else if(this._right.mode=="push"){let o=this._right._getWidth();r+=o,t-=o}}t=t||null,r=r||null,(t!==this._contentMargins.left||r!==this._contentMargins.right)&&(this._contentMargins={left:t,right:r},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(t){t._animationStarted.pipe(te(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),t.mode!=="side"&&t.openedChange.pipe(te(this._drawers.changes)).subscribe(()=>this._setContainerClass(t.opened))}_watchDrawerPosition(t){t.onPositionChanged.pipe(te(this._drawers.changes)).subscribe(()=>{un({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(t){t._modeChanged.pipe(te(Qe(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(t){let r=this._element.nativeElement.classList,o="mat-drawer-container-has-open";t?r.add(o):r.remove(o)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(t=>{t.position=="end"?(this._end!=null,this._end=t):(this._start!=null,this._start=t)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(t=>t&&!t.disableClose&&this._drawerHasBackdrop(t)).forEach(t=>t._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(t){return t!=null&&t.opened}_drawerHasBackdrop(t){return this._backdropOverride==null?!!t&&t.mode!=="side":this._backdropOverride}static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["mat-drawer-container"]],contentQueries:function(r,o,i){if(r&1&&wt(i,Sn,5)(i,Ai,5),r&2){let s;v(s=P())&&(o._content=s.first),v(s=P())&&(o._allDrawers=s)}},viewQuery:function(r,o){if(r&1&&nt(Sn,5),r&2){let i;v(i=P())&&(o._userContent=i.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(r,o){r&2&&B("mat-drawer-container-explicit-backdrop",o._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[be([{provide:nl,useExisting:e}])],ngContentSelectors:tp,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(r,o){r&1&&(Ge(ep),b(0,np,1,2,"div",0),z(1),z(2,1),b(3,rp,2,0,"mat-drawer-content")),r&2&&(N(o.hasBackdrop?0:-1),A(3),N(o._content?-1:3))},dependencies:[Sn],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--mat-sidenav-content-text-color, var(--mat-sys-on-background));
  background-color: var(--mat-sidenav-content-background-color, var(--mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--mat-sidenav-scrim-color, color-mix(in srgb, var(--mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--mat-sidenav-container-text-color, var(--mat-sys-on-surface-variant));
  box-shadow: var(--mat-sidenav-container-elevation-shadow, none);
  background-color: var(--mat-sidenav-container-background-color, var(--mat-sys-surface));
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  width: var(--mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-left-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-bottom-right-radius: var(--mat-sidenav-container-shape, var(--mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2})}return e})();var rl=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({imports:[En,Ce,En]})}return e})();var ap=e=>({exact:e}),cp=(e,n)=>n.link;function lp(e,n){if(e&1&&(p(0,"a",12)(1,"span",14)(2,"mat-icon",15),L(3),E(),p(4,"span",16),L(5),E()()()),e&2){let t=n.$implicit;ne("routerLinkActiveOptions",ya(4,ap,t.link==="/blog"))("routerLink",t.link),A(3),ot(t.icon),A(2),ot(t.text)}}var ol=(()=>{class e{constructor(){this.matIconRegistry=d(ac),this.sitePostService=d(Mr),this.postCount=He(()=>Object.keys(this.sitePostService.postsMeta()).length),this.categoryCount=He(()=>new Set(this.sitePostService.postCategories()).size),this.tagCount=He(()=>new Set(this.sitePostService.postTags()).size),this.menuItems=ae([{link:"/blog",icon:"home",text:"\u9996\u9801"},{link:"/blog/categories",icon:"apps",text:"\u5206\u985E"},{link:"/blog/tags",icon:"label",text:"\u6A19\u7C64"},{link:"/blog/archives",icon:"archive",text:"\u6B78\u6A94"}]).asReadonly()}ngOnInit(){this.matIconRegistry.registerFontClassAlias("fontawesome","fab")}static{this.\u0275fac=function(r){return new(r||e)}}static{this.\u0275cmp=V({type:e,selectors:[["app-layout-sidebar"]],decls:51,vars:3,consts:[[1,"post-statics","flex","p-4"],[1,"statics-block","flex","flex-col","flex-[33%]"],["routerLink","/blog/archives",1,"no-underline","hover:no-underline"],[1,"counter","text-[color:var(--sidebar-highlight-text-color)]","text-[24px]","text-center"],[1,"description","text-[color:var(--sidebar-text-color)]","text-[16px]","text-center"],["routerLink","/blog/categories",1,"no-underline","hover:no-underline"],["routerLink","/blog/tags",1,"no-underline","hover:no-underline"],[1,"my-1"],[1,"section-title","text-[color:var(--sidebar-text-color)]","text-[20px]","text-center","my-1"],[1,"section-content","text-[color:var(--sidebar-text-color)]","text-center"],["href","https://www.tenlong.com.tw/products/9789864348039","target","_blank","rel","noreferrer",1,"no-underline",2,"display","flex","flex-direction","column","align-items","center"],["src","assets/promotion/rxjs.webp","width","160px","height","224px","alt","\u6253\u901A RxJS \u4EFB\u7763\u4E8C\u8108 - \u597D\u8A55\u71B1\u552E\u4E2D\uFF01","loading","lazy"],["mat-list-item","","routerLinkActive","text-[color:var(--sidebar-highlight-text-color)]",3,"routerLinkActiveOptions","routerLink"],["mat-list-item","","href","/atom.xml","target","_blank","rel","noreferrer"],[1,"flex","flex-row"],[1,"mr-2"],[1,"link-text"],["mat-list-item","","href","https://github.com/wellwind/","target","_blank","rel","noreferrer"],["fontSet","fontawesome","fontIcon","fa-github",1,"mr-2"],["mat-list-item","","href","https://www.facebook.com/fullstackledder","target","_blank","rel","noreferrer"],["fontSet","fontawesome","fontIcon","fa-facebook",1,"mr-2"]],template:function(r,o){r&1&&(p(0,"div",0)(1,"div",1)(2,"a",2)(3,"div",3),L(4),E(),p(5,"div",4),L(6," \u6587\u7AE0 "),E()()(),p(7,"div",1)(8,"a",5)(9,"div",3),L(10),E(),p(11,"div",4),L(12," \u5206\u985E "),E()()(),p(13,"div",1)(14,"a",6)(15,"div",3),L(16),E(),p(17,"div",4),L(18," \u6A19\u7C64 "),E()()()(),G(19,"mat-divider",7),p(20,"div")(21,"div",8),L(22," \u597D\u66F8\u63A8\u85A6 "),E(),p(23,"div",9)(24,"mat-nav-list")(25,"a",10),G(26,"img",11),p(27,"div"),L(28,"\u6253\u901A RxJS \u4EFB\u7763\u4E8C\u8108"),E()()()()(),G(29,"mat-divider",7),p(30,"mat-nav-list"),pr(31,lp,6,6,"a",12,cp),E(),G(33,"mat-divider",7),p(34,"mat-nav-list")(35,"a",13)(36,"span",14)(37,"mat-icon",15),L(38,"rss_feed"),E(),p(39,"span",16),L(40,"RSS"),E()()(),p(41,"a",17)(42,"span",14),G(43,"mat-icon",18),p(44,"span",16),L(45,"GitHub"),E()()(),p(46,"a",19)(47,"span",14),G(48,"mat-icon",20),p(49,"span",16),L(50,"Facebook"),E()()()()),r&2&&(A(4),Sr(" ",o.postCount()," "),A(6),Sr(" ",o.categoryCount()," "),A(6),Sr(" ",o.tagCount()," "),A(15),fr(o.menuItems()))},dependencies:[Rr,za,Nc,bc,Bc,Vc,Uc,xr,Or],encapsulation:2})}}return e})();var Ri=class{_box;_destroyed=new k;_resizeSubject=new k;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(t=>this._resizeSubject.next(t)))}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new ln(t=>{let r=this._resizeSubject.subscribe(t);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),r.unsubscribe(),this._elementObservables.delete(n)}}).pipe(W(t=>t.some(r=>r.target===n)),Ea({bufferSize:1,refCount:!0}),te(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},il=(()=>{class e{_cleanupErrorListener;_observers=new Map;_ngZone=d(K);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,t]of this._observers)t.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(t,r){let o=r?.box||"content-box";return this._observers.has(o)||this._observers.set(o,new Ri(o)),this._observers.get(o).observe(t)}static \u0275fac=function(r){return new(r||e)};static \u0275prov=ur({token:e,factory:e.\u0275fac})}return e})();var dp=["notch"],_p=["*"],sl=["iconPrefixContainer"],al=["textPrefixContainer"],cl=["iconSuffixContainer"],ll=["textSuffixContainer"],up=["textField"],mp=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],pp=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function fp(e,n){e&1&&G(0,"span",21)}function Ep(e,n){if(e&1&&(p(0,"label",20),z(1,1),b(2,fp,1,0,"span",21),E()),e&2){let t=w(2);ne("floating",t._shouldLabelFloat())("monitorResize",t._hasOutline())("id",t._labelId),de("for",t._control.disableAutomaticLabeling?null:t._control.id),A(2),N(!t.hideRequiredMarker&&t._control.required?2:-1)}}function Tp(e,n){if(e&1&&b(0,Ep,3,5,"label",20),e&2){let t=w();N(t._hasFloatingLabel()?0:-1)}}function Sp(e,n){e&1&&G(0,"div",7)}function hp(e,n){}function Ap(e,n){if(e&1&&mr(0,hp,0,0,"ng-template",13),e&2){w(2);let t=rt(1);ne("ngTemplateOutlet",t)}}function gp(e,n){if(e&1&&(p(0,"div",9),b(1,Ap,1,1,null,13),E()),e&2){let t=w();ne("matFormFieldNotchedOutlineOpen",t._shouldLabelFloat()),A(),N(t._forceDisplayInfixLabel()?-1:1)}}function Rp(e,n){e&1&&(p(0,"div",10,2),z(2,2),E())}function Op(e,n){e&1&&(p(0,"div",11,3),z(2,3),E())}function xp(e,n){}function bp(e,n){if(e&1&&mr(0,xp,0,0,"ng-template",13),e&2){w();let t=rt(1);ne("ngTemplateOutlet",t)}}function Np(e,n){e&1&&(p(0,"div",14,4),z(2,4),E())}function Cp(e,n){e&1&&(p(0,"div",15,5),z(2,5),E())}function Mp(e,n){e&1&&G(0,"div",16)}function vp(e,n){e&1&&(p(0,"div",18),z(1,6),E())}function Pp(e,n){if(e&1&&(p(0,"mat-hint",22),L(1),E()),e&2){let t=w(2);ne("id",t._hintLabelId),A(),ot(t.hintLabel)}}function Lp(e,n){if(e&1&&(p(0,"div",19),b(1,Pp,2,2,"mat-hint",22),z(2,7),G(3,"div",23),z(4,8),E()),e&2){let t=w();A(),N(t.hintLabel?1:-1)}}var Oi=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["mat-label"]]})}return e})(),Dp=new U("MatError");var xi=(()=>{class e{align="start";id=d(pt).getId("mat-mdc-hint-");static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(r,o){r&2&&(It("id",o.id),de("align",null),B("mat-mdc-form-field-hint-end",o.align==="end"))},inputs:{align:"align",id:"id"}})}return e})(),yp=new U("MatPrefix");var Ip=new U("MatSuffix");var El=new U("FloatingLabelParent"),dl=(()=>{class e{_elementRef=d(q);get floating(){return this._floating}set floating(t){this._floating=t,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(t){this._monitorResize=t,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=d(il);_ngZone=d(K);_parent=d(El);_resizeSubscription=new Dt;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return wp(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(r,o){r&2&&B("mdc-floating-label--float-above",o.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return e})();function wp(e){let n=e;if(n.offsetParent!==null)return n.scrollWidth;let t=n.cloneNode(!0);t.style.setProperty("position","absolute"),t.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(t);let r=t.scrollWidth;return t.remove(),r}var _l="mdc-line-ripple--active",yr="mdc-line-ripple--deactivating",ul=(()=>{class e{_elementRef=d(q);_cleanupTransitionEnd;constructor(){let t=d(K),r=d(ce);t.runOutsideAngular(()=>{this._cleanupTransitionEnd=r.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let t=this._elementRef.nativeElement.classList;t.remove(yr),t.add(_l)}deactivate(){this._elementRef.nativeElement.classList.add(yr)}_handleTransitionEnd=t=>{let r=this._elementRef.nativeElement.classList,o=r.contains(yr);t.propertyName==="opacity"&&o&&r.remove(_l,yr)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return e})(),ml=(()=>{class e{_elementRef=d(q);_ngZone=d(K);open=!1;_notch;ngAfterViewInit(){let t=this._elementRef.nativeElement,r=t.querySelector(".mdc-floating-label");r?(t.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(r.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>r.style.transitionDuration="")}))):t.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(t){let r=this._notch.nativeElement;!this.open||!t?r.style.width="":r.style.width=`calc(${t}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(t){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${t}px)`)}static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(r,o){if(r&1&&nt(dp,5),r&2){let i;v(i=P())&&(o._notch=i.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(r,o){r&2&&B("mdc-notched-outline--notched",o.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:_p,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(r,o){r&1&&(Ge(),tt(0,"div",1),Je(1,"div",2,0),z(3),et(),tt(4,"div",3))},encapsulation:2})}return e})(),bi=(()=>{class e{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e})}return e})();var hn=new U("MatFormField"),Up=new U("MAT_FORM_FIELD_DEFAULT_OPTIONS"),pl="fill",Vp="auto",fl="fixed",Bp="translateY(-50%)",Tl=(()=>{class e{_elementRef=d(q);_changeDetectorRef=d(Se);_platform=d(_e);_idGenerator=d(pt);_ngZone=d(K);_defaults=d(Up,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=mt("iconPrefixContainer");_textPrefixContainerSignal=mt("textPrefixContainer");_iconSuffixContainerSignal=mt("iconSuffixContainer");_textSuffixContainerSignal=mt("textSuffixContainer");_prefixSuffixContainers=He(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(t=>t?.nativeElement).filter(t=>t!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=wa(Oi);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(t){this._hideRequiredMarker=ue(t)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||Vp}set floatLabel(t){t!==this._floatLabel&&(this._floatLabel=t,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(t){let r=t||this._defaults?.appearance||pl;this._appearanceSignal.set(r)}_appearanceSignal=ae(pl);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||fl}set subscriptSizing(t){this._subscriptSizing=t||this._defaults?.subscriptSizing||fl}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(t){this._hintLabel=t,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(t){this._explicitFormFieldControl=t}_destroyed=new k;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=ft();constructor(){let t=this._defaults,r=d(Ft);t&&(t.appearance&&(this.appearance=t.appearance),this._hideRequiredMarker=!!t?.hideRequiredMarker,t.color&&(this.color=t.color)),Ze(()=>this._currentDirection=r.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=He(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(t){let r=this._control,o="mat-mdc-form-field-type-";t&&this._elementRef.nativeElement.classList.remove(o+t.controlType),r.controlType&&this._elementRef.nativeElement.classList.add(o+r.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=r.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=r.stateChanges.pipe(Be([void 0,void 0]),Ee(()=>[r.errorState,r.userAriaDescribedBy]),lr(),W(([[i,s],[a,c]])=>i!==a||s!==c)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),r.ngControl&&r.ngControl.valueChanges&&(this._valueChanges=r.ngControl.valueChanges.pipe(te(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(t=>!t._isText),this._hasTextPrefix=!!this._prefixChildren.find(t=>t._isText),this._hasIconSuffix=!!this._suffixChildren.find(t=>!t._isText),this._hasTextSuffix=!!this._suffixChildren.find(t=>t._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),Qe(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let t=this._control.focused;t&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!t&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",t),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",t)}_syncOutlineLabelOffset(){fi({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let t of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(t,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:t=>this._writeOutlinedLabelStyles(t())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=He(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(t){let r=this._control?this._control.ngControl:null;return r&&r[t]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let t=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&t.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let i=this._hintChildren?this._hintChildren.find(a=>a.align==="start"):null,s=this._hintChildren?this._hintChildren.find(a=>a.align==="end"):null;i?t.push(i.id):this._hintLabel&&t.push(this._hintLabelId),s&&t.push(s.id)}else this._errorChildren&&t.push(...this._errorChildren.map(i=>i.id));let r=this._control.describedByIds,o;if(r){let i=this._describedByIds||t;o=t.concat(r.filter(s=>s&&!i.includes(s)))}else o=t;this._control.setDescribedByIds(o),this._describedByIds=t}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let t=this._iconPrefixContainer?.nativeElement,r=this._textPrefixContainer?.nativeElement,o=this._iconSuffixContainer?.nativeElement,i=this._textSuffixContainer?.nativeElement,s=t?.getBoundingClientRect().width??0,a=r?.getBoundingClientRect().width??0,c=o?.getBoundingClientRect().width??0,l=i?.getBoundingClientRect().width??0,_=this._currentDirection==="rtl"?"-1":"1",f=`${s+a}px`,T=`calc(${_} * (${f} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,h=`var(--mat-mdc-form-field-label-transform, ${Bp} translateX(${T}))`,R=s+a+c+l;return[h,R]}_writeOutlinedLabelStyles(t){if(t!==null){let[r,o]=t;this._floatingLabel&&(this._floatingLabel.element.style.transform=r),o!==null&&this._notchedOutline?._setMaxWidth(o)}}_isAttachedToDom(){let t=this._elementRef.nativeElement;if(t.getRootNode){let r=t.getRootNode();return r&&r!==t}return document.documentElement.contains(t)}static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["mat-form-field"]],contentQueries:function(r,o,i){if(r&1&&(Da(i,o._labelChild,Oi,5),wt(i,bi,5)(i,yp,5)(i,Ip,5)(i,Dp,5)(i,xi,5)),r&2){pn();let s;v(s=P())&&(o._formFieldControl=s.first),v(s=P())&&(o._prefixChildren=s),v(s=P())&&(o._suffixChildren=s),v(s=P())&&(o._errorChildren=s),v(s=P())&&(o._hintChildren=s)}},viewQuery:function(r,o){if(r&1&&(Er(o._iconPrefixContainerSignal,sl,5)(o._textPrefixContainerSignal,al,5)(o._iconSuffixContainerSignal,cl,5)(o._textSuffixContainerSignal,ll,5),nt(up,5)(sl,5)(al,5)(cl,5)(ll,5)(dl,5)(ml,5)(ul,5)),r&2){pn(4);let i;v(i=P())&&(o._textField=i.first),v(i=P())&&(o._iconPrefixContainer=i.first),v(i=P())&&(o._textPrefixContainer=i.first),v(i=P())&&(o._iconSuffixContainer=i.first),v(i=P())&&(o._textSuffixContainer=i.first),v(i=P())&&(o._floatingLabel=i.first),v(i=P())&&(o._notchedOutline=i.first),v(i=P())&&(o._lineRipple=i.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(r,o){r&2&&B("mat-mdc-form-field-label-always-float",o._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",o._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",o._hasIconSuffix)("mat-form-field-invalid",o._control.errorState)("mat-form-field-disabled",o._control.disabled)("mat-form-field-autofilled",o._control.autofilled)("mat-form-field-appearance-fill",o.appearance=="fill")("mat-form-field-appearance-outline",o.appearance=="outline")("mat-form-field-hide-placeholder",o._hasFloatingLabel()&&!o._shouldLabelFloat())("mat-primary",o.color!=="accent"&&o.color!=="warn")("mat-accent",o.color==="accent")("mat-warn",o.color==="warn")("ng-untouched",o._shouldForward("untouched"))("ng-touched",o._shouldForward("touched"))("ng-pristine",o._shouldForward("pristine"))("ng-dirty",o._shouldForward("dirty"))("ng-valid",o._shouldForward("valid"))("ng-invalid",o._shouldForward("invalid"))("ng-pending",o._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[be([{provide:hn,useExisting:e},{provide:El,useExisting:e}])],ngContentSelectors:pp,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(r,o){if(r&1&&(Ge(mp),mr(0,Tp,1,1,"ng-template",null,0,Ia),p(2,"div",6,1),X("click",function(s){return o._control.onContainerClick(s)}),b(4,Sp,1,0,"div",7),p(5,"div",8),b(6,gp,2,2,"div",9),b(7,Rp,3,0,"div",10),b(8,Op,3,0,"div",11),p(9,"div",12),b(10,bp,1,1,null,13),z(11),E(),b(12,Np,3,0,"div",14),b(13,Cp,3,0,"div",15),E(),b(14,Mp,1,0,"div",16),E(),p(15,"div",17),b(16,vp,2,0,"div",18)(17,Lp,5,1,"div",19),E()),r&2){let i;A(2),B("mdc-text-field--filled",!o._hasOutline())("mdc-text-field--outlined",o._hasOutline())("mdc-text-field--no-label",!o._hasFloatingLabel())("mdc-text-field--disabled",o._control.disabled)("mdc-text-field--invalid",o._control.errorState),A(2),N(!o._hasOutline()&&!o._control.disabled?4:-1),A(2),N(o._hasOutline()?6:-1),A(),N(o._hasIconPrefix?7:-1),A(),N(o._hasTextPrefix?8:-1),A(2),N(!o._hasOutline()||o._forceDisplayInfixLabel()?10:-1),A(2),N(o._hasTextSuffix?12:-1),A(),N(o._hasIconSuffix?13:-1),A(),N(o._hasOutline()?-1:14),A(),B("mat-mdc-form-field-subscript-dynamic-size",o.subscriptSizing==="dynamic");let s=o._getSubscriptMessageType();A(),N((i=s)==="error"?16:i==="hint"?17:-1)}},dependencies:[dl,ml,Ua,ul,xi],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) {
  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));
  border-width: var(--mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));
}

.mdc-line-ripple--active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--mat-form-field-container-height, 56px);
  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));
  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));
  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));
  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));
  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));
  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})}return e})();var Hp=["panel"],Yp=["*"];function Kp(e,n){if(e&1&&(Je(0,"div",1,0),z(2),et()),e&2){let t=n.id,r=w();Tr(r._classList),B("mat-mdc-autocomplete-visible",r.showPanel)("mat-mdc-autocomplete-hidden",!r.showPanel)("mat-autocomplete-panel-animations-enabled",!r._animationsDisabled)("mat-primary",r._color==="primary")("mat-accent",r._color==="accent")("mat-warn",r._color==="warn"),It("id",r.id),de("aria-label",r.ariaLabel||null)("aria-labelledby",r._getPanelAriaLabelledby(t))}}var Ni=class{source;option;constructor(n,t){this.source=n,this.option=t}},hl=new U("mat-autocomplete-default-options",{providedIn:"root",factory:()=>({autoActiveFirstOption:!1,autoSelectActiveOption:!1,hideSingleSelectionIndicator:!1,requireSelection:!1,hasBackdrop:!1})}),Al=(()=>{class e{_changeDetectorRef=d(Se);_elementRef=d(q);_defaults=d(hl);_animationsDisabled=ft();_activeOptionChanges=Dt.EMPTY;_keyManager;showPanel=!1;get isOpen(){return this._isOpen&&this.showPanel}_isOpen=!1;_latestOpeningTrigger;_setColor(t){this._color=t,this._changeDetectorRef.markForCheck()}_color;template;panel;options;optionGroups;ariaLabel;ariaLabelledby;displayWith=null;autoActiveFirstOption;autoSelectActiveOption;requireSelection;panelWidth;disableRipple=!1;optionSelected=new se;opened=new se;closed=new se;optionActivated=new se;set classList(t){this._classList=t,this._elementRef.nativeElement.className=""}_classList;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._syncParentProperties()}_hideSingleSelectionIndicator;_syncParentProperties(){if(this.options)for(let t of this.options)t._changeDetectorRef.markForCheck()}id=d(pt).getId("mat-autocomplete-");inertGroups;constructor(){let t=d(_e);this.inertGroups=t?.SAFARI||!1,this.autoActiveFirstOption=!!this._defaults.autoActiveFirstOption,this.autoSelectActiveOption=!!this._defaults.autoSelectActiveOption,this.requireSelection=!!this._defaults.requireSelection,this._hideSingleSelectionIndicator=this._defaults.hideSingleSelectionIndicator??!1}ngAfterContentInit(){this._keyManager=new nc(this.options).withWrap().skipPredicate(this._skipPredicate),this._activeOptionChanges=this._keyManager.change.subscribe(t=>{this.isOpen&&this.optionActivated.emit({source:this,option:this.options.toArray()[t]||null})}),this._setVisibility()}ngOnDestroy(){this._keyManager?.destroy(),this._activeOptionChanges.unsubscribe()}_setScrollTop(t){this.panel&&(this.panel.nativeElement.scrollTop=t)}_getScrollTop(){return this.panel?this.panel.nativeElement.scrollTop:0}_setVisibility(){this.showPanel=!!this.options?.length,this._changeDetectorRef.markForCheck()}_emitSelectEvent(t){let r=new Ni(this,t);this.optionSelected.emit(r)}_getPanelAriaLabelledby(t){if(this.ariaLabel)return null;let r=t?t+" ":"";return this.ariaLabelledby?r+this.ariaLabelledby:t}_skipPredicate(){return!1}static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["mat-autocomplete"]],contentQueries:function(r,o,i){if(r&1&&wt(i,vr,5)(i,Ac,5),r&2){let s;v(s=P())&&(o.options=s),v(s=P())&&(o.optionGroups=s)}},viewQuery:function(r,o){if(r&1&&nt(ba,7)(Hp,5),r&2){let i;v(i=P())&&(o.template=i.first),v(i=P())&&(o.panel=i.first)}},hostAttrs:[1,"mat-mdc-autocomplete"],inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],displayWith:"displayWith",autoActiveFirstOption:[2,"autoActiveFirstOption","autoActiveFirstOption",Ne],autoSelectActiveOption:[2,"autoSelectActiveOption","autoSelectActiveOption",Ne],requireSelection:[2,"requireSelection","requireSelection",Ne],panelWidth:"panelWidth",disableRipple:[2,"disableRipple","disableRipple",Ne],classList:[0,"class","classList"],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",Ne]},outputs:{optionSelected:"optionSelected",opened:"opened",closed:"closed",optionActivated:"optionActivated"},exportAs:["matAutocomplete"],features:[be([{provide:hc,useExisting:e}])],ngContentSelectors:Yp,decls:1,vars:0,consts:[["panel",""],["role","listbox",1,"mat-mdc-autocomplete-panel","mdc-menu-surface","mdc-menu-surface--open",3,"id"]],template:function(r,o){r&1&&(Ge(),La(0,Kp,3,17,"ng-template"))},styles:[`div.mat-mdc-autocomplete-panel {
  width: 100%;
  max-height: 256px;
  visibility: hidden;
  transform-origin: center top;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  position: relative;
  border-radius: var(--mat-autocomplete-container-shape, var(--mat-sys-corner-extra-small));
  box-shadow: var(--mat-autocomplete-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  background-color: var(--mat-autocomplete-background-color, var(--mat-sys-surface-container));
}
@media (forced-colors: active) {
  div.mat-mdc-autocomplete-panel {
    outline: solid 1px;
  }
}
.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  transform-origin: center bottom;
}
div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible {
  visibility: visible;
}

div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden,
.cdk-overlay-pane:has(> .mat-mdc-autocomplete-hidden) {
  visibility: hidden;
  pointer-events: none;
}

@keyframes _mat-autocomplete-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.mat-autocomplete-panel-animations-enabled {
  animation: _mat-autocomplete-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}

mat-autocomplete {
  display: none;
}
`],encapsulation:2})}return e})();var zp={provide:Cc,useExisting:Sa(()=>Ci),multi:!0};var jp=new U("mat-autocomplete-scroll-strategy",{providedIn:"root",factory:()=>{let e=d(ut);return()=>lc(e)}}),Ci=(()=>{class e{_environmentInjector=d(ha);_element=d(q);_injector=d(ut);_viewContainerRef=d(va);_zone=d(K);_changeDetectorRef=d(Se);_dir=d(Ft,{optional:!0});_formField=d(hn,{optional:!0,host:!0});_viewportRuler=d(Nr);_scrollStrategy=d(jp);_renderer=d(ce);_animationsDisabled=ft();_defaults=d(hl,{optional:!0});_overlayRef=null;_portal;_componentDestroyed=!1;_initialized=new k;_keydownSubscription;_outsideClickSubscription;_cleanupWindowBlur;_previousValue=null;_valueOnAttach=null;_valueOnLastKeydown=null;_positionStrategy;_manuallyFloatingLabel=!1;_closingActionsSubscription;_viewportSubscription=Dt.EMPTY;_breakpointObserver=d(Za);_handsetLandscapeSubscription=Dt.EMPTY;_canOpenOnNextFocus=!0;_valueBeforeAutoSelection;_pendingAutoselectedOption=null;_closeKeyEventStream=new k;_overlayPanelClass=Qa(this._defaults?.overlayPanelClass||[]);_windowBlurHandler=()=>{this._canOpenOnNextFocus=this.panelOpen||!this._hasFocus()};_onChange=()=>{};_onTouched=()=>{};autocomplete;position="auto";connectedTo;autocompleteAttribute="off";autocompleteDisabled=!1;_aboveClass="mat-mdc-autocomplete-panel-above";ngAfterViewInit(){this._initialized.next(),this._initialized.complete(),this._cleanupWindowBlur=this._renderer.listen("window","blur",this._windowBlurHandler)}ngOnChanges(t){t.position&&this._positionStrategy&&(this._setStrategyPositions(this._positionStrategy),this.panelOpen&&this._overlayRef.updatePosition())}ngOnDestroy(){this._cleanupWindowBlur?.(),this._handsetLandscapeSubscription.unsubscribe(),this._viewportSubscription.unsubscribe(),this._componentDestroyed=!0,this._destroyPanel(),this._closeKeyEventStream.complete()}get panelOpen(){return this._overlayAttached&&this.autocomplete.showPanel}_overlayAttached=!1;openPanel(){this._openPanelInternal()}closePanel(){this._resetLabel(),this._overlayAttached&&(this.panelOpen&&this._zone.run(()=>{this.autocomplete.closed.emit()}),this.autocomplete._latestOpeningTrigger===this&&(this.autocomplete._isOpen=!1,this.autocomplete._latestOpeningTrigger=null),this._overlayAttached=!1,this._pendingAutoselectedOption=null,this._overlayRef&&this._overlayRef.hasAttached()&&(this._overlayRef.detach(),this._closingActionsSubscription.unsubscribe()),this._updatePanelState(),this._componentDestroyed||this._changeDetectorRef.detectChanges())}updatePosition(){this._overlayAttached&&this._overlayRef.updatePosition()}get panelClosingActions(){return Qe(this.optionSelections,this.autocomplete._keyManager.tabOut.pipe(W(()=>this._overlayAttached)),this._closeKeyEventStream,this._getOutsideClickStream(),this._overlayRef?this._overlayRef.detachments().pipe(W(()=>this._overlayAttached)):ui()).pipe(Ee(t=>t instanceof gc?t:null))}optionSelections=sr(()=>{let t=this.autocomplete?this.autocomplete.options:null;return t?t.changes.pipe(Be(t),yt(()=>Qe(...t.map(r=>r.onSelectionChange)))):this._initialized.pipe(yt(()=>this.optionSelections))});get activeOption(){return this.autocomplete&&this.autocomplete._keyManager?this.autocomplete._keyManager.activeItem:null}_getOutsideClickStream(){return new ln(t=>{let r=i=>{let s=qa(i),a=this._formField?this._formField.getConnectedOverlayOrigin().nativeElement:null,c=this.connectedTo?this.connectedTo.elementRef.nativeElement:null;this._overlayAttached&&s!==this._element.nativeElement&&!this._hasFocus()&&(!a||!a.contains(s))&&(!c||!c.contains(s))&&this._overlayRef&&!this._overlayRef.overlayElement.contains(s)&&t.next(i)},o=[this._renderer.listen("document","click",r),this._renderer.listen("document","auxclick",r),this._renderer.listen("document","touchend",r)];return()=>{o.forEach(i=>i())}})}writeValue(t){Promise.resolve(null).then(()=>this._assignOptionValue(t))}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this._element.nativeElement.disabled=t}_handleKeydown(t){let r=t,o=r.keyCode,i=Bt(r);if(o===27&&!i&&r.preventDefault(),this._valueOnLastKeydown=this._element.nativeElement.value,this.activeOption&&o===13&&this.panelOpen&&!i)this.activeOption._selectViaInteraction(),this._resetActiveItem(),r.preventDefault();else if(this.autocomplete){let s=this.autocomplete._keyManager.activeItem,a=o===38||o===40;o===9||a&&!i&&this.panelOpen?this.autocomplete._keyManager.onKeydown(r):a&&this._canOpen()&&this._openPanelInternal(this._valueOnLastKeydown),(a||this.autocomplete._keyManager.activeItem!==s)&&(this._scrollToOption(this.autocomplete._keyManager.activeItemIndex||0),this.autocomplete.autoSelectActiveOption&&this.activeOption&&(this._pendingAutoselectedOption||(this._valueBeforeAutoSelection=this._valueOnLastKeydown),this._pendingAutoselectedOption=this.activeOption,this._assignOptionValue(this.activeOption.value)))}}_handleInput(t){let r=t.target,o=r.value;if(r.type==="number"&&(o=o==""?null:parseFloat(o)),this._previousValue!==o){if(this._previousValue=o,this._pendingAutoselectedOption=null,(!this.autocomplete||!this.autocomplete.requireSelection)&&this._onChange(o),!o)this._clearPreviousSelectedOption(null,!1);else if(this.panelOpen&&!this.autocomplete.requireSelection){let i=this.autocomplete.options?.find(s=>s.selected);if(i){let s=this._getDisplayValue(i.value);o!==s&&i.deselect(!1)}}if(this._canOpen()&&this._hasFocus()){let i=this._valueOnLastKeydown??this._element.nativeElement.value;this._valueOnLastKeydown=null,this._openPanelInternal(i)}}}_handleFocus(){this._canOpenOnNextFocus?this._canOpen()&&(this._previousValue=this._element.nativeElement.value,this._attachOverlay(this._previousValue),this._floatLabel(!0)):this._canOpenOnNextFocus=!0}_handleClick(){this._canOpen()&&!this.panelOpen&&this._openPanelInternal()}_hasFocus(){return Wa()===this._element.nativeElement}_floatLabel(t=!1){this._formField&&this._formField.floatLabel==="auto"&&(t?this._formField._animateAndLockLabel():this._formField.floatLabel="always",this._manuallyFloatingLabel=!0)}_resetLabel(){this._manuallyFloatingLabel&&(this._formField&&(this._formField.floatLabel="auto"),this._manuallyFloatingLabel=!1)}_subscribeToClosingActions(){let t=new ln(o=>{un(()=>{o.next()},{injector:this._environmentInjector})}),r=this.autocomplete.options?.changes.pipe(Ta(()=>this._positionStrategy.reapplyLastPosition()),cr(0))??ui();return Qe(t,r).pipe(yt(()=>this._zone.run(()=>{let o=this.panelOpen;return this._resetActiveItem(),this._updatePanelState(),this._changeDetectorRef.detectChanges(),this.panelOpen&&this._overlayRef.updatePosition(),o!==this.panelOpen&&(this.panelOpen?this._emitOpened():this.autocomplete.closed.emit()),this.panelClosingActions})),dn(1)).subscribe(o=>this._setValueAndClose(o))}_emitOpened(){this.autocomplete.opened.emit()}_destroyPanel(){this._overlayRef&&(this.closePanel(),this._overlayRef.dispose(),this._overlayRef=null)}_getDisplayValue(t){let r=this.autocomplete;return r&&r.displayWith?r.displayWith(t):t}_assignOptionValue(t){let r=this._getDisplayValue(t);t==null&&this._clearPreviousSelectedOption(null,!1),this._updateNativeInputValue(r??"")}_updateNativeInputValue(t){this._formField?this._formField._control.value=t:this._element.nativeElement.value=t,this._previousValue=t}_setValueAndClose(t){let r=this.autocomplete,o=t?t.source:this._pendingAutoselectedOption;o?(this._clearPreviousSelectedOption(o),this._assignOptionValue(o.value),this._onChange(o.value),r._emitSelectEvent(o),this._element.nativeElement.focus()):r.requireSelection&&this._element.nativeElement.value!==this._valueOnAttach&&(this._clearPreviousSelectedOption(null),this._assignOptionValue(null),this._onChange(null)),this.closePanel()}_clearPreviousSelectedOption(t,r){this.autocomplete?.options?.forEach(o=>{o!==t&&o.selected&&o.deselect(r)})}_openPanelInternal(t=this._element.nativeElement.value){this._attachOverlay(t),this._floatLabel()}_attachOverlay(t){if(!this.autocomplete)return;let r=this._overlayRef;r?(this._positionStrategy.setOrigin(this._getConnectedElement()),r.updateSize({width:this._getPanelWidth()})):(this._portal=new cc(this.autocomplete.template,this._viewContainerRef,{id:this._formField?.getLabelId()}),r=uc(this._injector,this._getOverlayConfig()),this._overlayRef=r,this._viewportSubscription=this._viewportRuler.change().subscribe(()=>{this.panelOpen&&r&&r.updateSize({width:this._getPanelWidth()})}),this._handsetLandscapeSubscription=this._breakpointObserver.observe(rc.HandsetLandscape).subscribe(i=>{i.matches?this._positionStrategy.withFlexibleDimensions(!0).withGrowAfterOpen(!0).withViewportMargin(8):this._positionStrategy.withFlexibleDimensions(!1).withGrowAfterOpen(!1).withViewportMargin(0)})),r&&!r.hasAttached()&&(r.attach(this._portal),this._valueOnAttach=t,this._valueOnLastKeydown=null,this._closingActionsSubscription=this._subscribeToClosingActions());let o=this.panelOpen;this.autocomplete._isOpen=this._overlayAttached=!0,this.autocomplete._latestOpeningTrigger=this,this.autocomplete._setColor(this._formField?.color),this._updatePanelState(),this.panelOpen&&o!==this.panelOpen&&this._emitOpened()}_handlePanelKeydown=t=>{(t.keyCode===27&&!Bt(t)||t.keyCode===38&&Bt(t,"altKey"))&&(this._pendingAutoselectedOption&&(this._updateNativeInputValue(this._valueBeforeAutoSelection??""),this._pendingAutoselectedOption=null),this._closeKeyEventStream.next(),this._resetActiveItem(),t.stopPropagation(),t.preventDefault())};_updatePanelState(){if(this.autocomplete._setVisibility(),this.panelOpen){let t=this._overlayRef;this._keydownSubscription||(this._keydownSubscription=t.keydownEvents().subscribe(this._handlePanelKeydown)),this._outsideClickSubscription||(this._outsideClickSubscription=t.outsidePointerEvents().subscribe())}else this._keydownSubscription?.unsubscribe(),this._outsideClickSubscription?.unsubscribe(),this._keydownSubscription=this._outsideClickSubscription=void 0}_getOverlayConfig(){return new dc({positionStrategy:this._getOverlayPosition(),scrollStrategy:this._scrollStrategy(),width:this._getPanelWidth(),direction:this._dir??void 0,hasBackdrop:this._defaults?.hasBackdrop,backdropClass:this._defaults?.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:this._overlayPanelClass,disableAnimations:this._animationsDisabled})}_getOverlayPosition(){let t=_c(this._injector,this._getConnectedElement()).withFlexibleDimensions(!1).withPush(!1).withPopoverLocation("inline");return this._setStrategyPositions(t),this._positionStrategy=t,t}_setStrategyPositions(t){let r=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],o=this._aboveClass,i=[{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:o},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:o}],s;this.position==="above"?s=i:this.position==="below"?s=r:s=[...r,...i],t.withPositions(s)}_getConnectedElement(){return this.connectedTo?this.connectedTo.elementRef:this._formField?this._formField.getConnectedOverlayOrigin():this._element}_getPanelWidth(){return this.autocomplete.panelWidth||this._getHostWidth()}_getHostWidth(){return this._getConnectedElement().nativeElement.getBoundingClientRect().width}_resetActiveItem(){let t=this.autocomplete;if(t.autoActiveFirstOption){let r=-1;for(let o=0;o<t.options.length;o++)if(!t.options.get(o).disabled){r=o;break}t._keyManager.setActiveItem(r)}else t._keyManager.setActiveItem(-1)}_canOpen(){let t=this._element.nativeElement;return!t.readOnly&&!t.disabled&&!this.autocompleteDisabled}_scrollToOption(t){let r=this.autocomplete,o=Rc(t,r.options,r.optionGroups);if(t===0&&o===1)r._setScrollTop(0);else if(r.panel){let i=r.options.toArray()[t];if(i){let s=i._getHostElement(),a=Oc(s.offsetTop,s.offsetHeight,r._getScrollTop(),r.panel.nativeElement.offsetHeight);r._setScrollTop(a)}}}static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["input","matAutocomplete",""],["textarea","matAutocomplete",""]],hostAttrs:[1,"mat-mdc-autocomplete-trigger"],hostVars:7,hostBindings:function(r,o){r&1&&X("focusin",function(){return o._handleFocus()})("blur",function(){return o._onTouched()})("input",function(s){return o._handleInput(s)})("keydown",function(s){return o._handleKeydown(s)})("click",function(){return o._handleClick()}),r&2&&de("autocomplete",o.autocompleteAttribute)("role",o.autocompleteDisabled?null:"combobox")("aria-autocomplete",o.autocompleteDisabled?null:"list")("aria-activedescendant",o.panelOpen&&o.activeOption?o.activeOption.id:null)("aria-expanded",o.autocompleteDisabled?null:o.panelOpen.toString())("aria-controls",o.autocompleteDisabled||!o.panelOpen?null:o.autocomplete?.id)("aria-haspopup",o.autocompleteDisabled?null:"listbox")},inputs:{autocomplete:[0,"matAutocomplete","autocomplete"],position:[0,"matAutocompletePosition","position"],connectedTo:[0,"matAutocompleteConnectedTo","connectedTo"],autocompleteAttribute:[0,"autocomplete","autocompleteAttribute"],autocompleteDisabled:[2,"matAutocompleteDisabled","autocompleteDisabled",Ne]},exportAs:["matAutocompleteTrigger"],features:[be([zp]),_r]})}return e})(),gl=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({imports:[mc,Si,En,Si,Ce]})}return e})();var qp=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275cmp=V({type:e,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(r,o){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2})}return e})(),Xp={passive:!0},Rl=(()=>{class e{_platform=d(_e);_ngZone=d(K);_renderer=d(Na).createRenderer(null,null);_styleLoader=d($a);_monitoredElements=new Map;monitor(t){if(!this._platform.isBrowser)return ma;this._styleLoader.load(qp);let r=Ei(t),o=this._monitoredElements.get(r);if(o)return o.subject;let i=new k,s="cdk-text-field-autofilled",a=l=>{l.animationName==="cdk-text-field-autofill-start"&&!r.classList.contains(s)?(r.classList.add(s),this._ngZone.run(()=>i.next({target:l.target,isAutofilled:!0}))):l.animationName==="cdk-text-field-autofill-end"&&r.classList.contains(s)&&(r.classList.remove(s),this._ngZone.run(()=>i.next({target:l.target,isAutofilled:!1})))},c=this._ngZone.runOutsideAngular(()=>(r.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(r,"animationstart",a,Xp)));return this._monitoredElements.set(r,{subject:i,unlisten:c}),i}stopMonitoring(t){let r=Ei(t),o=this._monitoredElements.get(r);o&&(o.unlisten(),o.subject.complete(),r.classList.remove("cdk-text-field-autofill-monitored"),r.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(r))}ngOnDestroy(){this._monitoredElements.forEach((t,r)=>this.stopMonitoring(r))}static \u0275fac=function(r){return new(r||e)};static \u0275prov=ur({token:e,factory:e.\u0275fac})}return e})();var Ol=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({})}return e})();var xl=new U("");var bl=new U("MAT_INPUT_VALUE_ACCESSOR");var Mi=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({imports:[Ja,Tl,Ce]})}return e})();var $p=["button","checkbox","file","hidden","image","radio","range","reset","submit"],Qp=new U("MAT_INPUT_CONFIG"),Nl=(()=>{class e{_elementRef=d(q);_platform=d(_e);ngControl=d(Pc,{optional:!0,self:!0});_autofillMonitor=d(Rl);_ngZone=d(K);_formField=d(hn,{optional:!0});_renderer=d(ce);_uid=d(pt).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=d(Qp,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new k;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=ue(t),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(t){this._id=t||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(vc.required)??!1}set required(t){this._required=ue(t)}_required;get type(){return this._type}set type(t){this._type=t||"text",this._validateType(),!this._isTextarea&&Ti().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(t){this._errorStateTracker.matcher=t}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(t){t!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(t):this._inputValueAccessor.value=t,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(t){this._readonly=ue(t)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(t){this._errorStateTracker.errorState=t}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(t=>Ti().has(t));constructor(){let t=d(Dc,{optional:!0}),r=d(Ic,{optional:!0}),o=d(Sc),i=d(bl,{optional:!0,self:!0}),s=d(xl,{optional:!0,self:!0}),a=this._elementRef.nativeElement,c=a.nodeName.toLowerCase();i?Ra(i.value)?this._signalBasedValueAccessor=i:this._inputValueAccessor=i:this._inputValueAccessor=a,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(a,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new xc(o,s||this.ngControl,r,t,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=c==="select",this._isTextarea=c==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=a.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&Ze(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(t=>{this.autofilled=t.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(t){this._elementRef.nativeElement.focus(t)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(t){if(t!==this.focused){if(!this._isNativeSelect&&t&&this.disabled&&this.disabledInteractive){let r=this._elementRef.nativeElement;r.type==="number"?(r.type="text",r.setSelectionRange(0,0),r.type="number"):r.setSelectionRange(0,0)}this.focused=t,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let t=this._elementRef.nativeElement.value;this._previousNativeValue!==t&&(this._previousNativeValue=t,this.stateChanges.next())}_dirtyCheckPlaceholder(){let t=this._getPlaceholder();if(t!==this._previousPlaceholder){let r=this._elementRef.nativeElement;this._previousPlaceholder=t,t?r.setAttribute("placeholder",t):r.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){$p.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let t=this._elementRef.nativeElement.validity;return t&&t.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let t=this._elementRef.nativeElement,r=t.options[0];return this.focused||t.multiple||!this.empty||!!(t.selectedIndex>-1&&r&&r.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(t){let r=this._elementRef.nativeElement;t.length?r.setAttribute("aria-describedby",t.join(" ")):r.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let t=this._elementRef.nativeElement;return this._isNativeSelect&&(t.multiple||t.size>1)}_iOSKeyupListener=t=>{let r=t.target;!r.value&&r.selectionStart===0&&r.selectionEnd===0&&(r.setSelectionRange(1,1),r.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(r){return new(r||e)};static \u0275dir=Te({type:e,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(r,o){r&1&&X("focus",function(){return o._focusChanged(!0)})("blur",function(){return o._focusChanged(!1)})("input",function(){return o._onInput()}),r&2&&(It("id",o.id)("disabled",o.disabled&&!o.disabledInteractive)("required",o.required),de("name",o.name||null)("readonly",o._getReadonlyAttribute())("aria-disabled",o.disabled&&o.disabledInteractive?"true":null)("aria-invalid",o.empty&&o.required?null:o.errorState)("aria-required",o.required)("id",o.id),B("mat-input-server",o._isServer)("mat-mdc-form-field-textarea-control",o._isInFormField&&o._isTextarea)("mat-mdc-form-field-input-control",o._isInFormField)("mat-mdc-input-disabled-interactive",o.disabledInteractive)("mdc-text-field__input",o._isInFormField)("mat-mdc-native-select-inline",o._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",Ne]},exportAs:["matInput"],features:[be([{provide:bi,useExisting:e}]),_r]})}return e})(),Cl=(()=>{class e{static \u0275fac=function(r){return new(r||e)};static \u0275mod=le({type:e});static \u0275inj=ie({imports:[Mi,Mi,Ol,Ce]})}return e})();var Jp=(e,n)=>n.link;function ef(e,n){e&1&&(p(0,"mat-icon"),L(1,"menu_open"),E())}function tf(e,n){e&1&&(p(0,"mat-icon"),L(1,"menu"),E())}function nf(e,n){e&1&&(p(0,"mat-icon"),L(1,"light_mode"),E())}function rf(e,n){e&1&&(p(0,"mat-icon"),L(1,"dark_mode"),E())}function of(e,n){if(e&1){let t=mn();p(0,"button",9),X("click",function(){Fe(t);let o=w();return ke(o.toggleTheme())}),b(1,nf,2,0,"mat-icon")(2,rf,2,0,"mat-icon"),E()}if(e&2){let t=w();A(),N(t.theme()==="light"?1:2)}}function sf(e,n){if(e&1&&(p(0,"mat-option",12)(1,"span",13),L(2),E(),p(3,"span",14),L(4),E()()),e&2){let t=n.$implicit;ne("value",t),A(2),ot(t.type),A(2),ot(t.text)}}function af(e,n){if(e&1){let t=mn();p(0,"div",8)(1,"input",10,0),X("keyup.enter",function(){Fe(t);let o=rt(2),i=rt(3),s=rt(5),a=w();return a.searchKeywordChange.emit(a.searchKeyword.value||""),o.blur(),i.closePanel(),ke(s._isOpen=!1)})("input",function(){Fe(t);let o=w();return ke(o.keepSearchKeyword.set(o.searchKeyword.value||""))}),E(),Ca(),p(4,"mat-autocomplete",11,1),X("optionSelected",function(o){Fe(t);let i=w();return ke(i.optionSelected(o))})("opened",function(){Fe(t);let o=w();return ke(o.searchPanelOpened())})("closed",function(){Fe(t);let o=w();return ke(o.searchPanelClosed())}),pr(6,sf,5,3,"mat-option",12,Jp),E()()}if(e&2){let t=rt(5),r=w();A(),ne("formControl",r.searchKeyword)("matAutocomplete",t),Ma(),A(5),fr(r.suggestList())}}var Ml=(()=>{class e{constructor(){this.menuOpen=hr(!0),this.menuOpenChange=fn(),this.theme=hr("dark"),this.themeChange=fn(),this.searchKeywordChange=fn(),this.selectSuggestItemChange=fn(),this.platformService=d(kt),this.sitePostService=d(Mr),this.isServer=this.platformService.isServer,this.isSmallScreen=this.platformService.isSmallScreen,this.searchKeyword=new Pr(""),this.keepSearchKeyword=ae(""),this.suggestList$=pa([this.sitePostService.postsMetaWithSlugAndSortDesc$,this.searchKeyword.valueChanges.pipe(ar(300),fa())]).pipe(yt(([t,r])=>sr(()=>import("./chunk-KNFW47AJ.js").then(o=>o.searchPosts)).pipe(Ee(o=>o(t,r||""))))),this.suggestList=Cr(this.suggestList$)}toggleMenu(){this.menuOpenChange.emit(!this.menuOpen()),H.api.pushEvent("menu-toggle",{menuOpen:this.menuOpen()?"N":"Y",theme:this.theme()==="light"?"dark":"light"})}toggleTheme(){this.themeChange.emit(this.theme()==="light"?"dark":"light"),H.api.pushEvent("theme-toggle",{theme:this.theme()==="light"?"dark":"light"})}optionSelected(t){H.api.pushEvent("suggest-item-selected",{keyword:this.keepSearchKeyword(),link:t.option.value.link,type:t.option.value.type,title:t.option.value.text}),this.selectSuggestItemChange.emit(t.option.value.link),this.searchKeyword.setValue("")}searchPanelOpened(){this.originalView=H.api.getView()?.name,H.api.setView({name:"search-panel"}),H.api.pushEvent("search-panel-opened",{});let{trace:t,context:r}=H.api.getOTEL()??{trace:null,context:null};if(!t||!r)return;let i=t.getTracer("Toolbar").startSpan("Open Search Panel");this.span=i}searchPanelClosed(){H.api.setView({name:this.originalView??""}),H.api.pushEvent("search-panel-closed",{}),this.span&&(this.span.setAttribute("search-keyword",this.keepSearchKeyword()),this.span.end(),this.span=void 0)}goHome(){H.api.pushEvent("go-home")}static{this.\u0275fac=function(r){return new(r||e)}}static{this.\u0275cmp=V({type:e,selectors:[["app-layout-toolbar"]],inputs:{menuOpen:[1,"menuOpen"],theme:[1,"theme"]},outputs:{menuOpenChange:"menuOpenChange",themeChange:"themeChange",searchKeywordChange:"searchKeywordChange",selectSuggestItemChange:"selectSuggestItemChange"},decls:11,vars:4,consts:[["input","","trigger","matAutocompleteTrigger"],["auto","matAutocomplete"],["color","primary","xmlns","http://www.w3.org/1999/html",1,"toolbar","mat-elevation-z6","fixed","z-10"],["role","button","aria-label","\u6253\u958B/\u6536\u5408\u9078\u55AE","mat-icon-button","",3,"click"],["routerLink","/",1,"header-link","no-underline","text-[color:var(--header-link-color)]","hover:text-[color:var(--header-link-color)]","hover:no-underline","active:text-[color:var(--header-link-color)]",3,"click"],[1,"header-link","text-2xl"],[1,"grow"],["role","button","aria-label","\u6DF1\u8272/\u4EAE\u8272\u6A21\u5F0F","mat-icon-button","",1,"mr-2"],[1,"search-bar"],["role","button","aria-label","\u6DF1\u8272/\u4EAE\u8272\u6A21\u5F0F","mat-icon-button","",1,"mr-2",3,"click"],["autocomplete","off","type","text","matInput","","accesskey","/","placeholder","\u641C\u5C0B... ( Alt + / )",1,"search-input","h-9","rounded-md","w-60","text-[16px]","border-0","p-2","hidden","md:block",3,"keyup.enter","input","formControl","matAutocomplete"],["panelWidth","auto",3,"optionSelected","opened","closed"],[3,"value"],[1,"suggest-item-type"],[1,"suggest-item-text"]],template:function(r,o){r&1&&(p(0,"mat-toolbar",2)(1,"button",3),X("click",function(){return o.toggleMenu()}),b(2,ef,2,0,"mat-icon"),b(3,tf,2,0,"mat-icon"),E(),p(4,"h1")(5,"a",4),X("click",function(){return o.goHome()}),p(6,"span",5),L(7,"\u5168\u7AEF\u958B\u767C\u4EBA\u54E1\u5929\u68AF"),E()()(),G(8,"div",6),b(9,of,3,1,"button",7),b(10,af,8,2,"div",8),E()),r&2&&(A(2),N(o.menuOpen()?2:-1),A(),N(o.menuOpen()?-1:3),A(6),N(o.isServer?-1:9),A(),N(o.isSmallScreen()?-1:10))},dependencies:[Rr,wc,Mc,Lc,yc,Ec,fc,xr,Or,Cl,Nl,gl,Al,vr,Ci,sc,ic],encapsulation:2})}}return e})();var cf=["matDrawerContent"];function lf(e,n){e&1&&G(0,"mat-progress-bar",2)}var vl=(()=>{class e{constructor(){this.matDrawerContent=mt("matDrawerContent"),this.destroyRef=d(_n),this.router=d(gr),this.platformService=d(kt),this.menuOpen=ae(!0),this.theme=ae("dark"),this.isSmallScreen=this.platformService.isSmallScreen,this.searchKeyword=new Pr(""),this.pageLoading=Cr(this.router.events.pipe(W(t=>t instanceof Vt||t instanceof Ar),Ee(t=>t instanceof Vt))),this.themeEffect=Ze(()=>{this.platformService.isServer||(localStorage.setItem("theme",this.theme()||""),document.body.classList.remove("dark-theme"),document.body.classList.remove("light-theme"),document.body.classList.add(`${this.theme()}-theme`))}),this.smallScreenEffect=Ze(()=>{this.platformService.isServer||this.isSmallScreen()&&this.menuOpen.set(!1)})}get isServer(){return this.platformService.isServer}ngOnInit(){this.router.events.pipe(W(t=>t instanceof Vt),Tn(this.destroyRef)).subscribe(()=>{let t=this.matDrawerContent();t&&t.scrollTo({top:0,left:0})}),this.setTheme()}async selectSuggestItem(t){await this.router.navigateByUrl(t)}async goSearchPage(t){t&&await this.router.navigate(["query"],{queryParams:{q:t}})}setTheme(){if(this.platformService.isServer)return;let t=localStorage.getItem("theme");t?this.theme.set(t):window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches&&this.theme.set("light")}static{this.\u0275fac=function(r){return new(r||e)}}static{this.\u0275cmp=V({type:e,selectors:[["app-layout"]],viewQuery:function(r,o){r&1&&Er(o.matDrawerContent,cf,5),r&2&&pn()},decls:8,vars:10,consts:[["matDrawerContent",""],[3,"menuOpenChange","themeChange","selectSuggestItemChange","searchKeywordChange","menuOpen","theme"],["mode","indeterminate","color","accent",1,"!fixed","top-0","z-50"],[1,"drawer-container","top-16","h-[calc(100vh","-","64px)]"],[1,"sidebar","min-w-[240px]","max-w-[240px]",3,"closed","mode","disableClose","opened"],[1,"main-content"]],template:function(r,o){r&1&&(p(0,"app-layout-toolbar",1),X("menuOpenChange",function(s){return o.menuOpen.set(s)})("themeChange",function(s){return o.theme.set(s)})("selectSuggestItemChange",function(s){return o.selectSuggestItem(s)})("searchKeywordChange",function(s){return o.goSearchPage(s)}),E(),b(1,lf,1,0,"mat-progress-bar",2),p(2,"mat-drawer-container",3)(3,"mat-drawer",4),X("closed",function(){return o.menuOpen.set(!1)}),G(4,"app-layout-sidebar"),E(),p(5,"mat-drawer-content",5,0),G(7,"router-outlet"),E()()),r&2&&(ne("menuOpen",o.menuOpen())("theme",o.theme()),A(),N(o.pageLoading()?1:-1),A(2),B("server-sidebar",o.isServer),ne("mode",o.isSmallScreen()?"over":"side")("disableClose",!o.isSmallScreen())("opened",o.menuOpen()),A(2),B("server",o.isServer))},dependencies:[el,Jc,rl,Ai,gi,Sn,Ka,Ml,ol],styles:[".drawer-container[_ngcontent-%COMP%]{height:calc(100vh - 64px)}  .mat-drawer-inner-container::-webkit-scrollbar{height:4px;width:4px}  .mat-drawer-inner-container::-webkit-scrollbar-thumb{background:#00000042}@media(max-width:959.98px){.sidebar[_ngcontent-%COMP%]{min-width:320px;max-width:320px}.sidebar.server-sidebar[_ngcontent-%COMP%]{display:none}}.main-content.server[_ngcontent-%COMP%]{margin-left:240px}@media(max-width:959.98px){.main-content.server[_ngcontent-%COMP%]{margin-left:0!important}}"]})}}return e})();var Pl=(()=>{class e{constructor(){this.destroyRef=d(_n),this.router=d(gr),this.platformService=d(kt),this.siteMetaService=d(Tc)}ngOnInit(){this.router.events.pipe(W(t=>t instanceof Vt),Tn(this.destroyRef)).subscribe(()=>{this.siteMetaService.resetMeta({title:"",description:"\u500B\u4EBA\u5B78\u7FD2\u7A0B\u5F0F\u8A2D\u8A08\u3001\u7CFB\u7D71\u958B\u767C\u548C\u8B80\u66F8\u7684\u7D93\u9A57\u53CA\u5FC3\u5F97\u3002",keywords:[],type:"website"})}),this.router.events.pipe(W(t=>t instanceof Ar),Be(null),lr(),Tn(this.destroyRef)).subscribe(t=>{if(!this.platformService.isServer&&pc.production){let r=t[1];if(!r)return;H.api&&(H.api.pushEvent("page_change",{url:r.url}),H.api.setPage({id:r.url,url:r.url}),H.api.setView({name:r.url})),gtag("event","page_view",{page_path:r.url||""})}})}static{this.\u0275fac=function(r){return new(r||e)}}static{this.\u0275cmp=V({type:e,selectors:[["app-root"]],decls:1,vars:0,template:function(r,o){r&1&&G(0,"app-layout")},dependencies:[vl],encapsulation:2})}}return e})();g();g();var Sd=Ae("OpenTelemetry SDK Context Key SUPPRESS_TRACING");function es(e){return e.setValue(Sd,!0)}function St(e){return e.getValue(Sd)===!0}var Jr="baggage";g();function gd(e){return e.reduce((n,t)=>{let r=`${n}${n!==""?",":""}${t}`;return r.length>8192?n:r},"")}function Rd(e){return e.getAllEntries().map(([n,t])=>{let r=`${encodeURIComponent(n)}=${encodeURIComponent(t.value)}`;return t.metadata!==void 0&&(r+=";"+t.metadata.toString()),r})}function vf(e){if(!e)return;let n=e.indexOf(";"),t=n===-1?e:e.substring(0,n),r=t.indexOf("=");if(r<=0)return;let o=t.substring(0,r).trim(),i=t.substring(r+1).trim();if(!o||!i)return;let s,a;try{s=decodeURIComponent(o),a=decodeURIComponent(i)}catch{return}let c;if(n!==-1&&n<e.length-1){let l=e.substring(n+1);c=On(l)}return{key:s,value:a,metadata:c}}function ts(e,n,t,r){let o=0;for(;o<e.length&&t<180;){let i=e.indexOf(",",o),s=i===-1?e.length:i,a=s-o;if(a<=4096){let c=vf(e.substring(o,s));if(c){let l=(t===0?0:1)+a;if(r+l>8192)break;n[c.key]=c.metadata?{value:c.value,metadata:c.metadata}:{value:c.value},t++,r+=l}}if(i===-1)break;o=i+1}return[t,r]}var In=class{inject(n,t,r){let o=F.getBaggage(n);if(!o||St(n))return;let i=Rd(o).filter(a=>a.length<=4096).slice(0,180),s=gd(i);s.length>0&&r.set(t,Jr,s)}extract(n,t,r){let o=r.get(t,Jr);if(!o)return n;let i={},s=0,a=0;if(Array.isArray(o))for(let c=0;c<o.length;c++)[s,a]=ts(o[c],i,s,a);else[s]=ts(o,i,s,a);return s===0?n:F.setBaggage(n,F.createBaggage(i))}fields(){return[Jr]}};g();function it(e){let n={};if(typeof e!="object"||e==null)return n;for(let t in e){if(!Object.prototype.hasOwnProperty.call(e,t))continue;if(!Pf(t)){m.warn(`Invalid attribute key: ${t}`);continue}let r=e[t];if(!eo(r)){m.warn(`Invalid attribute value set for key: ${t}`);continue}Array.isArray(r)?n[t]=r.slice():n[t]=r}return n}function Pf(e){return typeof e=="string"&&e!==""}function eo(e){return e==null?!0:Array.isArray(e)?Lf(e):Od(typeof e)}function Lf(e){let n;for(let t of e){if(t==null)continue;let r=typeof t;if(r!==n){if(!n){if(Od(r)){n=r;continue}return!1}return!1}}return!0}function Od(e){switch(e){case"number":case"boolean":case"string":return!0}return!1}g();function xd(){return e=>{m.error(Df(e))}}function Df(e){return typeof e=="string"?e:JSON.stringify(yf(e))}function yf(e){let n={},t=e;for(;t!==null;)Object.getOwnPropertyNames(t).forEach(r=>{if(n[r])return;let o=t[r];o&&(n[r]=String(o))}),t=Object.getPrototypeOf(t);return n}var If=xd();function Re(e){try{If(e)}catch{}}var bd="2.10.0";ze();var Vd="process.runtime.name";var Yt={[At]:"opentelemetry",[Vd]:"browser",[ht]:lo,[gt]:bd};var je=performance;var Uf=9,Vf=6,Bf=Math.pow(10,Vf),ns=Math.pow(10,Uf);function at(e){let n=e/1e3,t=Math.trunc(n),r=Math.round(e%1e3*Bf);return[t,r]}function rs(e){let n=at(je.timeOrigin),t=at(typeof e=="number"?e:je.now());return po(n,t)}function os(e,n){let t=n[0]-e[0],r=n[1]-e[1];return r<0&&(t-=1,r+=ns),[t,r]}function uo(e){return Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}function mo(e){return uo(e)||typeof e=="number"||e instanceof Date}function po(e,n){let t=[e[0]+n[0],e[1]+n[1]];return t[1]>=ns&&(t[1]-=ns,t[0]+=1),t}var Kt=(function(e){return e[e.SUCCESS=0]="SUCCESS",e[e.FAILED=1]="FAILED",e})(Kt||{});g();var wn=class{_propagators;_fields;constructor(n={}){this._propagators=n.propagators??[];let t=new Set;for(let r of this._propagators){let o=typeof r.fields=="function"?r.fields():[];for(let i of o)t.add(i)}this._fields=Array.from(t)}inject(n,t,r){for(let o of this._propagators)try{o.inject(n,t,r)}catch(i){m.warn(`Failed to inject with ${o.constructor.name}. Err: ${i.message}`)}}extract(n,t,r){return this._propagators.reduce((o,i)=>{try{return i.extract(o,t,r)}catch(s){m.warn(`Failed to extract with ${i.constructor.name}. Err: ${s.message}`)}return o},n)}fields(){return this._fields.slice()}};g();var is="[_0-9a-z-*/]",Ff=`[a-z]${is}{0,255}`,kf=`[a-z0-9]${is}{0,240}@[a-z]${is}{0,13}`,Gf=new RegExp(`^(?:${Ff}|${kf})$`),Hf=/^[ -~]{0,255}[!-~]$/,Yf=/,|=/;function ss(e){return Gf.test(e)}function as(e){return Hf.test(e)&&!Yf.test(e)}var Kf=32,Bd=512,Fd=",",kd="=",fo=class e{_length;_rawTraceState;_internalState;constructor(n){this._rawTraceState=typeof n=="string"?n:"",this._length=this._rawTraceState.length}set(n,t){if(!ss(n)||!as(t))return this;let r=this._getState(),o=r.get(n),i=this._length;if(typeof o=="string"?i+=t.length-o.length:i+=n.length+t.length+(r.size>0?2:1),i>Bd)return this;let s=new Map(r);return s.delete(n),s.set(n,t),this._fromState(s,i)}unset(n){let t=this._getState(),r=t.get(n);if(typeof r!="string")return this;let o=this._length-(n.length+r.length+1);t.size>1&&(o=o-1);let i=new Map(t);return i.delete(n),this._fromState(i,o)}get(n){return this._getState().get(n)}serialize(){let n="",t=0;for(let r of this._getState())t>0&&(n=Fd+n),n=`${r[0]}${kd}${r[1]}`+n,t++;return n}_getState(){if(this._internalState)return this._internalState;let n=this._rawTraceState.split(Fd),t=new Map,r=0;for(let o of n){let i=o.trim(),s=i.indexOf(kd);if(s===-1)continue;let a=i.slice(0,s),c=i.slice(s+1);if(!ss(a)||!as(c))continue;let l=r+i.length+(t.size>0?1:0);if(!(l>Bd)&&(t.set(a,c),r=l,t.size>=Kf))break}return this._length=r,this._internalState=new Map(Array.from(t.entries()).reverse()),this._internalState}_fromState(n,t){let r=Object.create(e.prototype);return r._internalState=n,r._length=t,r}};var Eo="traceparent",To="tracestate",zf="00",jf="(?!ff)[\\da-f]{2}",Wf="(?![0]{32})[\\da-f]{32}",qf="(?![0]{16})[\\da-f]{16}",Xf="[\\da-f]{2}",$f=new RegExp(`^\\s?(${jf})-(${Wf})-(${qf})-(${Xf})(-.*)?\\s?$`);function Gd(e){let n=$f.exec(e);return!n||n[1]==="00"&&n[5]?null:{traceId:n[2],spanId:n[3],traceFlags:parseInt(n[4],16)}}var Rt=class{inject(n,t,r){let o=x.getSpanContext(n);if(!o||St(n)||!ge(o))return;let i=`${zf}-${o.traceId}-${o.spanId}-0${Number(o.traceFlags||Q.NONE).toString(16)}`;r.set(t,Eo,i),o.traceState&&r.set(t,To,o.traceState.serialize())}extract(n,t,r){let o=r.get(t,Eo);if(!o)return n;let i=Array.isArray(o)?o[0]:o;if(typeof i!="string")return n;let s=Gd(i);if(!s)return n;s.isRemote=!0;let a=r.get(t,To);if(a){let c=Array.isArray(a)?a.join(","):a;s.traceState=new fo(typeof c=="string"?c:void 0)}return x.setSpanContext(n,s)}fields(){return[Eo,To]}};var Qf="[object Object]",Zf="[object Null]",Jf="[object Undefined]",eE=Function.prototype,Hd=eE.toString,tE=Hd.call(Object),nE=Object.getPrototypeOf,Yd=Object.prototype,Kd=Yd.hasOwnProperty,Ot=Symbol?Symbol.toStringTag:void 0,zd=Yd.toString;function cs(e){if(!rE(e)||oE(e)!==Qf)return!1;let n=nE(e);if(n===null)return!0;let t=Kd.call(n,"constructor")&&n.constructor;return typeof t=="function"&&t instanceof t&&Hd.call(t)===tE}function rE(e){return e!=null&&typeof e=="object"}function oE(e){return e==null?e===void 0?Jf:Zf:Ot&&Ot in Object(e)?iE(e):sE(e)}function iE(e){let n=Kd.call(e,Ot),t=e[Ot],r=!1;try{e[Ot]=void 0,r=!0}catch{}let o=zd.call(e);return r&&(n?e[Ot]=t:delete e[Ot]),o}function sE(e){return zd.call(e)}var aE=20;function ds(...e){let n=e.shift(),t=new WeakMap;for(;e.length>0;)n=Wd(n,e.shift(),0,t);return n}function ls(e){return ho(e)?e.slice():e}function Wd(e,n,t=0,r){let o;if(!(t>aE)){if(t++,So(e)||So(n)||qd(n))o=ls(n);else if(ho(e)){if(o=e.slice(),ho(n))for(let i=0,s=n.length;i<s;i++)o.push(ls(n[i]));else if(Un(n)){let i=Object.keys(n);for(let s=0,a=i.length;s<a;s++){let c=i[s];c==="__proto__"||c==="constructor"||c==="prototype"||(o[c]=ls(n[c]))}}}else if(Un(e))if(Un(n)){if(!cE(e,n))return n;o=Object.assign({},e);let i=Object.keys(n);for(let s=0,a=i.length;s<a;s++){let c=i[s];if(c==="__proto__"||c==="constructor"||c==="prototype")continue;let l=n[c];if(So(l))typeof l>"u"?delete o[c]:o[c]=l;else{let _=o[c],f=l;if(jd(e,c,r)||jd(n,c,r))delete o[c];else{if(Un(_)&&Un(f)){let S=r.get(_)||[],T=r.get(f)||[];S.push({obj:e,key:c}),T.push({obj:n,key:c}),r.set(_,S),r.set(f,T)}o[c]=Wd(o[c],l,t,r)}}}}else o=n;return o}}function jd(e,n,t){let r=t.get(e[n])||[];for(let o=0,i=r.length;o<i;o++){let s=r[o];if(s.key===n&&s.obj===e)return!0}return!1}function ho(e){return Array.isArray(e)}function qd(e){return typeof e=="function"}function Un(e){return!So(e)&&!ho(e)&&!qd(e)&&typeof e=="object"}function So(e){return typeof e=="string"||typeof e=="number"||typeof e=="boolean"||typeof e>"u"||e instanceof Date||e instanceof RegExp||e===null}function cE(e,n){return!(!cs(e)||!cs(n))}var Ao=class{_promise;_resolve;_reject;constructor(){this._promise=new Promise((n,t)=>{this._resolve=n,this._reject=t})}get promise(){return this._promise}resolve(n){this._resolve(n)}reject(n){this._reject(n)}};var Vn=class{_isCalled=!1;_deferred=new Ao;_callback;_that;constructor(n,t){this._callback=n,this._that=t}get isCalled(){return this._isCalled}get promise(){return this._deferred.promise}call(...n){if(!this._isCalled){this._isCalled=!0;try{Promise.resolve(this._callback.call(this._that,...n)).then(t=>this._deferred.resolve(t),t=>this._deferred.reject(t))}catch(t){this._deferred.reject(t)}}return this._deferred.promise}};var Nu=_i(Ru());var xu=_i(Ou());var tT="duration_ns";function bu(e=[]){var n,t;for(let r of e){let{scopeSpans:o}=r;for(let i of o){let{scope:s,spans:a=[]}=i;for(let c of a){if(c.kind!==xu.ESpanKind.SPAN_KIND_CLIENT)continue;let l={traceId:c.traceId.toString(),spanId:c.spanId.toString()},_={};for(let T of c.attributes)_[T.key]=String(Object.values(T.value)[0]);!Number.isNaN(c.endTimeUnixNano)&&!Number.isNaN(c.startTimeUnixNano)&&(_[tT]=String(Number(c.endTimeUnixNano)-Number(c.startTimeUnixNano)));let f=((n=s?.name)!==null&&n!==void 0?n:"").indexOf("-"),S=jc;s?.name&&(f===-1&&(S=(t=s.name.split("/")[1])!==null&&t!==void 0?t:s.name),f>-1&&(S=s?.name.substring(f+1))),H.api.pushEvent(`faro.tracing.${S}`,_,void 0,{spanContext:l,timestampOverwriteMs:Number(c.endTimeUnixNano)/1e6,customPayloadTransformer:T=>{var h,R;return _["faro.action.user.name"]!=null&&_["faro.action.user.parentId"]!=null&&(T.action={name:_["faro.action.user.name"],parentId:_["faro.action.user.parentId"]},(h=T.attributes)===null||h===void 0||delete h["faro.action.user.name"],(R=T.attributes)===null||R===void 0||delete R["faro.action.user.parentId"]),T}})}}}}var Vo=class{constructor(n){this.config=n}export(n,t){let r=(0,Nu.createExportTraceServiceRequest)(n,{useHex:!0,useLongBits:!1});this.config.api.pushTraces(r),bu(r.resourceSpans),t({code:Kt.SUCCESS})}shutdown(){return Promise.resolve(void 0)}};var Cu="session.id",Mu="deployment.environment.name",vu="service.namespace",Pu="process.runtime.name",Lu="process.runtime.version",Du="telemetry.distro.name",yu="telemetry.distro.version",Iu="browser.brands",wu="browser.language",Uu="browser.mobile",Vu="browser.platform";g();g();var Kn=class{emit(n){}},Bu=new Kn;var ks=class{getLogger(n,t,r){return new Kn}},Bo=new ks;var Fo=class{constructor(n,t,r,o){this._provider=n,this.name=t,this.version=r,this.options=o}emit(n){this._getLogger().emit(n)}_getLogger(){if(this._delegate)return this._delegate;let n=this._provider.getDelegateLogger(this.name,this.version,this.options);return n?(this._delegate=n,this._delegate):Bu}};var zn=class{getLogger(n,t,r){var o;return(o=this.getDelegateLogger(n,t,r))!==null&&o!==void 0?o:new Fo(this,n,t,r)}getDelegate(){var n;return(n=this._delegate)!==null&&n!==void 0?n:Bo}setDelegate(n){this._delegate=n}getDelegateLogger(n,t,r){var o;return(o=this._delegate)===null||o===void 0?void 0:o.getLogger(n,t,r)}};var Gs=typeof globalThis=="object"?globalThis:typeof self=="object"?self:typeof window=="object"?window:typeof global=="object"?global:{};var jn=Symbol.for("io.opentelemetry.js.api.logs"),qt=Gs;function Fu(e,n,t){return r=>r===e?n:t}var Hs=1;var ko=class e{constructor(){this._proxyLoggerProvider=new zn}static getInstance(){return this._instance||(this._instance=new e),this._instance}setGlobalLoggerProvider(n){return qt[jn]?this.getLoggerProvider():(qt[jn]=Fu(Hs,n,Bo),this._proxyLoggerProvider.setDelegate(n),n)}getLoggerProvider(){var n,t;return(t=(n=qt[jn])===null||n===void 0?void 0:n.call(qt,Hs))!==null&&t!==void 0?t:this._proxyLoggerProvider}getLogger(n,t,r){return this.getLoggerProvider().getLogger(n,t,r)}disable(){delete qt[jn],this._proxyLoggerProvider=new zn}};var Go=ko.getInstance();function ku(e,n,t,r){for(let o=0,i=e.length;o<i;o++){let s=e[o];n&&s.setTracerProvider(n),t&&s.setMeterProvider(t),r&&s.setLoggerProvider&&s.setLoggerProvider(r),s.getConfig().enabled||s.enable()}}function Gu(e){e.forEach(n=>n.disable())}function Ys(e){let n=e.tracerProvider||x.getTracerProvider(),t=e.meterProvider||Dn.getMeterProvider(),r=e.loggerProvider||Go.getLoggerProvider(),o=e.instrumentations?.flat()??[];return ku(o,n,t,r),()=>{Gu(o)}}g();var J=console.error.bind(console);function Wn(e,n,t){let r=!!e[n]&&Object.prototype.propertyIsEnumerable.call(e,n);Object.defineProperty(e,n,{configurable:!0,enumerable:r,writable:!0,value:t})}var Ho=(e,n,t)=>{if(!e||!e[n]){J("no original function "+String(n)+" to wrap");return}if(!t){J("no wrapper function"),J(new Error().stack);return}let r=e[n];if(typeof r!="function"||typeof t!="function"){J("original object and wrapper must be functions");return}let o=t(r,n);return Wn(o,"__original",r),Wn(o,"__unwrap",()=>{e[n]===o&&Wn(e,n,r)}),Wn(o,"__wrapped",!0),Wn(e,n,o),o},Ks=(e,n,t)=>{if(e)Array.isArray(e)||(e=[e]);else{J("must provide one or more modules to patch"),J(new Error().stack);return}if(!(n&&Array.isArray(n))){J("must provide one or more functions to wrap on modules");return}e.forEach(r=>{n.forEach(o=>{Ho(r,o,t)})})},Yo=(e,n)=>{if(!e||!e[n]){J("no function to unwrap."),J(new Error().stack);return}let t=e[n];if(!t.__unwrap)J("no original to unwrap to -- has "+String(n)+" already been unwrapped?");else{t.__unwrap();return}},zs=(e,n)=>{if(e)Array.isArray(e)||(e=[e]);else{J("must provide one or more modules to patch"),J(new Error().stack);return}if(!(n&&Array.isArray(n))){J("must provide one or more functions to unwrap on modules");return}e.forEach(t=>{n.forEach(r=>{Yo(t,r)})})};function qn(e){e&&e.logger&&(typeof e.logger!="function"?J("new logger isn't a function, not replacing"):J=e.logger)}qn.wrap=Ho;qn.massWrap=Ks;qn.unwrap=Yo;qn.massUnwrap=zs;var Ko=class{instrumentationName;instrumentationVersion;_config={};_tracer;_meter;_logger;_diag;constructor(n,t,r){this.instrumentationName=n,this.instrumentationVersion=t,this.setConfig(r),this._diag=m.createComponentLogger({namespace:n}),this._tracer=x.getTracer(n,t),this._meter=Dn.getMeter(n,t),this._logger=Go.getLogger(n,t),this._updateMetricInstruments()}_wrap=Ho;_unwrap=Yo;_massWrap=Ks;_massUnwrap=zs;get meter(){return this._meter}setMeterProvider(n){this._meter=n.getMeter(this.instrumentationName,this.instrumentationVersion),this._updateMetricInstruments()}get logger(){return this._logger}setLoggerProvider(n){this._logger=n.getLogger(this.instrumentationName,this.instrumentationVersion)}getModuleDefinitions(){let n=this.init()??[];return Array.isArray(n)?n:[n]}_updateMetricInstruments(){}getConfig(){return this._config}setConfig(n){this._config=xe({enabled:!0},n)}setTracerProvider(n){this._tracer=n.getTracer(this.instrumentationName,this.instrumentationVersion)}get tracer(){return this._tracer}_runSpanCustomizationHook(n,t,r,o){if(n)try{n(r,o)}catch(i){this._diag.error("Error running span customization hook due to exception in handler",{triggerName:t},i)}}};var lt=class extends Ko{constructor(n,t,r){super(n,t,r),this._config.enabled&&this.enable()}};function Xt(e,n,t){let r,o;try{o=e()}catch(i){r=i}finally{if(n(r,o),r&&!t)throw r;return o}}function $t(e){return typeof e=="function"&&typeof e.__original=="function"&&typeof e.__unwrap=="function"&&e.__wrapped===!0}var D=(function(e){return e[e.STABLE=1]="STABLE",e[e.OLD=2]="OLD",e[e.DUPLICATE=3]="DUPLICATE",e})(D||{});function Xn(e,n){let t=D.OLD,r=n?.split(",").map(o=>o.trim()).filter(o=>o!=="");for(let o of r??[])if(o.toLowerCase()===e+"/dup"){t=D.DUPLICATE;break}else o.toLowerCase()===e&&(t=D.STABLE);return t}var Qt=typeof globalThis=="object"?globalThis:typeof self=="object"?self:typeof window=="object"?window:typeof global=="object"?global:{};var Zt=performance;var rT=9,oT=6,iT=Math.pow(10,oT),js=Math.pow(10,rT);function Nt(e){let n=e/1e3,t=Math.trunc(n),r=Math.round(e%1e3*iT);return[t,r]}function Ws(){let e=Zt.timeOrigin;if(typeof e!="number"){let n=Zt;e=n.timing&&n.timing.fetchStart}return e}function $n(e){let n=Nt(Ws()),t=Nt(typeof e=="number"?e:Zt.now());return Yu(n,t)}function Ct(e){if(Hu(e))return e;if(typeof e=="number")return e<Ws()?$n(e):Nt(e);if(e instanceof Date)return Nt(e.getTime());throw TypeError("Invalid input type")}function Ie(e){return e[0]*js+e[1]}function Hu(e){return Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}function Yu(e,n){let t=[e[0]+n[0],e[1]+n[1]];return t[1]>=js&&(t[1]-=js,t[0]+=1),t}function zo(e,n){return typeof n=="string"?e===n:!!e.match(n)}function qs(e,n){if(!n)return!1;for(let t of n)if(zo(e,t))return!0;return!1}var C=(function(e){return e.CONNECT_END="connectEnd",e.CONNECT_START="connectStart",e.DECODED_BODY_SIZE="decodedBodySize",e.DOM_COMPLETE="domComplete",e.DOM_CONTENT_LOADED_EVENT_END="domContentLoadedEventEnd",e.DOM_CONTENT_LOADED_EVENT_START="domContentLoadedEventStart",e.DOM_INTERACTIVE="domInteractive",e.DOMAIN_LOOKUP_END="domainLookupEnd",e.DOMAIN_LOOKUP_START="domainLookupStart",e.ENCODED_BODY_SIZE="encodedBodySize",e.FETCH_START="fetchStart",e.LOAD_EVENT_END="loadEventEnd",e.LOAD_EVENT_START="loadEventStart",e.NAVIGATION_START="navigationStart",e.REDIRECT_END="redirectEnd",e.REDIRECT_START="redirectStart",e.REQUEST_START="requestStart",e.RESPONSE_END="responseEnd",e.RESPONSE_START="responseStart",e.SECURE_CONNECTION_START="secureConnectionStart",e.START_TIME="startTime",e.UNLOAD_EVENT_END="unloadEventEnd",e.UNLOAD_EVENT_START="unloadEventStart",e})(C||{});var Ku="http.response_content_length",zu="http.response_content_length_uncompressed";var Xs;function aT(){return Xs||(Xs=document.createElement("a")),Xs}function ju(e,n){return n in e}function we(e,n,t,r=!0){if(ju(t,n)&&typeof t[n]=="number"&&!(r&&t[n]===0))return e.addEvent(n,t[n])}function jo(e,n,t=!1,r,o){if(r===void 0&&(r=n[C.START_TIME]!==0),t||(we(e,C.FETCH_START,n,r),we(e,C.DOMAIN_LOOKUP_START,n,r),we(e,C.DOMAIN_LOOKUP_END,n,r),we(e,C.CONNECT_START,n,r),we(e,C.SECURE_CONNECTION_START,n,r),we(e,C.CONNECT_END,n,r),we(e,C.REQUEST_START,n,r),we(e,C.RESPONSE_START,n,r),we(e,C.RESPONSE_END,n,r)),!o){let i=n[C.ENCODED_BODY_SIZE];i!==void 0&&e.setAttribute(Ku,i);let s=n[C.DECODED_BODY_SIZE];s!==void 0&&i!==s&&e.setAttribute(zu,s)}}function Wu(e){return e.slice().sort((n,t)=>{let r=n[C.FETCH_START],o=t[C.FETCH_START];return r>o?1:r<o?-1:0})}function qu(){return typeof location<"u"?location.origin:void 0}function $s(e,n,t,r,o=new WeakSet,i){let s=Jt(e);e=s.toString();let a=lT(e,n,t,r,o,i);if(a.length===0)return{mainRequest:void 0};if(a.length===1)return{mainRequest:a[0]};let c=Wu(a);if(s.origin!==qu()&&c.length>1){let l=c[0],_=cT(c,l[C.RESPONSE_END],t),f=l[C.RESPONSE_END];return _[C.FETCH_START]<f&&(_=l,l=void 0),{corsPreFlightRequest:l,mainRequest:_}}else return{mainRequest:a[0]}}function cT(e,n,t){let r=Ie(t),o=Ie(Ct(n)),i=e[1],s,a=e.length;for(let c=1;c<a;c++){let l=e[c],_=Ie(Ct(l[C.FETCH_START])),f=Ie(Ct(l[C.RESPONSE_END])),S=r-f;_>=o&&(!s||S<s)&&(s=S,i=l)}return i}function lT(e,n,t,r,o,i){let s=Ie(n),a=Ie(t),c=r.filter(l=>{let _=Ie(Ct(l[C.FETCH_START])),f=Ie(Ct(l[C.RESPONSE_END]));return l.initiatorType.toLowerCase()===(i||"xmlhttprequest")&&l.name===e&&_>=s&&f<=a});return c.length>0&&(c=c.filter(l=>!o.has(l))),c}function Jt(e){if(typeof URL=="function")return new URL(e,typeof document<"u"?document.baseURI:typeof location<"u"?location.href:void 0);let n=aT();return n.href=e,n}function Qs(e,n){let t=n||[];return(typeof t=="string"||t instanceof RegExp)&&(t=[t]),Jt(e).origin===qu()?!0:t.some(o=>zo(e,o))}var Wo=(function(e){return e.COMPONENT="component",e.HTTP_STATUS_TEXT="http.status_text",e})(Wo||{});var Z=_i(Xu());ze();g();var $u=m.createComponentLogger({namespace:"@opentelemetry/opentelemetry-instrumentation-fetch/utils"});function Qu(...e){if(e[0]instanceof URL||typeof e[0]=="string"){let n=e[1];if(!n?.body)return Promise.resolve();if(n.body instanceof ReadableStream){let{body:t,length:r}=_T(n.body);return n.body=t,r}else return Promise.resolve(mT(n.body))}else{let n=e[0];return n?.body?n.clone().text().then(t=>Zs(t)):Promise.resolve()}}function _T(e){if(!e.pipeThrough)return $u.warn("Platform has ReadableStream but not pipeThrough!"),{body:e,length:Promise.resolve(void 0)};let n=0,t,r=new Promise(i=>{t=i}),o=new TransformStream({start(){},async transform(i,s){let a=await i;n+=a.byteLength,s.enqueue(i)},flush(){t(n)}});return{body:e.pipeThrough(o),length:r}}function uT(e){return typeof Document<"u"&&e instanceof Document}function mT(e){if(uT(e))return new XMLSerializer().serializeToString(document).length;if(typeof e=="string")return Zs(e);if(e instanceof Blob)return e.size;if(e instanceof FormData)return fT(e);if(e instanceof URLSearchParams)return Zs(e.toString());if(e.byteLength!==void 0)return e.byteLength;$u.warn("unknown body type")}var pT=new TextEncoder;function Zs(e){return pT.encode(e).byteLength}function fT(e){let n=0;for(let[t,r]of e.entries())n+=t.length,r instanceof Blob?n+=r.size:n+=r.length;return n}function Zu(e){let n=TT(),t=e.toUpperCase();return t in n?t:"_OTHER"}var ET={CONNECT:!0,DELETE:!0,GET:!0,HEAD:!0,OPTIONS:!0,PATCH:!0,POST:!0,PUT:!0,TRACE:!0},Qn;function TT(){if(Qn===void 0){let e=void 0;e&&e.length>0?(Qn={},e.forEach(n=>{Qn[n]=!0})):Qn=ET}return Qn}var ST={"https:":"443","http:":"80"};function Ju(e){let n=Number(e.port||ST[e.protocol]);if(n&&!isNaN(n))return n}var Js="0.202.0";var hT=300,em=typeof process=="object"&&process.release?.name==="node",Zn=class extends lt{component="fetch";version=Js;moduleName=this.component;_usedResources=new WeakSet;_tasksCount=0;_semconvStability;constructor(n={}){super("@opentelemetry/instrumentation-fetch",Js,n),this._semconvStability=Xn("http",n?.semconvStabilityOptIn)}init(){}_addChildSpan(n,t){let r=this.tracer.startSpan("CORS Preflight",{startTime:t[C.FETCH_START]},x.setSpan(O.active(),n)),o=!(this._semconvStability&D.OLD);jo(r,t,this.getConfig().ignoreNetworkEvents,void 0,o),r.end(t[C.RESPONSE_END])}_addFinalSpanAttributes(n,t){let r=Jt(t.url);if(this._semconvStability&D.OLD&&(n.setAttribute(Z.ATTR_HTTP_STATUS_CODE,t.status),t.statusText!=null&&n.setAttribute(Wo.HTTP_STATUS_TEXT,t.statusText),n.setAttribute(Z.ATTR_HTTP_HOST,r.host),n.setAttribute(Z.ATTR_HTTP_SCHEME,r.protocol.replace(":","")),typeof navigator<"u"&&n.setAttribute(Z.ATTR_HTTP_USER_AGENT,navigator.userAgent)),this._semconvStability&D.STABLE){n.setAttribute(io,t.status),n.setAttribute(so,r.hostname);let o=Ju(r);o&&n.setAttribute(ao,o)}}_addHeaders(n,t){if(!Qs(t,this.getConfig().propagateTraceHeaderCorsUrls)){let r={};F.inject(O.active(),r),Object.keys(r).length>0&&this._diag.debug("headers inject skipped due to CORS policy");return}if(n instanceof Request)F.inject(O.active(),n.headers,{set:(r,o,i)=>r.set(o,typeof i=="string"?i:String(i))});else if(n.headers instanceof Headers)F.inject(O.active(),n.headers,{set:(r,o,i)=>r.set(o,typeof i=="string"?i:String(i))});else if(n.headers instanceof Map)F.inject(O.active(),n.headers,{set:(r,o,i)=>r.set(o,typeof i=="string"?i:String(i))});else{let r={};F.inject(O.active(),r),n.headers=Object.assign({},r,n.headers||{})}}_clearResources(){this._tasksCount===0&&this.getConfig().clearTimingResources&&(performance.clearResourceTimings(),this._usedResources=new WeakSet)}_createSpan(n,t={}){if(qs(n,this.getConfig().ignoreUrls)){this._diag.debug("ignoring span as url matches ignored url");return}let r="",o={};if(this._semconvStability&D.OLD){let i=(t.method||"GET").toUpperCase();r=`HTTP ${i}`,o[Wo.COMPONENT]=this.moduleName,o[Z.ATTR_HTTP_METHOD]=i,o[Z.ATTR_HTTP_URL]=n}if(this._semconvStability&D.STABLE){let i=t.method,s=Zu(t.method||"GET");r||(r=s),o[ro]=s,s!==i&&(o[oo]=i),o[_o]=n}return this.tracer.startSpan(r,{kind:De.CLIENT,attributes:o})}_findResourceAndAddNetworkEvents(n,t,r){let o=t.entries;if(!o.length){if(!performance.getEntriesByType)return;o=performance.getEntriesByType("resource")}let i=$s(t.spanUrl,t.startTime,r,o,this._usedResources,"fetch");if(i.mainRequest){let s=i.mainRequest;this._markResourceAsUsed(s);let a=i.corsPreFlightRequest;a&&(this._addChildSpan(n,a),this._markResourceAsUsed(a));let c=!(this._semconvStability&D.OLD);jo(n,s,this.getConfig().ignoreNetworkEvents,void 0,c)}}_markResourceAsUsed(n){this._usedResources.add(n)}_endSpan(n,t,r){let o=Nt(Date.now()),i=$n();this._addFinalSpanAttributes(n,r),this._semconvStability&D.STABLE&&r.status>=400&&(n.setStatus({code:re.ERROR}),n.setAttribute(st,String(r.status))),setTimeout(()=>{t.observer?.disconnect(),this._findResourceAndAddNetworkEvents(n,t,i),this._tasksCount--,this._clearResources(),n.end(o)},hT)}_patchConstructor(){return n=>{let t=this;return function(...o){let i=this,s=Jt(o[0]instanceof Request?o[0].url:String(o[0])).href,a=o[0]instanceof Request?o[0]:o[1]||{},c=t._createSpan(s,a);if(!c)return n.apply(this,o);let l=t._prepareSpanData(s);t.getConfig().measureRequestSize&&Qu(...o).then(h=>{h&&(t._semconvStability&D.OLD&&c.setAttribute(Z.ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,h),t._semconvStability&D.STABLE&&c.setAttribute(Z.ATTR_HTTP_REQUEST_BODY_SIZE,h))}).catch(h=>{t._diag.warn("getFetchBodyLength",h)});function _(h,R){t._applyAttributesAfterFetch(h,a,R),t._endSpan(h,l,{status:R.status||0,statusText:R.message,url:s})}function f(h,R){t._applyAttributesAfterFetch(h,a,R),R.status>=200&&R.status<400?t._endSpan(h,l,R):t._endSpan(h,l,{status:R.status,statusText:R.statusText,url:s})}function S(h,R,I){try{let li=I.clone().body;if(li){let vt=li.getReader(),ua=()=>{vt.read().then(({done:di})=>{di?f(h,I):ua()},di=>{_(h,di)})};ua()}else f(h,I)}finally{R(I)}}function T(h,R,I){try{_(h,I)}finally{R(I)}}return new Promise((h,R)=>O.with(x.setSpan(O.active(),c),()=>(t._addHeaders(a,s),t._callRequestHook(c,a),t._tasksCount++,n.apply(i,a instanceof Request?[a]:[s,a]).then(S.bind(i,c,h),T.bind(i,c,R)))))}}}_applyAttributesAfterFetch(n,t,r){let o=this.getConfig().applyCustomAttributesOnSpan;o&&Xt(()=>o(n,t,r),i=>{i&&this._diag.error("applyCustomAttributesOnSpan",i)},!0)}_callRequestHook(n,t){let r=this.getConfig().requestHook;r&&Xt(()=>r(n,t),o=>{o&&this._diag.error("requestHook",o)},!0)}_prepareSpanData(n){let t=$n(),r=[];if(typeof PerformanceObserver!="function")return{entries:r,startTime:t,spanUrl:n};let o=new PerformanceObserver(i=>{i.getEntries().forEach(a=>{a.initiatorType==="fetch"&&a.name===n&&r.push(a)})});return o.observe({entryTypes:["resource"]}),{entries:r,observer:o,startTime:t,spanUrl:n}}enable(){if(em){this._diag.warn("this instrumentation is intended for web usage only, it does not instrument Node.js's fetch()");return}$t(fetch)&&(this._unwrap(Qt,"fetch"),this._diag.debug("removing previous patch for constructor")),this._wrap(Qt,"fetch",this._patchConstructor())}disable(){em||(this._unwrap(Qt,"fetch"),this._usedResources=new WeakSet)}};g();var We=performance;var AT=9,gT=6,RT=Math.pow(10,gT),ea=Math.pow(10,AT);function Jn(e){let n=e/1e3,t=Math.trunc(n),r=Math.round(e%1e3*RT);return[t,r]}function ta(){let e=We.timeOrigin;if(typeof e!="number"){let n=We;e=n.timing&&n.timing.fetchStart}return e}function er(e){let n=Jn(ta()),t=Jn(typeof e=="number"?e:We.now());return nm(n,t)}function Mt(e){if(tm(e))return e;if(typeof e=="number")return e<ta()?er(e):Jn(e);if(e instanceof Date)return Jn(e.getTime());throw TypeError("Invalid input type")}function Ue(e){return e[0]*ea+e[1]}function tm(e){return Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}function nm(e,n){let t=[e[0]+n[0],e[1]+n[1]];return t[1]>=ea&&(t[1]-=ea,t[0]+=1),t}function qo(e,n){return typeof n=="string"?e===n:!!e.match(n)}function na(e,n){if(!n)return!1;for(let t of n)if(qo(e,t))return!0;return!1}var M=(function(e){return e.CONNECT_END="connectEnd",e.CONNECT_START="connectStart",e.DECODED_BODY_SIZE="decodedBodySize",e.DOM_COMPLETE="domComplete",e.DOM_CONTENT_LOADED_EVENT_END="domContentLoadedEventEnd",e.DOM_CONTENT_LOADED_EVENT_START="domContentLoadedEventStart",e.DOM_INTERACTIVE="domInteractive",e.DOMAIN_LOOKUP_END="domainLookupEnd",e.DOMAIN_LOOKUP_START="domainLookupStart",e.ENCODED_BODY_SIZE="encodedBodySize",e.FETCH_START="fetchStart",e.LOAD_EVENT_END="loadEventEnd",e.LOAD_EVENT_START="loadEventStart",e.NAVIGATION_START="navigationStart",e.REDIRECT_END="redirectEnd",e.REDIRECT_START="redirectStart",e.REQUEST_START="requestStart",e.RESPONSE_END="responseEnd",e.RESPONSE_START="responseStart",e.SECURE_CONNECTION_START="secureConnectionStart",e.START_TIME="startTime",e.UNLOAD_EVENT_END="unloadEventEnd",e.UNLOAD_EVENT_START="unloadEventStart",e})(M||{});var rm="http.response_content_length",om="http.response_content_length_uncompressed";var ra;function OT(){return ra||(ra=document.createElement("a")),ra}function im(e,n){return n in e}function Ve(e,n,t,r=!0){if(im(t,n)&&typeof t[n]=="number"&&!(r&&t[n]===0))return e.addEvent(n,t[n])}function Xo(e,n,t=!1,r,o){if(r===void 0&&(r=n[M.START_TIME]!==0),t||(Ve(e,M.FETCH_START,n,r),Ve(e,M.DOMAIN_LOOKUP_START,n,r),Ve(e,M.DOMAIN_LOOKUP_END,n,r),Ve(e,M.CONNECT_START,n,r),Ve(e,M.SECURE_CONNECTION_START,n,r),Ve(e,M.CONNECT_END,n,r),Ve(e,M.REQUEST_START,n,r),Ve(e,M.RESPONSE_START,n,r),Ve(e,M.RESPONSE_END,n,r)),!o){let i=n[M.ENCODED_BODY_SIZE];i!==void 0&&e.setAttribute(rm,i);let s=n[M.DECODED_BODY_SIZE];s!==void 0&&i!==s&&e.setAttribute(om,s)}}function sm(e){return e.slice().sort((n,t)=>{let r=n[M.FETCH_START],o=t[M.FETCH_START];return r>o?1:r<o?-1:0})}function am(){return typeof location<"u"?location.origin:void 0}function oa(e,n,t,r,o=new WeakSet,i){let s=qe(e);e=s.toString();let a=bT(e,n,t,r,o,i);if(a.length===0)return{mainRequest:void 0};if(a.length===1)return{mainRequest:a[0]};let c=sm(a);if(s.origin!==am()&&c.length>1){let l=c[0],_=xT(c,l[M.RESPONSE_END],t),f=l[M.RESPONSE_END];return _[M.FETCH_START]<f&&(_=l,l=void 0),{corsPreFlightRequest:l,mainRequest:_}}else return{mainRequest:a[0]}}function xT(e,n,t){let r=Ue(t),o=Ue(Mt(n)),i=e[1],s,a=e.length;for(let c=1;c<a;c++){let l=e[c],_=Ue(Mt(l[M.FETCH_START])),f=Ue(Mt(l[M.RESPONSE_END])),S=r-f;_>=o&&(!s||S<s)&&(s=S,i=l)}return i}function bT(e,n,t,r,o,i){let s=Ue(n),a=Ue(t),c=r.filter(l=>{let _=Ue(Mt(l[M.FETCH_START])),f=Ue(Mt(l[M.RESPONSE_END]));return l.initiatorType.toLowerCase()===(i||"xmlhttprequest")&&l.name===e&&_>=s&&f<=a});return c.length>0&&(c=c.filter(l=>!o.has(l))),c}function qe(e){if(typeof URL=="function")return new URL(e,typeof document<"u"?document.baseURI:typeof location<"u"?location.href:void 0);let n=OT();return n.href=e,n}function ia(e,n){let t=n||[];return(typeof t=="string"||t instanceof RegExp)&&(t=[t]),qe(e).origin===am()?!0:t.some(o=>qo(e,o))}ze();var cm="http.host",lm="http.method",dm="http.request.body.size",_m="http.request_content_length_uncompressed";var um="http.scheme",mm="http.status_code",pm="http.url",fm="http.user_agent";var Xe=(function(e){return e.METHOD_OPEN="open",e.METHOD_SEND="send",e.EVENT_ABORT="abort",e.EVENT_ERROR="error",e.EVENT_LOAD="loaded",e.EVENT_TIMEOUT="timeout",e})(Xe||{});g();var NT=m.createComponentLogger({namespace:"@opentelemetry/opentelemetry-instrumentation-xml-http-request/utils"});function CT(e){return typeof Document<"u"&&e instanceof Document}function Tm(e){if(CT(e))return new XMLSerializer().serializeToString(document).length;if(typeof e=="string")return Em(e);if(e instanceof Blob)return e.size;if(e instanceof FormData)return vT(e);if(e instanceof URLSearchParams)return Em(e.toString());if(e.byteLength!==void 0)return e.byteLength;NT.warn("unknown body type")}var MT=new TextEncoder;function Em(e){return MT.encode(e).byteLength}function vT(e){let n=0;for(let[t,r]of e.entries())n+=t.length,r instanceof Blob?n+=r.size:n+=r.length;return n}function Sm(e){let n=LT(),t=e.toUpperCase();return t in n?t:"_OTHER"}var PT={CONNECT:!0,DELETE:!0,GET:!0,HEAD:!0,OPTIONS:!0,PATCH:!0,POST:!0,PUT:!0,TRACE:!0},tr;function LT(){if(tr===void 0){let e=void 0;e&&e.length>0?(tr={},e.forEach(n=>{tr[n]=!0})):tr=PT}return tr}var DT={"https:":"443","http:":"80"};function hm(e){let n=Number(e.port||DT[e.protocol]);if(n&&!isNaN(n))return n}var sa="0.202.0";var aa=(function(e){return e.HTTP_STATUS_TEXT="http.status_text",e})(aa||{});var yT=300,nr=class extends lt{component="xml-http-request";version=sa;moduleName=this.component;_tasksCount=0;_xhrMem=new WeakMap;_usedResources=new WeakSet;_semconvStability;constructor(n={}){super("@opentelemetry/instrumentation-xml-http-request",sa,n),this._semconvStability=Xn("http",n?.semconvStabilityOptIn)}init(){}_addHeaders(n,t){let r=qe(t).href;if(!ia(r,this.getConfig().propagateTraceHeaderCorsUrls)){let i={};F.inject(O.active(),i),Object.keys(i).length>0&&this._diag.debug("headers inject skipped due to CORS policy");return}let o={};F.inject(O.active(),o),Object.keys(o).forEach(i=>{n.setRequestHeader(i,String(o[i]))})}_addChildSpan(n,t){O.with(x.setSpan(O.active(),n),()=>{let r=this.tracer.startSpan("CORS Preflight",{startTime:t[M.FETCH_START]}),o=!(this._semconvStability&D.OLD);Xo(r,t,this.getConfig().ignoreNetworkEvents,void 0,o),r.end(t[M.RESPONSE_END])})}_addFinalSpanAttributes(n,t,r){if(this._semconvStability&D.OLD){if(t.status!==void 0&&n.setAttribute(mm,t.status),t.statusText!==void 0&&n.setAttribute(aa.HTTP_STATUS_TEXT,t.statusText),typeof r=="string"){let o=qe(r);n.setAttribute(cm,o.host),n.setAttribute(um,o.protocol.replace(":",""))}n.setAttribute(fm,navigator.userAgent)}this._semconvStability&D.STABLE&&t.status&&n.setAttribute(io,t.status)}_applyAttributesAfterXHR(n,t){let r=this.getConfig().applyCustomAttributesOnSpan;typeof r=="function"&&Xt(()=>r(n,t),o=>{o&&this._diag.error("applyCustomAttributesOnSpan",o)},!0)}_addResourceObserver(n,t){let r=this._xhrMem.get(n);!r||typeof PerformanceObserver!="function"||typeof PerformanceResourceTiming!="function"||(r.createdResources={observer:new PerformanceObserver(o=>{let i=o.getEntries(),s=qe(t);i.forEach(a=>{a.initiatorType==="xmlhttprequest"&&a.name===s.href&&r.createdResources&&r.createdResources.entries.push(a)})}),entries:[]},r.createdResources.observer.observe({entryTypes:["resource"]}))}_clearResources(){this._tasksCount===0&&this.getConfig().clearTimingResources&&(We.clearResourceTimings(),this._xhrMem=new WeakMap,this._usedResources=new WeakSet)}_findResourceAndAddNetworkEvents(n,t,r,o,i){if(!r||!o||!i||!n.createdResources)return;let s=n.createdResources.entries;(!s||!s.length)&&(s=We.getEntriesByType("resource"));let a=oa(qe(r).href,o,i,s,this._usedResources);if(a.mainRequest){let c=a.mainRequest;this._markResourceAsUsed(c);let l=a.corsPreFlightRequest;l&&(this._addChildSpan(t,l),this._markResourceAsUsed(l));let _=!(this._semconvStability&D.OLD);Xo(t,c,this.getConfig().ignoreNetworkEvents,void 0,_)}}_cleanPreviousSpanInformation(n){let t=this._xhrMem.get(n);if(t){let r=t.callbackToRemoveEvents;r&&r(),this._xhrMem.delete(n)}}_createSpan(n,t,r){if(na(t,this.getConfig().ignoreUrls)){this._diag.debug("ignoring span as url matches ignored url");return}let o="",i=qe(t),s={};if(this._semconvStability&D.OLD&&(o=r.toUpperCase(),s[lm]=r,s[pm]=i.toString()),this._semconvStability&D.STABLE){let c=r,l=Sm(r);o||(o=l),s[ro]=l,l!==c&&(s[oo]=c),s[_o]=i.toString(),s[so]=i.hostname;let _=hm(i);_&&(s[ao]=_)}let a=this.tracer.startSpan(o,{kind:De.CLIENT,attributes:s});return a.addEvent(Xe.METHOD_OPEN),this._cleanPreviousSpanInformation(n),this._xhrMem.set(n,{span:a,spanUrl:t}),a}_markResourceAsUsed(n){this._usedResources.add(n)}_patchOpen(){return n=>{let t=this;return function(...o){let i=o[0],s=o[1];return t._createSpan(this,s,i),n.apply(this,o)}}}_patchSend(){let n=this;function t(l,_,f,S){let T=_.callbackToRemoveEvents;typeof T=="function"&&T();let{span:h,spanUrl:R,sendStartTime:I}=_;h&&(n._findResourceAndAddNetworkEvents(_,h,R,I,f),h.addEvent(l,S),n._addFinalSpanAttributes(h,_,R),h.end(S),n._tasksCount--),n._clearResources()}function r(l,_,f,S){let T=n._xhrMem.get(_);if(!T)return;if(T.status=_.status,T.statusText=_.statusText,n._xhrMem.delete(_),T.span){let I=T.span;n._applyAttributesAfterXHR(I,_),n._semconvStability&D.STABLE&&(f?S&&(I.setStatus({code:re.ERROR,message:S}),I.setAttribute(st,S)):T.status&&T.status>=400&&(I.setStatus({code:re.ERROR}),I.setAttribute(st,String(T.status))))}let h=er(),R=Date.now();setTimeout(()=>{t(l,T,h,R)},yT)}function o(){r(Xe.EVENT_ERROR,this,!0,"error")}function i(){r(Xe.EVENT_ABORT,this,!1)}function s(){r(Xe.EVENT_TIMEOUT,this,!0,"timeout")}function a(){this.status<299?r(Xe.EVENT_LOAD,this,!1):r(Xe.EVENT_ERROR,this,!1)}function c(l){l.removeEventListener("abort",i),l.removeEventListener("error",o),l.removeEventListener("load",a),l.removeEventListener("timeout",s);let _=n._xhrMem.get(l);_&&(_.callbackToRemoveEvents=void 0)}return l=>function(...f){let S=n._xhrMem.get(this);if(!S)return l.apply(this,f);let T=S.span,h=S.spanUrl;if(T&&h){if(n.getConfig().measureRequestSize&&f?.[0]){let R=f[0],I=Tm(R);I!==void 0&&(n._semconvStability&D.OLD&&T.setAttribute(_m,I),n._semconvStability&D.STABLE&&T.setAttribute(dm,I))}O.with(x.setSpan(O.active(),T),()=>{n._tasksCount++,S.sendStartTime=er(),T.addEvent(Xe.METHOD_SEND),this.addEventListener("abort",i),this.addEventListener("error",o),this.addEventListener("load",a),this.addEventListener("timeout",s),S.callbackToRemoveEvents=()=>{c(this),S.createdResources&&S.createdResources.observer.disconnect()},n._addHeaders(this,h),n._addResourceObserver(this,h)})}return l.apply(this,f)}}enable(){this._diag.debug("applying patch to",this.moduleName,this.version),$t(XMLHttpRequest.prototype.open)&&(this._unwrap(XMLHttpRequest.prototype,"open"),this._diag.debug("removing previous patch from method open")),$t(XMLHttpRequest.prototype.send)&&(this._unwrap(XMLHttpRequest.prototype,"send"),this._diag.debug("removing previous patch from method send")),this._wrap(XMLHttpRequest.prototype,"open",this._patchOpen()),this._wrap(XMLHttpRequest.prototype,"send",this._patchSend())}disable(){this._diag.debug("removing patch from",this.moduleName,this.version),this._unwrap(XMLHttpRequest.prototype,"open"),this._unwrap(XMLHttpRequest.prototype,"send"),this._tasksCount=0,this._xhrMem=new WeakMap,this._usedResources=new WeakSet}};var $o=class extends nr{constructor(n={}){super(n);let t=this;this.parentCreateSpan=t._createSpan.bind(this)}_patchOpen(){return n=>{let t=this;return function(...o){try{let i=o[0],s=Wc(o[1]);t.parentCreateSpan(this,s,i)}catch(i){H.internalLogger.error(i)}return n.apply(this,o)}}}};g();function IT(e,n,t){let r=t instanceof Error?0:t.status;Am(e,r)}function wT(e,n){Am(e,n.status)}function Am(e,n){if(n==null)return;let t=n===0,r=n>=400&&n<600;(t||r)&&e.setStatus({code:re.ERROR})}function gm(e){return(n,t,r)=>{IT(n,t,r),e?.(n,t,r)}}function Rm(e){return(n,t)=>{wT(n,t),e?.(n,t)}}var UT=function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(t[r[o]]=e[r[o]]);return t};function Om(e={}){let{fetchInstrumentationOptions:n,xhrInstrumentationOptions:t}=e,r=UT(e,["fetchInstrumentationOptions","xhrInstrumentationOptions"]),o=VT(n,r),i=BT(t,r);return[new Zn(o),new $o(i)]}function VT(e,n){return Object.assign(Object.assign(Object.assign(Object.assign({},n),{ignoreNetworkEvents:!0}),e),{applyCustomAttributesOnSpan:gm(e?.applyCustomAttributesOnSpan)})}function BT(e,n){return Object.assign(Object.assign(Object.assign(Object.assign({},n),{ignoreNetworkEvents:!0}),e),{applyCustomAttributesOnSpan:Rm(e?.applyCustomAttributesOnSpan)})}g();g();ze();var Qo;function xm(){if(Qo===void 0)try{let e=globalThis.process.argv0;Qo=e?`unknown_service:${e}`:"unknown_service"}catch{Qo="unknown_service"}return Qo}var en=e=>e!==null&&typeof e=="object"&&typeof e.then=="function";var ca=class e{_rawAttributes;_asyncAttributesPending=!1;_schemaUrl;_memoizedAttributes;static FromAttributeList(n,t){let r=new e({},t);return r._rawAttributes=bm(n),r._asyncAttributesPending=n.filter(([o,i])=>en(i)).length>0,r}constructor(n,t){let r=n.attributes??{};this._rawAttributes=Object.entries(r).map(([o,i])=>(en(i)&&(this._asyncAttributesPending=!0),[o,i])),this._rawAttributes=bm(this._rawAttributes),this._schemaUrl=FT(t?.schemaUrl)}get asyncAttributesPending(){return this._asyncAttributesPending}async waitForAsyncAttributes(){if(this.asyncAttributesPending){for(let n=0;n<this._rawAttributes.length;n++){let[t,r]=this._rawAttributes[n];this._rawAttributes[n]=[t,en(r)?await r:r]}this._asyncAttributesPending=!1}}get attributes(){if(this.asyncAttributesPending&&m.error("Accessing resource attributes before async attributes settled"),this._memoizedAttributes)return this._memoizedAttributes;let n={};for(let[t,r]of this._rawAttributes){if(en(r)){m.debug(`Unsettled resource attribute ${t} skipped`);continue}r!=null&&(n[t]??=r)}return this._asyncAttributesPending||(this._memoizedAttributes=n),n}getRawAttributes(){return this._rawAttributes}get schemaUrl(){return this._schemaUrl}merge(n){if(n==null)return this;let t=kT(this,n),r=t?{schemaUrl:t}:void 0;return e.FromAttributeList([...n.getRawAttributes(),...this.getRawAttributes()],r)}};function Zo(e,n){return ca.FromAttributeList(Object.entries(e),n)}function rr(){return Zo({[co]:xm(),[ht]:Yt[ht],[At]:Yt[At],[gt]:Yt[gt]})}function bm(e){return e.map(([n,t])=>en(t)?[n,t.catch(r=>{m.debug("promise rejection for resource attribute: %s - %s",n,r)})]:[n,t])}function FT(e){if(typeof e=="string"||e===void 0)return e;m.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.",e)}function kT(e,n){let t=e?.schemaUrl,r=n?.schemaUrl,o=t===void 0||t==="",i=r===void 0||r==="";if(o)return r;if(i||t===r)return t;m.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.',t,r)}g();g();g();g();ze();var Nm="exception";var tn=Symbol.for("nodejs.util.inspect.custom");function nn(e){let n={};for(let[t,r]of e.getRawAttributes())typeof r?.then!="function"&&r!=null&&(n[t]??=r);return n}function rn(e,n,t,r,o){if(typeof t=="number"&&t<0){let s=`[${e}]`;return r?.stylize?r.stylize(s,"special"):s}if(typeof o!="function"||!r)return n;let i=Pt(xe({},r),{depth:r.depth==null?r.depth:r.depth-1});return`${e} ${o(n,i)}`}var Jo=class{_spanContext;kind;parentSpanContext;attributes={};links=[];events=[];startTime;resource;instrumentationScope;_droppedAttributesCount=0;_droppedEventsCount=0;_droppedLinksCount=0;_attributesCount=0;name;status={code:re.UNSET};endTime=[0,0];_ended=!1;_duration=[-1,-1];_spanProcessor;_spanLimits;_attributeValueLengthLimit;_recordEndMetrics;_performanceStartTime;_performanceOffset;_startTimeProvided;constructor(n){let t=Date.now();if(this._spanContext=n.spanContext,this._performanceStartTime=je.now(),this._performanceOffset=t-(this._performanceStartTime+je.timeOrigin),this._startTimeProvided=n.startTime!=null,this._spanLimits=n.spanLimits,this._attributeValueLengthLimit=this._spanLimits.attributeValueLengthLimit??0,this._spanProcessor=n.spanProcessor,this.name=n.name,this.parentSpanContext=n.parentSpanContext,this.kind=n.kind,n.links)for(let r of n.links)this.addLink(r);this.startTime=this._getTime(n.startTime??t),this.resource=n.resource,this.instrumentationScope=n.scope,this._recordEndMetrics=n.recordEndMetrics,n.attributes!=null&&this.setAttributes(n.attributes),this._spanProcessor.onStart(this,n.context)}spanContext(){return this._spanContext}setAttribute(n,t){if(t==null||this._isSpanEnded())return this;if(n.length===0)return m.warn(`Invalid attribute key: ${n}`),this;if(!eo(t))return m.warn(`Invalid attribute value set for key: ${n}`),this;let{attributeCountLimit:r}=this._spanLimits,o=!Object.prototype.hasOwnProperty.call(this.attributes,n);return r!==void 0&&this._attributesCount>=r&&o?(this._droppedAttributesCount++,this):(this.attributes[n]=this._truncateToSize(t),o&&this._attributesCount++,this)}setAttributes(n){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&this.setAttribute(t,n[t]);return this}addEvent(n,t,r){if(this._isSpanEnded())return this;let{eventCountLimit:o}=this._spanLimits;if(o===0)return m.warn("No events allowed."),this._droppedEventsCount++,this;o!==void 0&&this.events.length>=o&&(this._droppedEventsCount===0&&m.debug("Dropping extra events."),this.events.shift(),this._droppedEventsCount++),mo(t)&&(mo(r)||(r=t),t=void 0);let i=it(t),{attributePerEventCountLimit:s}=this._spanLimits,a={},c=0,l=0;for(let _ in i){if(!Object.prototype.hasOwnProperty.call(i,_))continue;let f=i[_];if(s!==void 0&&l>=s){c++;continue}a[_]=this._truncateToSize(f),l++}return this.events.push({name:n,attributes:a,time:this._getTime(r),droppedAttributesCount:c}),this}addLink(n){if(this._isSpanEnded())return this;let{linkCountLimit:t}=this._spanLimits;if(t===0)return this._droppedLinksCount++,this;t!==void 0&&this.links.length>=t&&(this._droppedLinksCount===0&&m.debug("Dropping extra links."),this.links.shift(),this._droppedLinksCount++);let{attributePerLinkCountLimit:r}=this._spanLimits,o=it(n.attributes),i={},s=0,a=0;for(let l in o){if(!Object.prototype.hasOwnProperty.call(o,l))continue;let _=o[l];if(r!==void 0&&a>=r){s++;continue}i[l]=this._truncateToSize(_),a++}let c={context:n.context};return a>0&&(c.attributes=i),s>0&&(c.droppedAttributesCount=s),this.links.push(c),this}addLinks(n){for(let t of n)this.addLink(t);return this}setStatus(n){if(this._isSpanEnded())return this;if(n.code===re.UNSET)return this;if(this.status.code===re.OK)return this;let t={code:n.code};return n.code===re.ERROR&&(typeof n.message=="string"?t.message=n.message:n.message!=null&&m.warn(`Dropping invalid status.message of type '${typeof n.message}', expected 'string'`)),this.status=t,this}updateName(n){return this._isSpanEnded()?this:(this.name=n,this)}end(n){if(this._isSpanEnded()){m.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);return}this.endTime=this._getTime(n),this._duration=os(this.startTime,this.endTime),this._duration[0]<0&&(m.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.",this.startTime,this.endTime),this.endTime=this.startTime.slice(),this._duration=[0,0]),this._droppedEventsCount>0&&m.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`),this._droppedLinksCount>0&&m.warn(`Dropped ${this._droppedLinksCount} links because linkCountLimit reached`),this._spanProcessor.onEnding&&this._spanProcessor.onEnding(this),this._recordEndMetrics?.(),this._ended=!0,this._spanProcessor.onEnd(this)}_getTime(n){if(typeof n=="number"&&n<=je.now())return rs(n+this._performanceOffset);if(typeof n=="number")return at(n);if(n instanceof Date)return at(n.getTime());if(uo(n))return n;if(this._startTimeProvided)return at(Date.now());let t=je.now()-this._performanceStartTime;return po(this.startTime,at(t))}isRecording(){return this._ended===!1}recordException(n,t){let r={};typeof n=="string"?r[to]=n:n&&(n.code?r[no]=n.code.toString():n.name&&(r[no]=n.name),n.message&&(r[to]=n.message),n.stack&&(r[Ld]=n.stack)),r[no]||r[to]?this.addEvent(Nm,r,t):m.warn(`Failed to record an exception ${n}`)}get duration(){return this._duration}get ended(){return this._ended}get droppedAttributesCount(){return this._droppedAttributesCount}get droppedEventsCount(){return this._droppedEventsCount}get droppedLinksCount(){return this._droppedLinksCount}_isSpanEnded(){if(this._ended){let n=new Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);m.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`,n)}return this._ended}_truncateToLimitUtil(n,t){return n.length<=t?n:n.substring(0,t)}_truncateToSize(n){let t=this._attributeValueLengthLimit;return t<=0?(m.warn(`Attribute value limit must be positive, got ${t}`),n):typeof n=="string"?this._truncateToLimitUtil(n,t):Array.isArray(n)?n.map(r=>typeof r=="string"?this._truncateToLimitUtil(r,t):r):n}[tn](n,t,r){let o={name:this.name,kind:this.kind,spanContext:this._spanContext,parentSpanContext:this.parentSpanContext,status:this.status,startTime:this.startTime,endTime:this.endTime,duration:this._duration,ended:this._ended,attributes:this.attributes,events:this.events,links:this.links,droppedAttributesCount:this._droppedAttributesCount,droppedEventsCount:this._droppedEventsCount,droppedLinksCount:this._droppedLinksCount,instrumentationScope:this.instrumentationScope,resource:{attributes:nn(this.resource)}};return rn("SpanImpl",o,n,t,r)}};var j=(function(e){return e[e.NOT_RECORD=0]="NOT_RECORD",e[e.RECORD=1]="RECORD",e[e.RECORD_AND_SAMPLED=2]="RECORD_AND_SAMPLED",e})(j||{});var Cm="otel.component.name",Mm="otel.component.type",vm="otel.span.parent.origin",la="otel.span.sampling_result",Pm="otel.sdk.processor.span.processed",Lm="otel.sdk.processor.span.queue.capacity",Dm="otel.sdk.processor.span.queue.size",ym="otel.sdk.span.live",Im="otel.sdk.span.started",wm="batching_span_processor";var ei=class{startedSpans;liveSpans;constructor(n){this.startedSpans=n.createCounter(Im,{unit:"{span}",description:"The number of created spans."}),this.liveSpans=n.createUpDownCounter(ym,{unit:"{span}",description:"The number of currently live spans."})}startSpan(n,t){let r=HT(t);if(this.startedSpans.add(1,{[vm]:GT(n),[la]:r}),t===j.NOT_RECORD)return()=>{};let o={[la]:r};return this.liveSpans.add(1,o),()=>{this.liveSpans.add(-1,o)}}};function GT(e){return e?e.isRemote?"remote":"local":"none"}function HT(e){switch(e){case j.RECORD_AND_SAMPLED:return"RECORD_AND_SAMPLE";case j.RECORD:return"RECORD_ONLY";case j.NOT_RECORD:return"DROP"}}var Um="2.10.0";var ti=class{_sampler;_spanLimits;_idGenerator;instrumentationScope;_resource;_spanProcessor;_tracerMetrics;constructor(n,t){this.instrumentationScope=n,this._sampler=t.sampler,this._spanLimits=t.spanLimits,this._resource=t.resource,this._idGenerator=t.idGenerator,this._spanProcessor=t.spanProcessor;let r=t.meterProvider.getMeter("@opentelemetry/sdk-trace",Um);this._tracerMetrics=new ei(r)}startSpan(n,t={},r=O.active()){t.root&&(r=x.deleteSpan(r));let o=x.getSpan(r);if(St(r))return m.debug("Instrumentation suppressed, returning Noop Span"),x.wrapSpanContext(Mn);let i=o?.spanContext(),s=this._idGenerator.generateSpanId(),a,c,l;!i||!x.isSpanContextValid(i)?c=this._idGenerator.generateTraceId():(c=i.traceId,l=i.traceState,a=i);let _=t.kind??De.INTERNAL,f=(t.links??[]).map(vt=>({context:vt.context,attributes:it(vt.attributes)})),S=it(t.attributes),T=this._sampler.shouldSample(r,c,n,_,S,f),h=this._tracerMetrics.startSpan(i,T.decision);l=T.traceState??l;let R=T.decision===Ln.RECORD_AND_SAMPLED?Q.SAMPLED:Q.NONE,I={traceId:c,spanId:s,traceFlags:R,traceState:l};if(T.decision===Ln.NOT_RECORD)return m.debug("Recording is off, propagating context in a non-recording span"),x.wrapSpanContext(I);let _a=it(Object.assign(S,T.attributes));return new Jo({resource:this._resource,scope:this.instrumentationScope,context:r,spanContext:I,name:n,kind:_,links:f,parentSpanContext:a,attributes:_a,startTime:t.startTime,spanProcessor:this._spanProcessor,spanLimits:this._spanLimits,recordEndMetrics:h})}startActiveSpan(n,t,r,o){let i,s,a;if(arguments.length<2)return;arguments.length===2?a=t:arguments.length===3?(i=t,a=r):(i=t,s=r,a=o);let c=s??O.active(),l=this.startSpan(n,i,c),_=x.setSpan(c,l);return O.with(_,a,void 0,l)}[tn](n,t,r){let o={instrumentationScope:this.instrumentationScope,resource:{attributes:nn(this._resource)},spanLimits:this._spanLimits};return rn("Tracer",o,n,t,r)}};var ni=class{_spanProcessors;constructor(n){this._spanProcessors=n}forceFlush(){let n=[];for(let t of this._spanProcessors)n.push(t.forceFlush());return new Promise(t=>{Promise.all(n).then(()=>{t()}).catch(r=>{Re(r||new Error("MultiSpanProcessor: forceFlush failed")),t()})})}onStart(n,t){for(let r of this._spanProcessors)r.onStart(n,t)}onEnding(n){for(let t of this._spanProcessors)t.onEnding&&t.onEnding(n)}onEnd(n){for(let t of this._spanProcessors)t.onEnd(n)}shutdown(){let n=[];for(let t of this._spanProcessors)n.push(t.shutdown());return new Promise((t,r)=>{Promise.all(n).then(()=>{t()},r)})}};g();var Oe=class{shouldSample(){return{decision:j.NOT_RECORD}}toString(){return"AlwaysOffSampler"}};var ee=class{shouldSample(){return{decision:j.RECORD_AND_SAMPLED}}toString(){return"AlwaysOnSampler"}};var fe=class{_root;_remoteParentSampled;_remoteParentNotSampled;_localParentSampled;_localParentNotSampled;constructor(n){this._root=n.root,this._root||(Re(new Error("ParentBasedSampler must have a root sampler configured")),this._root=new ee),this._remoteParentSampled=n.remoteParentSampled??new ee,this._remoteParentNotSampled=n.remoteParentNotSampled??new Oe,this._localParentSampled=n.localParentSampled??new ee,this._localParentNotSampled=n.localParentNotSampled??new Oe}shouldSample(n,t,r,o,i,s){let a=x.getSpanContext(n);return!a||!ge(a)?this._root.shouldSample(n,t,r,o,i,s):a.isRemote?a.traceFlags&Q.SAMPLED?this._remoteParentSampled.shouldSample(n,t,r,o,i,s):this._remoteParentNotSampled.shouldSample(n,t,r,o,i,s):a.traceFlags&Q.SAMPLED?this._localParentSampled.shouldSample(n,t,r,o,i,s):this._localParentNotSampled.shouldSample(n,t,r,o,i,s)}toString(){return`ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`}};g();ze();var Vm=new Map,ri=class{processedSpans;queueSize;queueSizeCallback;standardAttrs;droppedAttrs;constructor(n,t,r){let o=Vm.get(n)??0;if(Vm.set(n,o+1),this.standardAttrs={[Mm]:n,[Cm]:`${n}/${o}`},this.droppedAttrs=Pt(xe({},this.standardAttrs),{[st]:"queue_full"}),this.processedSpans=t.createCounter(Pm,{unit:"{span}",description:"The number of spans for which the processing has finished, either successful or failed."}),r){let{capacity:i,getQueueSize:s}=r;t.createUpDownCounter(Lm,{unit:"{span}",description:"The maximum number of spans the queue of a given instance of an SDK span processor can hold."}).add(i,this.standardAttrs),this.queueSize=t.createObservableUpDownCounter(Dm,{unit:"{span}",description:"The number of spans in the queue of a given instance of an SDK span processor."}),this.queueSizeCallback=c=>c.observe(s(),this.standardAttrs),this.queueSize.addCallback(this.queueSizeCallback)}}dropSpans(n){this.processedSpans.add(n,this.droppedAttrs)}finishSpans(n,t){if(!t){this.processedSpans.add(n,this.standardAttrs);return}let r=Pt(xe({},this.standardAttrs),{[st]:t.name});this.processedSpans.add(n,r)}shutdown(){this.queueSize&&this.queueSizeCallback&&this.queueSize.removeCallback(this.queueSizeCallback)}};var oi=class{_maxExportBatchSize;_maxQueueSize;_scheduledDelayMillis;_exportTimeoutMillis;_exporter;_metrics;_isExporting=!1;_finishedSpans=[];_timer;_shutdownOnce;_droppedSpansCount=0;constructor(n){this._exporter=n.exporter,this._maxExportBatchSize=n.maxExportBatchSize??512,this._maxQueueSize=n.maxQueueSize??2048,this._scheduledDelayMillis=n.scheduledDelayMillis??5e3,this._exportTimeoutMillis=n.exportTimeoutMillis??3e4,this._shutdownOnce=new Vn(this._shutdown,this),this._maxExportBatchSize>this._maxQueueSize&&(m.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"),this._maxExportBatchSize=this._maxQueueSize);let t=n.selfObsMeterProvider?n.selfObsMeterProvider.getMeter("@opentelemetry/sdk-trace"):Nn();this._metrics=new ri(wm,t,{capacity:this._maxQueueSize,getQueueSize:()=>this._finishedSpans.length})}forceFlush(){return this._shutdownOnce.isCalled?this._shutdownOnce.promise:this._flushAll()}onStart(n,t){}onEnd(n){this._shutdownOnce.isCalled||(n.spanContext().traceFlags&Q.SAMPLED)!==0&&this._addToBuffer(n)}shutdown(){return this._shutdownOnce.call()}_shutdown(){return Promise.resolve().then(()=>this.onShutdown()).then(()=>this._flushAll()).then(()=>(this._metrics.shutdown(),this._exporter.shutdown()))}_addToBuffer(n){if(this._finishedSpans.length>=this._maxQueueSize){this._droppedSpansCount===0&&m.debug("maxQueueSize reached, dropping spans"),this._droppedSpansCount++,this._metrics.dropSpans(1);return}this._droppedSpansCount>0&&(m.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`),this._droppedSpansCount=0),this._finishedSpans.push(n),this._maybeStartTimer()}_flushAll(){return new Promise((n,t)=>{let r=[],o=Math.ceil(this._finishedSpans.length/this._maxExportBatchSize);for(let i=0,s=o;i<s;i++)r.push(this._flushOneBatch());Promise.all(r).then(()=>{n()}).catch(t)})}_flushOneBatch(){return this._clearTimer(),this._finishedSpans.length===0?Promise.resolve():new Promise((n,t)=>{let r=setTimeout(()=>{t(new Error("Timeout"))},this._exportTimeoutMillis);O.with(es(O.active()),()=>{let o;this._finishedSpans.length<=this._maxExportBatchSize?(o=this._finishedSpans,this._finishedSpans=[]):o=this._finishedSpans.splice(0,this._maxExportBatchSize);let i=()=>this._exporter.export(o,a=>{clearTimeout(r),this._metrics.finishSpans(o.length,a.error),a.code===Kt.SUCCESS?n():t(a.error??new Error("BatchSpanProcessor: span export failed"))}),s=null;for(let a=0,c=o.length;a<c;a++){let l=o[a];l.resource.asyncAttributesPending&&l.resource.waitForAsyncAttributes&&(s??=[],s.push(l.resource.waitForAsyncAttributes()))}s===null?i():Promise.all(s).then(i,a=>{Re(a),t(a)})})})}_maybeStartTimer(){if(this._isExporting)return;let n=()=>{this._isExporting=!0,this._flushOneBatch().finally(()=>{this._isExporting=!1,this._finishedSpans.length>0&&(this._clearTimer(),this._maybeStartTimer())}).catch(t=>{this._isExporting=!1,Re(t)})};if(this._finishedSpans.length>=this._maxExportBatchSize)return n();this._timer===void 0&&(this._timer=setTimeout(()=>n(),this._scheduledDelayMillis),typeof this._timer!="number"&&this._timer.unref())}_clearTimer(){this._timer!==void 0&&(clearTimeout(this._timer),this._timer=void 0)}};var on=class extends oi{_visibilityChangeListener;_pageHideListener;constructor(n){super(n),this.onInit(n)}onInit(n){n.disableAutoFlushOnDocumentHide!==!0&&typeof document<"u"&&(this._visibilityChangeListener=()=>{document.visibilityState==="hidden"&&this.forceFlush().catch(t=>{Re(t)})},this._pageHideListener=()=>{this.forceFlush().catch(t=>{Re(t)})},document.addEventListener("visibilitychange",this._visibilityChangeListener),document.addEventListener("pagehide",this._pageHideListener))}onShutdown(){typeof document<"u"&&(this._visibilityChangeListener&&document.removeEventListener("visibilitychange",this._visibilityChangeListener),this._pageHideListener&&document.removeEventListener("pagehide",this._pageHideListener))}};var Bm=new Uint8Array(16),Fm=new Uint8Array(8),YT=Array.from({length:256},(e,n)=>n.toString(16).padStart(2,"0"));function km(e){for(let n=0;n<e.length;n++)e[n]=Math.random()*256>>>0;for(let n=0;n<e.length;n++)if(e[n]>0)return;e[e.length-1]=1}function Gm(e){let n="";for(let t=0;t<e.length;t++)n+=YT[e[t]];return n}var dt=class{generateTraceId(){return km(Bm),Gm(Bm)}generateSpanId(){return km(Fm),Gm(Fm)}};var sn=(function(e){return e[e.resolved=0]="resolved",e[e.timeout=1]="timeout",e[e.error=2]="error",e[e.unresolved=3]="unresolved",e})(sn||{}),or=class{_resource;_activeSpanProcessor;_forceFlushTimeoutMillis;_tracerOptions;_tracers=new Map;constructor(n={}){this._forceFlushTimeoutMillis=n.forceFlushTimeoutMillis??3e4,this._resource=n.resource??rr();let t=n.spanProcessors??[];this._activeSpanProcessor=new ni(t),this._tracerOptions={resource:this._resource,sampler:n.sampler??new fe({root:new ee}),spanLimits:{attributeCountLimit:n.spanLimits?.attributeCountLimit??128,attributeValueLengthLimit:n.spanLimits?.attributeValueLengthLimit??1/0,eventCountLimit:n.spanLimits?.eventCountLimit??128,linkCountLimit:n.spanLimits?.linkCountLimit??128,attributePerEventCountLimit:n.spanLimits?.attributePerEventCountLimit??128,attributePerLinkCountLimit:n.spanLimits?.attributePerLinkCountLimit??128},idGenerator:n.idGenerator||new dt,spanProcessor:this._activeSpanProcessor,meterProvider:n.meterProvider??{getMeter(){return Nn()}}}}getTracer(n,t,r){let o=`${n}@${t||""}:${r?.schemaUrl||""}`;return this._tracers.has(o)||this._tracers.set(o,new ti({name:n,version:t,schemaUrl:r?.schemaUrl},this._tracerOptions)),this._tracers.get(o)}forceFlush(){let n=this._forceFlushTimeoutMillis,t=this._activeSpanProcessor._spanProcessors.map(r=>new Promise(o=>{let i,s=setTimeout(()=>{o(new Error(`Span processor did not completed within timeout period of ${n} ms`)),i=sn.timeout},n);r.forceFlush().then(()=>{clearTimeout(s),i!==sn.timeout&&(i=sn.resolved,o(i))}).catch(a=>{clearTimeout(s),i=sn.error,o(a)})}));return new Promise((r,o)=>{Promise.all(t).then(i=>{let s=i.filter(a=>a!==sn.resolved);s.length>0?o(s):r()}).catch(i=>o([i]))})}shutdown(){return this._activeSpanProcessor.shutdown()}[tn](n,t,r){let o=this._activeSpanProcessor._spanProcessors,i={resource:{attributes:nn(this._resource)},tracers:Array.from(this._tracers.keys()),spanProcessors:o.map(s=>s.constructor?.name??"SpanProcessor")};return rn("TracerProvider",i,n,t,r)}};g();var _t=class{_ratio;_upperBound;constructor(n=0){this._ratio=this._normalize(n),this._upperBound=this._ratio===1?4294967296:Math.floor(this._ratio*4294967295)}shouldSample(n,t){return{decision:zr(t)&&this._accumulate(t)<this._upperBound?j.RECORD_AND_SAMPLED:j.NOT_RECORD}}toString(){return`TraceIdRatioBased{${this._ratio}}`}_normalize(n){return typeof n!="number"||isNaN(n)?0:n>=1?1:n<=0?0:n}_accumulate(n){let t=0;for(let r=0;r<32;r+=8){let o=0;for(let i=0;i<8;i++){let s=n.charCodeAt(r+i),a=s<58?s-48:s<71?s-55:s-87;o=o<<4|a}t=(t^o)>>>0}return t}};var $e=(function(e){return e.AlwaysOff="always_off",e.AlwaysOn="always_on",e.ParentBasedAlwaysOff="parentbased_always_off",e.ParentBasedAlwaysOn="parentbased_always_on",e.ParentBasedTraceIdRatio="parentbased_traceidratio",e.TraceIdRatio="traceidratio",e})($e||{}),ii=1;function Ym(){return{sampler:KT(),forceFlushTimeoutMillis:3e4,generalLimits:{attributeValueLengthLimit:void 0??1/0,attributeCountLimit:void 0??128},spanLimits:{attributeValueLengthLimit:void 0??1/0,attributeCountLimit:void 0??128,linkCountLimit:void 0??128,eventCountLimit:void 0??128,attributePerEventCountLimit:void 0??128,attributePerLinkCountLimit:void 0??128}}}function KT(){let e=void 0??$e.ParentBasedAlwaysOn;switch(e){case $e.AlwaysOn:return new ee;case $e.AlwaysOff:return new Oe;case $e.ParentBasedAlwaysOn:return new fe({root:new ee});case $e.ParentBasedAlwaysOff:return new fe({root:new Oe});case $e.TraceIdRatio:return new _t(Hm());case $e.ParentBasedTraceIdRatio:return new fe({root:new _t(Hm())});default:return m.error(`OTEL_TRACES_SAMPLER value "${e}" invalid, defaulting to "${$e.ParentBasedAlwaysOn}".`),new fe({root:new ee})}}function Hm(){let e=void 0;return e==null?(m.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${ii}.`),ii):e<0||e>1?(m.error(`OTEL_TRACES_SAMPLER_ARG=${e} was given, but it is out of range ([0..1]), defaulting to ${ii}.`),ii):e}var zT=128,jT=1/0;function Km(e){let n=Object.assign({},e.spanLimits);return n.attributeCountLimit=e.spanLimits?.attributeCountLimit??e.generalLimits?.attributeCountLimit??void 0??void 0??zT,n.attributeValueLengthLimit=e.spanLimits?.attributeValueLengthLimit??e.generalLimits?.attributeValueLengthLimit??void 0??void 0??jT,Object.assign({},e,{spanLimits:n})}var an=class extends or{constructor(n={}){let t=ds({},Ym(),Km(n));delete t.generalLimits,super(t)}};var cn=class extends on{constructor(n,t){t||(t={});let r=[["maxExportBatchSize","OTEL_BSP_MAX_EXPORT_BATCH_SIZE"],["maxQueueSize","OTEL_BSP_MAX_QUEUE_SIZE"],["scheduledDelayMillis","OTEL_BSP_SCHEDULE_DELAY"],["exportTimeoutMillis","OTEL_BSP_EXPORT_TIMEOUT"]];for(let[o,i]of r)if(t[o]===void 0){let s=void 0;s!==void 0&&(t[o]=s)}super(xe({exporter:n},t))}};g();var si=class{_enabled=!1;_currentContext=Ke;_bindFunction(n=Ke,t){let r=this,o=function(...i){return r.with(n,()=>t.apply(this,i))};return Object.defineProperty(o,"length",{enumerable:!1,configurable:!0,writable:!1,value:t.length}),o}active(){return this._currentContext}bind(n,t){return n===void 0&&(n=this.active()),typeof t=="function"?this._bindFunction(n,t):t}disable(){return this._currentContext=Ke,this._enabled=!1,this}enable(){return this._enabled?this:(this._enabled=!0,this._currentContext=Ke,this)}with(n,t,r,...o){let i=this._currentContext;this._currentContext=n||Ke;try{return t.call(r,...o)}finally{this._currentContext=i}}};g();function $T(e){if(e!==null){if(e===void 0){let n=new si;n.enable(),O.setGlobalContextManager(n);return}e.enable(),O.setGlobalContextManager(e)}}function QT(e){if(e!==null){if(e===void 0){F.setGlobalPropagator(new wn({propagators:[new Rt,new In]}));return}F.setGlobalPropagator(e)}}var ir=class extends an{constructor(n={}){super(n)}register(n={}){x.setGlobalTracerProvider(this),QT(n.propagator),$T(n.contextManager)}};ze();var ai=class{constructor(n,t){this.processor=n,this.metas=t}forceFlush(){return this.processor.forceFlush()}onStart(n,t){var r;let o=this.metas.value.session;o?.id&&(n.attributes[Cu]=o.id,n.attributes.session_id=o.id);let i=(r=this.metas.value.user)!==null&&r!==void 0?r:{};i.email&&(n.attributes["user.email"]=i.email),i.id&&(n.attributes["user.id"]=i.id),i.username&&(n.attributes["user.name"]=i.username),i.fullName&&(n.attributes["user.full_name"]=i.fullName),i.roles&&(n.attributes["user.roles"]=i.roles.split(",").map(s=>s.trim())),i.hash&&(n.attributes["user.hash"]=i.hash),this.processor.onStart(n,t)}onEnd(n){this.processor.onEnd(n)}shutdown(){return this.processor.shutdown()}};g();var ci=class{constructor(n){this.processor=n,Kc.subscribe(t=>{if(t.type===kc){this.message=t;return}[Gc,Yc,Hc].includes(t.type)&&(this.message=void 0)})}forceFlush(){return this.processor.forceFlush()}onStart(n,t){var r,o;n.kind===De.CLIENT&&this.message&&(n.attributes["faro.action.user.name"]=(r=this.message)===null||r===void 0?void 0:r.name,n.attributes["faro.action.user.parentId"]=(o=this.message)===null||o===void 0?void 0:o.parentId),this.processor.onStart(n,t)}onEnd(n){this.processor.onEnd(n)}shutdown(){return this.processor.shutdown()}};function zm(e={}){var n;return((n=e.attributes)===null||n===void 0?void 0:n.isSampled)==="true"?j.RECORD_AND_SAMPLED:j.NOT_RECORD}var da=(()=>{class e extends zc{constructor(t={}){super(),this.options=t,this.name="@grafana/faro-web-tracing",this.version=hi}initialize(){var t,r,o,i,s;let a=this.options,c={};this.config.app.name&&(c[co]=this.config.app.name),this.config.app.namespace&&(c[vu]=this.config.app.namespace),this.config.app.version&&(c[Dd]=this.config.app.version),this.config.app.environment&&(c[Mu]=this.config.app.environment,c[Md]=this.config.app.environment);let l=this.metas.value.browser;Fc(l?.brands)&&(c[Iu]=l.brands.map(R=>R.brand)),l?.language&&(c[wu]=l.language),typeof l?.mobile=="boolean"&&(c[Uu]=!!l.mobile),l?.os&&(c[Vu]=l.os),l?.userAgent&&(c[yd]=l.userAgent),c[Pu]="browser",c[Lu]=(t=this.metas.value.browser)===null||t===void 0?void 0:t.userAgent,c[Du]="faro-web-sdk",c[yu]=hi,Object.assign(c,a.resourceAttributes);let _=rr().merge(Zo(c));new ir({resource:_,sampler:{shouldSample:()=>({decision:zm(this.api.getSession())})},spanProcessors:[(r=a.spanProcessor)!==null&&r!==void 0?r:new ci(new ai(new cn(new Vo({api:this.api}),{scheduledDelayMillis:e.SCHEDULED_BATCH_DELAY_MS,maxExportBatchSize:30}),this.metas))]}).register({propagator:(o=a.propagator)!==null&&o!==void 0?o:new Rt,contextManager:a.contextManager});let{propagateTraceHeaderCorsUrls:S,fetchInstrumentationOptions:T,xhrInstrumentationOptions:h}=(i=this.options.instrumentationOptions)!==null&&i!==void 0?i:{};Ys({instrumentations:(s=a.instrumentations)!==null&&s!==void 0?s:Om({ignoreUrls:this.getIgnoreUrls(),propagateTraceHeaderCorsUrls:S,fetchInstrumentationOptions:T,xhrInstrumentationOptions:h})}),this.api.initOTEL(x,O)}getIgnoreUrls(){return this.transports.transports.flatMap(t=>t.getIgnoreUrls())}}return e.SCHEDULED_BATCH_DELAY_MS=1e3,e})();var jm=()=>{Xc({url:"https://faro-collector-prod-ap-southeast-1.grafana.net/collect/7589747939196e0549ee6d33aa985355",app:{name:"Fullstack Ladder",version:"1.0.0",environment:"production"},instrumentations:[...qc(),new da]})};jm();Va(Pl,Qc).catch(e=>console.error(e));
