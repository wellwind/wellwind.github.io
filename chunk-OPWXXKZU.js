import{a as z,b as G}from"./chunk-ZFQZ7ELU.js";import{a as q,b as K}from"./chunk-7X32TRHJ.js";import{a as F,b as $,c as R,d as j,e as H,f as w}from"./chunk-C6NVTK26.js";import{a as N,b as W,d as Z,g as J}from"./chunk-B26MTLS2.js";import"./chunk-H3NMIRXG.js";import{g as L}from"./chunk-FTELQJHK.js";import{b as T,e as k,g as D,h as I}from"./chunk-35EY52IR.js";import{Ga as p,I as S,M as B,Na as f,Oa as h,Pa as a,Qa as n,Ra as l,Yb as x,hb as m,ib as P,jb as _,ka as E,ma as i,ob as v,pb as C,wa as A,wb as c}from"./chunk-T6MGXGO2.js";import"./chunk-2BJYVO3V.js";import"./chunk-C6Q5SG76.js";var y=(()=>{class e{constructor(){this.sitePostService=B(L)}resolve(){return this.sitePostService.postsMetaWithSlugAndSortDesc$}static{this.\u0275fac=function(o){return new(o||e)}}static{this.\u0275prov=S({token:e,factory:e.\u0275fac,providedIn:"root"})}}return e})();var X=(e,s)=>s.year,Y=(e,s)=>s.slug;function tt(e,s){if(e&1&&(a(0,"mat-card",3)(1,"mat-card-title",4)(2,"a",5),v(3,"postDateAsPath"),m(4),n()(),a(5,"mat-card-subtitle",6),l(6,"app-blog-post-subtitle",7),n(),a(7,"mat-card-content",8),l(8,"div",9),n(),a(9,"mat-card-footer")(10,"a",10),v(11,"postDateAsPath"),a(12,"mat-icon"),m(13,"read_more"),n(),a(14,"span"),m(15,"\u7E7C\u7E8C\u95B1\u8B80"),n()()()()),e&2){let t=s.$implicit;i(2),p("routerLink",C(3,5,t)),i(2),P(t.title),i(2),p("postMeta",t),i(2),p("innerHTML",t.summary,E),i(2),p("routerLink",C(11,7,t))}}function et(e,s){if(e&1&&(a(0,"mat-toolbar",2)(1,"h1"),m(2),n(),a(3,"h2"),m(4),n()(),f(5,tt,16,9,"mat-card",3,Y)),e&2){let t=s.$implicit;i(2),P(t.year),i(2),_("\u5E74 (\u5171 ",t.postCount," \u7BC7\u6587\u7AE0)"),i(),h(t.posts)}}var O=10,M=(()=>{class e{constructor(){this.currentPage=N(t=>+(t.get("page")||1),1),this.totalPosts=W(t=>t.posts,[]),this.yearPostsCount=c(()=>this.totalPosts().reduce((t,o)=>{let r=o.date.substr(0,4);return t[r]||(t[r]=0),t[r]+=1,t},{})),this.posts=c(()=>{let t=this.totalPosts(),o=this.currentPage(),r=K(o,O,t),Q=this.yearPostsCount();return r.reduce((u,d)=>{let g=d.date.slice(0,4),b=u.find(U=>U.year===g);return b?b.posts.push(d):u.push({year:g,postCount:Q[g],posts:[d]}),u},[])}),this.totalPage=c(()=>Math.ceil(this.totalPosts().length/O))}static{this.\u0275fac=function(o){return new(o||e)}}static{this.\u0275cmp=A({type:e,selectors:[["app-blog-archives"]],decls:4,vars:2,consts:[["appearance","outlined",1,"pagination"],["linkBase","/blog/archives/page",3,"currentPage","totalPage"],[1,"year-header","mat-elevation-z4","!mb-2"],["appearance","outlined",1,"blog-post"],[1,"blog-post-title"],[3,"routerLink"],[1,"blog-post-subtitle"],[3,"postMeta"],[1,"blog-post-content"],[3,"innerHTML"],["mat-raised-button","","color","primary",1,"read-more",3,"routerLink"]],template:function(o,r){o&1&&(f(0,et,7,2,null,null,X),a(2,"mat-card",0),l(3,"app-pagination",1),n()),o&2&&(h(r.posts()),i(3),p("currentPage",r.currentPage()||1)("totalPage",r.totalPage()||1))},dependencies:[G,z,w,F,R,H,j,$,x,Z,k,T,I,D,q,J],encapsulation:2,changeDetection:0})}}return e})();var ot=[{path:"",resolve:{posts:y},component:M},{path:"page/:page",resolve:{posts:y},component:M}],_t=ot;export{_t as default};