"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[744],{2744:(E,f,s)=>{s.r(f),s.d(f,{BlogTagsModule:()=>D});var c=s(4755),u=s(1728),i=s(6012),m=s(430),d=s(9383),p=s(5608),v=s(1453),l=s(4850),y=s(7545),C=s(7122),M=s(8173),$=s(7975),L=s(5495),z=s(2985),t=s(2223),P=s(8846);function x(o,a){if(1&o&&(t.ynx(0),t.TgZ(1,"mat-card",4)(2,"mat-card-title",5)(3,"a",6),t.ALo(4,"postDateAsPath"),t._uU(5),t.qZA()(),t.TgZ(6,"mat-card-subtitle",7),t._UZ(7,"app-blog-post-subtitle",8),t.qZA(),t.TgZ(8,"mat-card-content",9),t._UZ(9,"div",10),t.qZA(),t.TgZ(10,"mat-card-footer")(11,"a",11),t.ALo(12,"postDateAsPath"),t.TgZ(13,"mat-icon"),t._uU(14,"read_more"),t.qZA(),t.TgZ(15,"span"),t._uU(16,"\u7e7c\u7e8c\u95b1\u8b80"),t.qZA()()()(),t.BQk()),2&o){const e=a.$implicit;t.xp6(3),t.Q6J("routerLink",t.lcZ(4,5,e)),t.xp6(2),t.Oqu(e.title),t.xp6(2),t.Q6J("postMeta",e),t.xp6(2),t.Q6J("innerHTML",e.summary,t.oJD),t.xp6(2),t.Q6J("routerLink",t.lcZ(12,7,e))}}let h=(()=>{class o{constructor(e,n){this.route=e,this.siteMetaService=n,this.tagSlug$=this.route.paramMap.pipe((0,l.U)(g=>g.get("tag-slug"))),this.currentPage$=this.route.paramMap.pipe((0,l.U)(g=>+(g.get("page")||1))),this.tagPosts$=this.route.data.pipe((0,l.U)(g=>g.posts)),this.tagPostsCount$=this.tagPosts$.pipe((0,l.U)(g=>g.length)),this.posts$=this.currentPage$.pipe((0,y.w)(g=>this.tagPosts$.pipe((0,l.U)(r=>(0,z.$)(g,10,r))))),this.totalPage$=this.tagPosts$.pipe((0,l.U)(g=>Math.ceil(Object.keys(g).length/10)))}ngOnInit(){this.tagSlug$.subscribe(e=>{this.siteMetaService.resetMeta({title:`\u6a19\u7c64\uff1a${e}`,description:`${e} \u76f8\u95dc\u6587\u7ae0`,keywords:[e||""],type:"website"})})}}return o.\u0275fac=function(e){return new(e||o)(t.Y36(p.gz),t.Y36(P.a))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-blog-tag-posts"]],standalone:!0,features:[t.jDz],decls:15,vars:20,consts:[[1,"tags-header","mat-elevation-z4"],[4,"ngFor","ngForOf"],["appearance","outlined",1,"pagination"],[3,"linkBase","currentPage","totalPage"],["appearance","outlined",1,"blog-post"],[1,"blog-post-title"],[3,"routerLink"],[1,"blog-post-subtitle"],[3,"postMeta"],[1,"blog-post-content"],[3,"innerHTML"],["mat-raised-button","","color","primary",1,"read-more",3,"routerLink"]],template:function(e,n){1&e&&(t.TgZ(0,"mat-toolbar",0)(1,"h1"),t._uU(2),t.ALo(3,"unslugify"),t.ALo(4,"push"),t.qZA(),t.TgZ(5,"h2"),t._uU(6),t.ALo(7,"push"),t.qZA()(),t.YNc(8,x,17,9,"ng-container",1),t.ALo(9,"push"),t.TgZ(10,"mat-card",2),t._UZ(11,"app-pagination",3),t.ALo(12,"push"),t.ALo(13,"push"),t.ALo(14,"push"),t.qZA()),2&e&&(t.xp6(2),t.Oqu(t.lcZ(3,6,t.lcZ(4,8,n.tagSlug$)||"")),t.xp6(4),t.hij("\u6a19\u7c64 (\u5171 ",t.lcZ(7,10,n.tagPostsCount$)," \u7bc7\u6587\u7ae0)"),t.xp6(2),t.Q6J("ngForOf",t.lcZ(9,12,n.posts$)),t.xp6(3),t.MGl("linkBase","/blog/tags/",t.lcZ(12,14,n.tagSlug$),"/page"),t.Q6J("currentPage",t.lcZ(13,16,n.currentPage$)||1)("totalPage",t.lcZ(14,18,n.totalPage$)||1))},dependencies:[d.g0,d.Ye,c.ax,i.QW,i.a8,i.dn,i.rt,i.$j,i.n5,p.rH,C.z,u.ot,u.zs,m.Ps,m.Hw,M.Q,L.N,$.y,v.c]}),o})();var O=s(8491),S=s(3841),U=s(7591),F=s(3993),Z=s(5447);let A=(()=>{class o{constructor(e){this.sitePostService=e}resolve(e,n){const g=e.paramMap.get("tag-slug");return this.sitePostService.tagsAndPosts$.pipe((0,l.U)(r=>(0,F.K)(g,r)),(0,l.U)(r=>(0,O.Z)([(0,S.Z)((0,U.Z)("date"))],r)))}}return o.\u0275fac=function(e){return new(e||o)(t.LFG(Z.g))},o.\u0275prov=t.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})(),Q=(()=>{class o{constructor(e){this.sitePostService=e}resolve(e,n){return this.sitePostService.tagsAndPosts$}}return o.\u0275fac=function(e){return new(e||o)(t.LFG(Z.g))},o.\u0275prov=t.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})();var b=s(2245);let j=(()=>{class o{transform(e,n){return e>=.4*n?1:e>=.2*n?2:e>=.1*n?3:4}}return o.\u0275fac=function(e){return new(e||o)},o.\u0275pipe=t.Yjl({name:"blogPostTagSize",type:o,pure:!0,standalone:!0}),o})();const J=function(o){return["/blog/tags",o]};function Y(o,a){if(1&o&&(t.TgZ(0,"a",7),t.ALo(1,"blogPostTagSize"),t.ALo(2,"push"),t.ALo(3,"slugify"),t._uU(4),t.qZA()),2&o){const e=t.oxw().$implicit,n=t.oxw();t.Gre("tag size-",t.xi3(1,5,e.value.length,t.lcZ(2,8,n.maxPostsCount$)||0),""),t.Q6J("routerLink",t.VKq(12,J,t.lcZ(3,10,e.key))),t.xp6(4),t.hij(" ",e.key," ")}}function R(o,a){if(1&o&&(t.ynx(0),t.YNc(1,Y,5,14,"a",6),t.BQk()),2&o){const e=a.$implicit;t.xp6(1),t.Q6J("ngIf",null==e?null:e.key)}}let B=(()=>{class o{constructor(e,n){this.route=e,this.siteMetaService=n,this.tags$=this.route.data.pipe((0,l.U)(g=>g.tags)),this.maxPostsCount$=this.tags$.pipe((0,l.U)(g=>Math.max(...Object.values(g).map(r=>r.length))))}ngOnInit(){this.siteMetaService.resetMeta({title:"\u6a19\u7c64",description:"\u986f\u793a\u6240\u6709\u6a19\u7c64",keywords:[""],type:"website"})}}return o.\u0275fac=function(e){return new(e||o)(t.Y36(p.gz),t.Y36(P.a))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-blog-tags"]],standalone:!0,features:[t.jDz],decls:12,vars:10,consts:[["appearance","outlined",1,"blog-post"],[1,"blog-post-title"],[1,"blog-post-subtitle"],[1,"blog-post-content"],[1,"tags"],[4,"ngFor","ngForOf"],[3,"class","routerLink",4,"ngIf"],[3,"routerLink"]],template:function(e,n){1&e&&(t.TgZ(0,"mat-card",0)(1,"mat-card-title",1),t._uU(2," \u6a19\u7c64 "),t.qZA(),t.TgZ(3,"mat-card-subtitle",2),t._uU(4),t.ALo(5,"keyvalue"),t.ALo(6,"push"),t.qZA(),t.TgZ(7,"mat-card-content",3)(8,"div",4),t.YNc(9,R,2,1,"ng-container",5),t.ALo(10,"keyvalue"),t.ALo(11,"push"),t.qZA()()()),2&e&&(t.xp6(4),t.hij(" \u5171 ",t.lcZ(5,2,t.lcZ(6,4,n.tags$)).length," \u500b\u6a19\u7c64 "),t.xp6(5),t.Q6J("ngForOf",t.lcZ(10,6,t.lcZ(11,8,n.tags$))))},dependencies:[i.QW,i.a8,i.dn,i.$j,i.n5,c.ax,c.O5,p.rH,c.Nd,b.N,v.c,j],styles:[".tags[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap}.tags[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%]{margin:8px}.tags[_ngcontent-%COMP%]   .tag.size-1[_ngcontent-%COMP%]{font-size:36px}.tags[_ngcontent-%COMP%]   .tag.size-2[_ngcontent-%COMP%]{font-size:30px}.tags[_ngcontent-%COMP%]   .tag.size-3[_ngcontent-%COMP%]{font-size:24px}.tags[_ngcontent-%COMP%]   .tag.size-4[_ngcontent-%COMP%]{font-size:16px}"]}),o})();const I=[{path:":tag-slug",resolve:{posts:A},component:h},{path:":tag-slug/page/:page",resolve:{posts:A},component:h},{path:"",resolve:{tags:Q},component:B}];let N=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[p.Bz.forChild(I),p.Bz]}),o})(),D=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[c.ez,N,i.QW,u.ot,m.Ps,d.g0,B,h]}),o})()}}]);