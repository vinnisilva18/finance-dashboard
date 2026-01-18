const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/Dashboard-CaEYFje2.js","assets/js/vendor-BNDw7TD6.js","assets/js/formatters-B8MMj10x.js","assets/js/localStorageService-Bm_UUCrj.js","assets/js/charts-BaeV1Cpd.js","assets/js/utils-B9ygI19o.js","assets/css/Dashboard-TUWHTdVx.css","assets/js/Login-BUjvDcY9.js","assets/css/Login-Cgm47Wit.css","assets/js/Transactions-DyEKGJTt.js","assets/js/category-C_8PkLCj.js","assets/css/Transactions-uNGq-3Ub.css","assets/js/Categories-D08CcUe8.js","assets/css/Categories-DT_ZrXag.css","assets/js/CreditCards-BlAwZae-.js","assets/css/CreditCards-8ERWYBXg.css","assets/js/Goals-BFkppwGT.js","assets/css/Goals-BhusufqO.css","assets/js/Reports-DNH5twoq.js","assets/css/Reports-_LHgFwNH.css","assets/js/Currency-CmLIEl32.js","assets/css/Currency-CjwCFRnB.css","assets/js/Profile-3acVTTPg.js","assets/css/Profile-BjUedMR8.css","assets/js/NotFound-DMTK34it.js","assets/css/NotFound-DByq-iLG.css"])))=>i.map(i=>d[i]);
import{d as te,r as w,c as H,u as ae,o as se,w as oe,a as E,b as q,e as s,n as R,f as g,v as f,g as B,h as ne,t as j,i as _,j as A,k as F,l as re,m as I,p as le,q as ie,s as D,x as ce,y as ue}from"./vendor-BNDw7TD6.js";import{a as de}from"./utils-B9ygI19o.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function l(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=l(r);fetch(r.href,n)}})();const z=de.create({baseURL:"https://finance-dashboard-rich.vercel.app/api",headers:{"Content-Type":"application/json",Accept:"application/json"}});z.interceptors.request.use(t=>{const o=localStorage.getItem("token");return o&&o!=="undefined"&&o!=="null"&&(t.headers.Authorization=`Bearer ${o.trim()}`),t});z.interceptors.response.use(t=>t,t=>(t.response&&(t.response.status===401||t.response.status===403)&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.pathname.includes("/login")||(window.location.href="/login")),console.error("API Error:",t.response||t.message),Promise.reject(t)));const J={get(t,o){return z.get(t,{params:o})},post(t,o){return z.post(t,o)},put(t,o){return z.put(t,o)},delete(t){return z.delete(t)}},S=typeof window<"u",Y=te("auth",()=>{const t=w(null),o=w(S?localStorage.getItem("token"):null),l=w(!1),i=w(null),r=H(()=>!!o.value);return{user:t,token:o,loading:l,error:i,isAuthenticated:r,login:async d=>{var u,x;l.value=!0,i.value=null;try{if(d.email==="demo@financontrol.com"&&d.password==="demopass123"){await new Promise(O=>setTimeout(O,500));const m={id:1,name:"Demo User",email:"demo@financontrol.com"},C="mock-demo-jwt-token-"+Date.now();return o.value=C,t.value=m,S&&(localStorage.setItem("token",C),localStorage.setItem("user",JSON.stringify(m))),{success:!0,data:{token:C,user:m}}}if(d.email==="admin@admin.com"&&d.password==="123"){await new Promise(O=>setTimeout(O,500));const m={id:1,name:"Admin User",email:"admin@admin.com"},C="mock-admin-jwt-token-"+Date.now();return o.value=C,t.value=m,S&&(localStorage.setItem("token",C),localStorage.setItem("user",JSON.stringify(m))),{success:!0,data:{token:C,user:m}}}const h=(await J.post("/auth/login",d)).data;return o.value=h.token,t.value=h.user,S&&(localStorage.setItem("token",h.token),localStorage.setItem("user",JSON.stringify(h.user))),{success:!0,data:h}}catch(k){const h=((x=(u=k.response)==null?void 0:u.data)==null?void 0:x.message)||k.message||"Login failed";return i.value=h,{success:!1,message:h}}finally{l.value=!1}},register:async d=>{var u,x;l.value=!0,i.value=null;try{const h=(await J.post("/auth/register",d)).data;return o.value=h.token,t.value=h.user,S&&(localStorage.setItem("token",h.token),localStorage.setItem("user",JSON.stringify(h.user))),{success:!0,data:h}}catch(k){const h=((x=(u=k.response)==null?void 0:u.data)==null?void 0:x.message)||k.message||"Registration failed";return i.value=h,{success:!1,message:h}}finally{l.value=!1}},logout:()=>{o.value=null,t.value=null,S&&(localStorage.removeItem("token"),localStorage.removeItem("user"))},initialize:()=>{if(S){const d=localStorage.getItem("user");if(d)try{t.value=JSON.parse(d)}catch(u){console.error("Error parsing stored user:",u),localStorage.removeItem("user")}}},updateUser:d=>{t.value={...t.value,...d},S&&localStorage.setItem("user",JSON.stringify(t.value))}}}),he=(t,o)=>{const l=t.__vccOpts||t;for(const[i,r]of o)l[i]=r;return l},pe={class:"app-container"},ye={class:"sidebar-header"},ve={class:"logo"},ke={class:"sidebar-content"},me={class:"user-info"},ge=["title"],fe={class:"user-details"},Me={class:"sidebar-nav"},we={class:"nav-text"},xe={class:"nav-text"},Ce={class:"nav-text"},_e={class:"nav-text"},be={class:"nav-text"},Ae={class:"nav-text"},Se={class:"nav-text"},Pe={class:"nav-text"},Le={class:"sidebar-footer"},Ee=["title"],Ie={key:0,class:"top-bar"},qe={class:"page-title"},je={class:"top-bar-actions"},ze={class:"notifications-btn"},Oe={key:0,class:"notification-badge"},Ve={class:"page-container"},He={key:3,class:"loading-overlay"},Te={__name:"App",setup(t){const o=ae(),l=re(),i=Y(),r=w(!1),n=w(!1),c=w(null),y=w(!1),p=w(3),v=w("#6366f1"),d=H(()=>i.isAuthenticated),u=H(()=>i.user),x=H(()=>{var P;return(P=u.value)!=null&&P.name?u.value.name.split(" ").map(a=>a[0]).join("").toUpperCase().slice(0,2):"U"}),k=H(()=>({"/":"Painel","/transactions":"Transações","/categories":"Categorias","/credit-cards":"Cartões de Crédito","/goals":"Metas Financeiras","/reports":"Relatórios","/currency":"Câmbio","/profile":"Perfil","/login":"Login"})[o.path]||"FinancePro"),h=()=>{n.value=!n.value},m=()=>{r.value=!r.value},C=()=>{i.logout(),l.push("/login"),r.value=!1},O=()=>{c.value=null};return se(()=>{const P=localStorage.getItem("userColor");P&&(v.value=P)}),oe(()=>o.path,()=>{r.value=!1}),(P,a)=>{var U,$,N;const b=F("router-link"),ee=F("router-view");return I(),E("div",pe,[d.value?(I(),E("aside",{key:0,class:R(["sidebar",{open:r.value,collapsed:n.value}])},[s("div",ye,[s("div",ve,[a[9]||(a[9]=s("div",{class:"logo-icon"},"💰",-1)),g(s("h1",null,[...a[8]||(a[8]=[B("Finance",-1),s("span",null,"Pro",-1)])],512),[[f,!n.value]])]),s("button",{onClick:h,class:"sidebar-collapse-desktop"},[...a[10]||(a[10]=[s("span",null,"☰",-1)])]),s("button",{onClick:m,class:"sidebar-toggle"},[...a[11]||(a[11]=[s("span",null,"×",-1)])])]),s("div",ke,[s("div",me,[s("div",{class:"avatar",style:ne({backgroundColor:v.value}),title:(U=u.value)==null?void 0:U.name},j(x.value),13,ge),g(s("div",fe,[s("h3",null,j((($=u.value)==null?void 0:$.name)||"Usuário"),1),s("p",null,j(((N=u.value)==null?void 0:N.email)||"user@example.com"),1)],512),[[f,!n.value]])]),s("nav",Me,[_(b,{to:"/",class:"nav-item","exact-active-class":"active",onClick:a[0]||(a[0]=L=>r.value=!1),title:n.value?"Painel":""},{default:A(()=>[a[12]||(a[12]=s("span",{class:"nav-icon"},"📊",-1)),g(s("span",we,"Painel",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/transactions",class:"nav-item","active-class":"active",onClick:a[1]||(a[1]=L=>r.value=!1),title:n.value?"Transações":""},{default:A(()=>[a[13]||(a[13]=s("span",{class:"nav-icon"},"💳",-1)),g(s("span",xe,"Transações",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/categories",class:"nav-item","active-class":"active",onClick:a[2]||(a[2]=L=>r.value=!1),title:n.value?"Categorias":""},{default:A(()=>[a[14]||(a[14]=s("span",{class:"nav-icon"},"🏷️",-1)),g(s("span",Ce,"Categorias",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/credit-cards",class:"nav-item","active-class":"active",onClick:a[3]||(a[3]=L=>r.value=!1),title:n.value?"Cartões":""},{default:A(()=>[a[15]||(a[15]=s("span",{class:"nav-icon"},"💳",-1)),g(s("span",_e,"Cartões",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/goals",class:"nav-item","active-class":"active",onClick:a[4]||(a[4]=L=>r.value=!1),title:n.value?"Metas":""},{default:A(()=>[a[16]||(a[16]=s("span",{class:"nav-icon"},"🎯",-1)),g(s("span",be,"Metas",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/reports",class:"nav-item","active-class":"active",onClick:a[5]||(a[5]=L=>r.value=!1),title:n.value?"Relatórios":""},{default:A(()=>[a[17]||(a[17]=s("span",{class:"nav-icon"},"📈",-1)),g(s("span",Ae,"Relatórios",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/currency",class:"nav-item","active-class":"active",onClick:a[6]||(a[6]=L=>r.value=!1),title:n.value?"Câmbio":""},{default:A(()=>[a[18]||(a[18]=s("span",{class:"nav-icon"},"🌎",-1)),g(s("span",Se,"Câmbio",512),[[f,!n.value]])]),_:1},8,["title"]),_(b,{to:"/profile",class:"nav-item","active-class":"active",onClick:a[7]||(a[7]=L=>r.value=!1),title:n.value?"Perfil":""},{default:A(()=>[a[19]||(a[19]=s("span",{class:"nav-icon"},"👤",-1)),g(s("span",Pe,"Perfil",512),[[f,!n.value]])]),_:1},8,["title"])]),s("div",Le,[s("button",{onClick:C,class:"logout-btn",title:n.value?"Sair":""},[a[20]||(a[20]=s("span",{class:"logout-icon"},"🚪",-1)),g(s("span",null,"Sair",512),[[f,!n.value]])],8,Ee)])])],2)):q("",!0),d.value&&r.value?(I(),E("div",{key:1,class:"sidebar-overlay",onClick:m})):q("",!0),s("main",{class:R(["main-content",{"with-sidebar":d.value,collapsed:n.value}])},[d.value?(I(),E("header",Ie,[s("button",{onClick:m,class:"menu-toggle"},[...a[21]||(a[21]=[s("span",null,"☰",-1)])]),s("h2",qe,j(k.value),1),s("div",je,[s("button",ze,[a[22]||(a[22]=s("span",null,"🔔",-1)),p.value>0?(I(),E("span",Oe,j(p.value),1)):q("",!0)])])])):q("",!0),s("div",Ve,[_(ee)])],2),c.value?(I(),E("div",{key:2,class:R(["notification-toast",c.value.type])},[B(j(c.value.message)+" ",1),s("button",{onClick:O,class:"toast-close"},"×")],2)):q("",!0),y.value?(I(),E("div",He,[...a[23]||(a[23]=[s("div",{class:"spinner"},null,-1),s("p",null,"Carregando...",-1)])])):q("",!0)])}}},Re=he(Te,[["__scopeId","data-v-b1978c44"]]),De="modulepreload",Ue=function(t){return"/"+t},G={},M=function(o,l,i){let r=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),y=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));r=Promise.allSettled(l.map(p=>{if(p=Ue(p),p in G)return;G[p]=!0;const v=p.endsWith(".css"),d=v?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${d}`))return;const u=document.createElement("link");if(u.rel=v?"stylesheet":De,v||(u.as="script"),u.crossOrigin="",u.href=p,y&&u.setAttribute("nonce",y),document.head.appendChild(u),v)return new Promise((x,k)=>{u.addEventListener("load",x),u.addEventListener("error",()=>k(new Error(`Unable to preload CSS for ${p}`)))})}))}function n(c){const y=new Event("vite:preloadError",{cancelable:!0});if(y.payload=c,window.dispatchEvent(y),!y.defaultPrevented)throw c}return r.then(c=>{for(const y of c||[])y.status==="rejected"&&n(y.reason);return o().catch(n)})},$e=[{path:"/",name:"Dashboard",component:()=>M(()=>import("./Dashboard-CaEYFje2.js"),__vite__mapDeps([0,1,2,3,4,5,6])),meta:{requiresAuth:!0}},{path:"/login",name:"Login",component:()=>M(()=>import("./Login-BUjvDcY9.js"),__vite__mapDeps([7,1,5,8]))},{path:"/transactions",name:"Transactions",component:()=>M(()=>import("./Transactions-DyEKGJTt.js"),__vite__mapDeps([9,1,10,2,5,11])),meta:{requiresAuth:!0}},{path:"/categories",name:"Categories",component:()=>M(()=>import("./Categories-D08CcUe8.js"),__vite__mapDeps([12,1,10,2,5,13])),meta:{requiresAuth:!0}},{path:"/credit-cards",name:"CreditCards",component:()=>M(()=>import("./CreditCards-BlAwZae-.js"),__vite__mapDeps([14,1,3,2,5,15])),meta:{requiresAuth:!0}},{path:"/goals",name:"Goals",component:()=>M(()=>import("./Goals-BFkppwGT.js"),__vite__mapDeps([16,1,3,2,5,17])),meta:{requiresAuth:!0}},{path:"/reports",name:"Reports",component:()=>M(()=>import("./Reports-DNH5twoq.js"),__vite__mapDeps([18,1,3,2,5,19])),meta:{requiresAuth:!0}},{path:"/currency",name:"Currency",component:()=>M(()=>import("./Currency-CmLIEl32.js"),__vite__mapDeps([20,1,4,3,2,5,21])),meta:{requiresAuth:!0}},{path:"/profile",name:"Profile",component:()=>M(()=>import("./Profile-3acVTTPg.js"),__vite__mapDeps([22,1,5,3,23])),meta:{requiresAuth:!0}},{path:"/:pathMatch(.*)*",name:"NotFound",component:()=>M(()=>import("./NotFound-DMTK34it.js"),__vite__mapDeps([24,1,5,25]))}],W=le({history:ie(),routes:$e});W.beforeEach((t,o,l)=>{const i=Y();t.meta.requiresAuth&&!i.isAuthenticated?l("/login"):t.path==="/login"&&i.isAuthenticated?l("/"):l()});/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Ne=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(o,l,i)=>i?i.toUpperCase():l.toLowerCase()),Be=t=>{const o=Ne(t);return o.charAt(0).toUpperCase()+o.slice(1)},Fe=(...t)=>t.filter((o,l,i)=>!!o&&o.trim()!==""&&i.indexOf(o)===l).join(" ").trim(),K=t=>t==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var V={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=({name:t,iconNode:o,absoluteStrokeWidth:l,"absolute-stroke-width":i,strokeWidth:r,"stroke-width":n,size:c=V.width,color:y=V.stroke,...p},{slots:v})=>D("svg",{...V,...p,width:c,height:c,stroke:y,"stroke-width":K(l)||K(i)||l===!0||i===!0?Number(r||n||V["stroke-width"])*24/Number(c):r||n||V["stroke-width"],class:Fe("lucide",p.class,...t?[`lucide-${Z(Be(t))}-icon`,`lucide-${Z(t)}`]:["lucide-icon"])},[...o.map(d=>D(...d)),...v.default?[v.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e=(t,o)=>(l,{slots:i,attrs:r})=>D(Je,{...r,...l,iconNode:o,name:t},i);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=e("bell-ring",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=e("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=e("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=e("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=e("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=e("car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=e("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=e("chart-pie",[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=e("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=e("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=e("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=e("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=e("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=e("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=e("coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=e("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=e("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=e("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=e("ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=e("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=e("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=e("film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=e("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=e("gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=e("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=e("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=e("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=e("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=e("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=e("languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=e("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=e("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=e("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=e("monitor-smartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=e("moon",[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=e("palette",[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=e("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=e("piggy-bank",[["path",{d:"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",key:"1piglc"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M2 8v1a2 2 0 0 0 2 2h1",key:"1env43"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=e("plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=e("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=e("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=e("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=e("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=e("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ot=e("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=e("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=e("shopping-cart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=e("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=e("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=e("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ut=e("sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=e("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=e("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=e("trending-down",[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=e("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=e("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=e("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=e("utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kt=e("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=e("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Xt={Home:Q,CreditCard:it,PieChart:et,Target:$t,BarChart3:We,Globe:mt,User:Gt,LogOut:X,Plus:Et,Download:ut,Bell:Ze,Settings:zt,TrendingUp:Ft,TrendingDown:Bt,DollarSign:ct,Wallet:Kt,PiggyBank:Pt,Calendar:Xe,ShoppingCart:Ht,Utensils:Zt,Car:Ye,HomeIcon:Q,Heart:gt,BookOpen:Ke,Film:yt,Coffee:lt,Smartphone:Tt,Plane:Lt,Gift:kt,MoreHorizontal:dt,ChevronRight:at,Check:tt,X:Qt,Edit:Rt,Trash2:Nt,Filter:vt,Search:jt,Eye:pt,EyeOff:ht,Lock:xt,Mail:Ct,Phone:St,CalendarDays:Qe,BellRing:Ge,Shield:Vt,Key:Mt,MonitorSmartphone:_t,LogOutIcon:X,AlertCircle:st,CheckCircle:ot,Info:ft,Star:Dt,Clock:rt,Upload:Jt,Share2:Ot,Printer:It,RefreshCw:qt,HelpCircle:nt,Moon:bt,Sun:Ut,Palette:At,Languages:wt},T=ce(Re),Yt=ue();T.use(Yt);T.use(W);Object.entries(Xt).forEach(([t,o])=>{T.component(t,o)});T.mount("#app");export{he as _,J as a,Y as u};
