"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[709],{8709:(b,v,s)=>{s.r(v),s.d(v,{BlogArchivesModule:()=>u});var A=s(6895),f=s(4859),p=s(3546),Z=s(7392),P=s(3683),y=s(5597),T=s(6633),U=s(1066),M=s(2608),m=s(911),t=s(4650),L=s(5447);class i{constructor(e){this.sitePostService=e}resolve(e,o){return this.sitePostService.postsMetaWithSlugAndSortDesc$}}i.\u0275fac=function(e){return new(e||i)(t.LFG(L.g))},i.\u0275prov=t.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"});var l=s(4850),B=s(7545),Q=s(2985),J=s(8173),F=s(7122),x=s(7975);function z(a,e){if(1&a&&(t.ynx(0),t.TgZ(1,"mat-card",4)(2,"mat-card-title",5)(3,"a",6),t.ALo(4,"postDateAsPath"),t._uU(5),t.qZA()(),t.TgZ(6,"mat-card-subtitle",7),t._UZ(7,"app-blog-post-subtitle",8),t.qZA(),t.TgZ(8,"mat-card-content",9),t._UZ(9,"div",10),t.qZA(),t.TgZ(10,"mat-card-footer")(11,"a",11),t.ALo(12,"postDateAsPath"),t.TgZ(13,"mat-icon"),t._uU(14,"read_more"),t.qZA(),t.TgZ(15,"span"),t._uU(16,"\u7e7c\u7e8c\u95b1\u8b80"),t.qZA()()()(),t.BQk()),2&a){const o=e.$implicit;t.xp6(3),t.Q6J("routerLink",t.lcZ(4,5,o)),t.xp6(2),t.Oqu(o.title),t.xp6(2),t.Q6J("postMeta",o),t.xp6(2),t.Q6J("innerHTML",o.summary,t.oJD),t.xp6(2),t.Q6J("routerLink",t.lcZ(12,7,o))}}function E(a,e){if(1&a&&(t.ynx(0),t.TgZ(1,"mat-toolbar",3)(2,"h1"),t._uU(3),t.qZA(),t.TgZ(4,"h2"),t._uU(5),t.qZA()(),t.YNc(6,z,17,9,"ng-container",0),t.BQk()),2&a){const o=e.$implicit;t.xp6(3),t.Oqu(o.year),t.xp6(2),t.hij("\u5e74 (\u5171 ",o.postCount," \u7bc7\u6587\u7ae0)"),t.xp6(1),t.Q6J("ngForOf",o.posts)}}class c{constructor(e){this.route=e,this.currentPage$=this.route.paramMap.pipe((0,l.U)(o=>+(o.get("page")||1))),this.totalPosts$=this.route.data.pipe((0,l.U)(o=>o.posts)),this.yearPostsCount$=this.totalPosts$.pipe((0,l.U)(o=>o.reduce((n,h)=>{const r=h.date.substr(0,4);return n[r]||(n[r]=0),n[r]+=1,n},{}))),this.posts$=this.currentPage$.pipe((0,B.w)(o=>this.totalPosts$.pipe((0,l.U)(n=>(0,Q.$)(o,10,n)))),(0,B.w)(o=>this.yearPostsCount$.pipe((0,l.U)(n=>o.reduce((h,r)=>{const d=r.date.slice(0,4);let C=h.find(S=>S.year===d);return C?C.posts.push(r):h.push({year:d,postCount:n[d],posts:[r]}),h},[]))))),this.totalPage$=this.totalPosts$.pipe((0,l.U)(o=>Math.ceil(Object.keys(o).length/10)))}ngOnInit(){}}c.\u0275fac=function(e){return new(e||c)(t.Y36(m.gz))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-blog-archives"]],decls:6,vars:9,consts:[[4,"ngFor","ngForOf"],["appearance","outlined",1,"pagination"],["linkBase","/blog/archives/page",3,"currentPage","totalPage"],[1,"year-header","mat-elevation-z4"],["appearance","outlined",1,"blog-post"],[1,"blog-post-title"],[3,"routerLink"],[1,"blog-post-subtitle"],[3,"postMeta"],[1,"blog-post-content"],[3,"innerHTML"],["mat-raised-button","","color","primary",1,"read-more",3,"routerLink"]],template:function(e,o){1&e&&(t.YNc(0,E,7,3,"ng-container",0),t.ALo(1,"push"),t.TgZ(2,"mat-card",1),t._UZ(3,"app-pagination",2),t.ALo(4,"push"),t.ALo(5,"push"),t.qZA()),2&e&&(t.Q6J("ngForOf",t.lcZ(1,3,o.posts$)),t.xp6(3),t.Q6J("currentPage",t.lcZ(4,5,o.currentPage$)||1)("totalPage",t.lcZ(5,7,o.totalPage$)||1))},dependencies:[A.sg,m.rH,J.Q,F.z,P.Ye,p.a8,p.dn,p.rt,p.$j,p.n5,Z.Hw,f.zs,x.y,y.f]});const O=[{path:"",resolve:{posts:i},component:c},{path:"page/:page",resolve:{posts:i},component:c}];class g{}g.\u0275fac=function(e){return new(e||g)},g.\u0275mod=t.oAB({type:g}),g.\u0275inj=t.cJS({imports:[m.Bz.forChild(O),m.Bz]});class u{}u.\u0275fac=function(e){return new(e||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({imports:[A.ez,g,U.u,T.v,M.E,P.g0,p.QW,Z.Ps,f.ot,y.p]})}}]);