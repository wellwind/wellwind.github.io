"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[153],{3153:(u,l,t)=>{t.r(l),t.d(l,{BlogModule:()=>g});var c=t(6895),a=t(4859),h=t(7392),i=t(911),r=t(8761),f=t(8950),o=t(4650);class e{constructor(){}ngOnInit(){}goTop(d){if(d){const n=(0,r.d)(d);n&&(0,f.X)(0,n)}}static#t=this.\u0275fac=function(n){return new(n||e)};static#o=this.\u0275cmp=o.Xpm({type:e,selectors:[["app-blog-layout"]],decls:6,vars:0,consts:[[1,"blog-page-container"],["container",""],["role","button","aria-label","\u56de\u5230\u6700\u4e0a\u9762","mat-fab","","color","default","matTooltip","\u56de\u5230\u6700\u4e0a\u9762",1,"go-top",3,"click"]],template:function(n,p){if(1&n){const v=o.EpF();o.TgZ(0,"div",0,1),o._UZ(2,"router-outlet"),o.TgZ(3,"button",2),o.NdJ("click",function(){o.CHM(v);const y=o.MAs(1);return o.KtG(p.goTop(y))}),o.TgZ(4,"mat-icon"),o._uU(5,"keyboard_double_arrow_up"),o.qZA()()()}},dependencies:[i.lC,h.Hw,a.cs],styles:[".blog-page-container[_ngcontent-%COMP%]{word-break:break-word;padding:16px}.go-top[_ngcontent-%COMP%]{position:fixed;bottom:32px;right:32px;background-color:var(--background-color)}"]})}const C=[{path:"",component:e,children:[{path:"archives",loadChildren:()=>Promise.all([t.e(23),t.e(592),t.e(709)]).then(t.bind(t,8709)).then(s=>s.BlogArchivesModule)},{path:"categories",loadChildren:()=>Promise.all([t.e(23),t.e(592),t.e(796)]).then(t.bind(t,4796)).then(s=>s.BlogCategoriesModule)},{path:"tags",loadChildren:()=>Promise.all([t.e(23),t.e(592),t.e(744)]).then(t.bind(t,2744)).then(s=>s.BlogTagsModule)},{path:"",loadChildren:()=>Promise.all([t.e(23),t.e(592),t.e(715)]).then(t.bind(t,8715)).then(s=>s.BlogPostsModule)}]}];class m{static#t=this.\u0275fac=function(n){return new(n||m)};static#o=this.\u0275mod=o.oAB({type:m});static#n=this.\u0275inj=o.cJS({imports:[i.Bz.forChild(C),i.Bz]})}class g{static#t=this.\u0275fac=function(n){return new(n||g)};static#o=this.\u0275mod=o.oAB({type:g});static#n=this.\u0275inj=o.cJS({imports:[c.ez,m,h.Ps,a.ot]})}},8761:(u,l,t)=>{t.d(l,{d:()=>c});const c=a=>a.closest(".mat-drawer-content.main-content")},8950:(u,l,t)=>{t.d(l,{X:()=>c});const c=(a,h)=>{const i=window.matchMedia("(prefers-reduced-motion)");h.scroll({behavior:i.matches?"auto":"smooth",top:a})}}}]);