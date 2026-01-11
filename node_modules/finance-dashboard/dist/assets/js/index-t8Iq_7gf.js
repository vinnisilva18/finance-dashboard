const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Dashboard-DgfV1Lr2.js","./vendor-LfCTP-hD.js","./formatters-B8MMj10x.js","./localStorageService-Bm_UUCrj.js","./charts-BaeV1Cpd.js","../css/Dashboard-YSwo2sYB.css","./Login-Dv-hkvIy.js","../css/Login-BKZZjIW8.css","./Transactions-BPMuwTf-.js","../css/Transactions-Cyjd7dfb.css","./Categories-CJKzdUxu.js","../css/Categories-CYc4kekm.css","./CreditCards-oLGRpDJy.js","../css/CreditCards-8ERWYBXg.css","./Goals-DHOGkBS0.js","../css/Goals-BhusufqO.css","./Reports-DT-L27rn.js","../css/Reports-_LHgFwNH.css","./Currency-zDbucuUo.js","../css/Currency-CjwCFRnB.css","./Profile-ouHVYfDT.js","./utils-B9ygI19o.js","../css/Profile-BjUedMR8.css","./NotFound-DzjqExFp.js","../css/NotFound-DByq-iLG.css"])))=>i.map(i=>d[i]);
import{d as W,r as w,c as I,u as ee,o as te,w as ae,a as L,b as j,e as a,n as V,f,v as g,g as U,h as oe,t as q,i as C,j as b,k as N,l as se,m as E,p as ne,q as re,s as T,x as le,y as ie}from"./vendor-LfCTP-hD.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();const S=typeof window<"u",Z=W("auth",()=>{const n=w(null),r=w(S?localStorage.getItem("token"):null),i=w(!1),l=w(null),s=I(()=>!!r.value);return{user:n,token:r,loading:i,error:l,isAuthenticated:s,login:async c=>{i.value=!0,l.value=null;try{if(c.email==="demo@financontrol.com"&&c.password==="demopass123"){await new Promise(m=>setTimeout(m,500));const p={id:1,name:"Demo User",email:"demo@financontrol.com"},v="mock-demo-jwt-token-"+Date.now();return r.value=v,n.value=p,S&&(localStorage.setItem("token",v),localStorage.setItem("user",JSON.stringify(p))),{success:!0,data:{token:v,user:p}}}if(c.email==="admin@admin.com"&&c.password==="123"){await new Promise(m=>setTimeout(m,500));const p={id:1,name:"Admin User",email:"admin@admin.com"},v="mock-admin-jwt-token-"+Date.now();return r.value=v,n.value=p,S&&(localStorage.setItem("token",v),localStorage.setItem("user",JSON.stringify(p))),{success:!0,data:{token:v,user:p}}}const d=await fetch("http://localhost:3000/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!d.ok)throw new Error("Login failed");const k=await d.json();return r.value=k.token,n.value=k.user,S&&(localStorage.setItem("token",k.token),localStorage.setItem("user",JSON.stringify(k.user))),{success:!0,data:k}}catch(d){return l.value=d.message||"Login failed",{success:!1,message:d.message}}finally{i.value=!1}},register:async c=>{i.value=!0,l.value=null;try{const d=await fetch("http://localhost:3000/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!d.ok)throw new Error("Registration failed");const k=await d.json();return r.value=k.token,n.value=k.user,S&&(localStorage.setItem("token",k.token),localStorage.setItem("user",JSON.stringify(k.user))),{success:!0,data:k}}catch(d){return l.value=d.message||"Registration failed",{success:!1,message:d.message}}finally{i.value=!1}},logout:()=>{r.value=null,n.value=null,S&&(localStorage.removeItem("token"),localStorage.removeItem("user"))},initialize:()=>{if(S){const c=localStorage.getItem("user");if(c)try{n.value=JSON.parse(c)}catch(d){console.error("Error parsing stored user:",d),localStorage.removeItem("user")}}},updateUser:c=>{n.value={...n.value,...c},S&&localStorage.setItem("user",JSON.stringify(n.value))}}}),ce=(n,r)=>{const i=n.__vccOpts||n;for(const[l,s]of r)i[l]=s;return i},ue={class:"app-container"},de={class:"sidebar-header"},he={class:"logo"},pe={class:"sidebar-content"},ye={class:"user-info"},ve=["title"],ke={class:"user-details"},me={class:"sidebar-nav"},fe={class:"nav-text"},ge={class:"nav-text"},Me={class:"nav-text"},we={class:"nav-text"},xe={class:"nav-text"},Ce={class:"nav-text"},_e={class:"nav-text"},be={class:"nav-text"},Se={class:"sidebar-footer"},Ae=["title"],Pe={key:0,class:"top-bar"},Le={class:"page-title"},Ee={class:"top-bar-actions"},je={class:"notifications-btn"},qe={key:0,class:"notification-badge"},Oe={class:"page-container"},Ie={key:3,class:"loading-overlay"},ze={__name:"App",setup(n){const r=ee(),i=se(),l=Z(),s=w(!1),o=w(!1),u=w(null),h=w(!1),x=w(3),y=w("#6366f1"),c=I(()=>l.isAuthenticated),d=I(()=>l.user),k=I(()=>{var A;return(A=d.value)!=null&&A.name?d.value.name.split(" ").map(t=>t[0]).join("").toUpperCase().slice(0,2):"U"}),p=I(()=>({"/":"Painel","/transactions":"Transações","/categories":"Categorias","/credit-cards":"Cartões de Crédito","/goals":"Metas Financeiras","/reports":"Relatórios","/currency":"Câmbio","/profile":"Perfil","/login":"Login"})[r.path]||"FinancePro"),v=()=>{o.value=!o.value},m=()=>{s.value=!s.value},Q=()=>{l.logout(),i.push("/login"),s.value=!1},X=()=>{u.value=null};return te(()=>{const A=localStorage.getItem("userColor");A&&(y.value=A)}),ae(()=>r.path,()=>{s.value=!1}),(A,t)=>{var H,R,D;const _=N("router-link"),Y=N("router-view");return E(),L("div",ue,[c.value?(E(),L("aside",{key:0,class:V(["sidebar",{open:s.value,collapsed:o.value}])},[a("div",de,[a("div",he,[t[9]||(t[9]=a("div",{class:"logo-icon"},"💰",-1)),f(a("h1",null,[...t[8]||(t[8]=[U("Finance",-1),a("span",null,"Pro",-1)])],512),[[g,!o.value]])]),a("button",{onClick:v,class:"sidebar-collapse-desktop"},[...t[10]||(t[10]=[a("span",null,"☰",-1)])]),a("button",{onClick:m,class:"sidebar-toggle"},[...t[11]||(t[11]=[a("span",null,"×",-1)])])]),a("div",pe,[a("div",ye,[a("div",{class:"avatar",style:oe({backgroundColor:y.value}),title:(H=d.value)==null?void 0:H.name},q(k.value),13,ve),f(a("div",ke,[a("h3",null,q(((R=d.value)==null?void 0:R.name)||"Usuário"),1),a("p",null,q(((D=d.value)==null?void 0:D.email)||"user@example.com"),1)],512),[[g,!o.value]])]),a("nav",me,[C(_,{to:"/",class:"nav-item","exact-active-class":"active",onClick:t[0]||(t[0]=P=>s.value=!1),title:o.value?"Painel":""},{default:b(()=>[t[12]||(t[12]=a("span",{class:"nav-icon"},"📊",-1)),f(a("span",fe,"Painel",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/transactions",class:"nav-item","active-class":"active",onClick:t[1]||(t[1]=P=>s.value=!1),title:o.value?"Transações":""},{default:b(()=>[t[13]||(t[13]=a("span",{class:"nav-icon"},"💳",-1)),f(a("span",ge,"Transações",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/categories",class:"nav-item","active-class":"active",onClick:t[2]||(t[2]=P=>s.value=!1),title:o.value?"Categorias":""},{default:b(()=>[t[14]||(t[14]=a("span",{class:"nav-icon"},"🏷️",-1)),f(a("span",Me,"Categorias",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/credit-cards",class:"nav-item","active-class":"active",onClick:t[3]||(t[3]=P=>s.value=!1),title:o.value?"Cartões":""},{default:b(()=>[t[15]||(t[15]=a("span",{class:"nav-icon"},"💳",-1)),f(a("span",we,"Cartões",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/goals",class:"nav-item","active-class":"active",onClick:t[4]||(t[4]=P=>s.value=!1),title:o.value?"Metas":""},{default:b(()=>[t[16]||(t[16]=a("span",{class:"nav-icon"},"🎯",-1)),f(a("span",xe,"Metas",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/reports",class:"nav-item","active-class":"active",onClick:t[5]||(t[5]=P=>s.value=!1),title:o.value?"Relatórios":""},{default:b(()=>[t[17]||(t[17]=a("span",{class:"nav-icon"},"📈",-1)),f(a("span",Ce,"Relatórios",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/currency",class:"nav-item","active-class":"active",onClick:t[6]||(t[6]=P=>s.value=!1),title:o.value?"Câmbio":""},{default:b(()=>[t[18]||(t[18]=a("span",{class:"nav-icon"},"🌎",-1)),f(a("span",_e,"Câmbio",512),[[g,!o.value]])]),_:1},8,["title"]),C(_,{to:"/profile",class:"nav-item","active-class":"active",onClick:t[7]||(t[7]=P=>s.value=!1),title:o.value?"Perfil":""},{default:b(()=>[t[19]||(t[19]=a("span",{class:"nav-icon"},"👤",-1)),f(a("span",be,"Perfil",512),[[g,!o.value]])]),_:1},8,["title"])]),a("div",Se,[a("button",{onClick:Q,class:"logout-btn",title:o.value?"Sair":""},[t[20]||(t[20]=a("span",{class:"logout-icon"},"🚪",-1)),f(a("span",null,"Sair",512),[[g,!o.value]])],8,Ae)])])],2)):j("",!0),c.value&&s.value?(E(),L("div",{key:1,class:"sidebar-overlay",onClick:m})):j("",!0),a("main",{class:V(["main-content",{"with-sidebar":c.value,collapsed:o.value}])},[c.value?(E(),L("header",Pe,[a("button",{onClick:m,class:"menu-toggle"},[...t[21]||(t[21]=[a("span",null,"☰",-1)])]),a("h2",Le,q(p.value),1),a("div",Ee,[a("button",je,[t[22]||(t[22]=a("span",null,"🔔",-1)),x.value>0?(E(),L("span",qe,q(x.value),1)):j("",!0)])])])):j("",!0),a("div",Oe,[C(Y)])],2),u.value?(E(),L("div",{key:2,class:V(["notification-toast",u.value.type])},[U(q(u.value.message)+" ",1),a("button",{onClick:X,class:"toast-close"},"×")],2)):j("",!0),h.value?(E(),L("div",Ie,[...t[23]||(t[23]=[a("div",{class:"spinner"},null,-1),a("p",null,"Carregando...",-1)])])):j("",!0)])}}},Ve=ce(ze,[["__scopeId","data-v-59832279"]]),Te="modulepreload",He=function(n,r){return new URL(n,r).href},B={},M=function(r,i,l){let s=Promise.resolve();if(i&&i.length>0){const u=document.getElementsByTagName("link"),h=document.querySelector("meta[property=csp-nonce]"),x=(h==null?void 0:h.nonce)||(h==null?void 0:h.getAttribute("nonce"));s=Promise.allSettled(i.map(y=>{if(y=He(y,l),y in B)return;B[y]=!0;const c=y.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(!!l)for(let v=u.length-1;v>=0;v--){const m=u[v];if(m.href===y&&(!c||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${y}"]${d}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":Te,c||(p.as="script"),p.crossOrigin="",p.href=y,x&&p.setAttribute("nonce",x),document.head.appendChild(p),c)return new Promise((v,m)=>{p.addEventListener("load",v),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${y}`)))})}))}function o(u){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=u,window.dispatchEvent(h),!h.defaultPrevented)throw u}return s.then(u=>{for(const h of u||[])h.status==="rejected"&&o(h.reason);return r().catch(o)})},Re=[{path:"/",name:"Dashboard",component:()=>M(()=>import("./Dashboard-DgfV1Lr2.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),meta:{requiresAuth:!0}},{path:"/login",name:"Login",component:()=>M(()=>import("./Login-Dv-hkvIy.js"),__vite__mapDeps([6,1,7]),import.meta.url)},{path:"/transactions",name:"Transactions",component:()=>M(()=>import("./Transactions-BPMuwTf-.js"),__vite__mapDeps([8,1,3,2,9]),import.meta.url),meta:{requiresAuth:!0}},{path:"/categories",name:"Categories",component:()=>M(()=>import("./Categories-CJKzdUxu.js"),__vite__mapDeps([10,1,3,2,11]),import.meta.url),meta:{requiresAuth:!0}},{path:"/credit-cards",name:"CreditCards",component:()=>M(()=>import("./CreditCards-oLGRpDJy.js"),__vite__mapDeps([12,1,3,2,13]),import.meta.url),meta:{requiresAuth:!0}},{path:"/goals",name:"Goals",component:()=>M(()=>import("./Goals-DHOGkBS0.js"),__vite__mapDeps([14,1,3,2,15]),import.meta.url),meta:{requiresAuth:!0}},{path:"/reports",name:"Reports",component:()=>M(()=>import("./Reports-DT-L27rn.js"),__vite__mapDeps([16,1,3,2,17]),import.meta.url),meta:{requiresAuth:!0}},{path:"/currency",name:"Currency",component:()=>M(()=>import("./Currency-zDbucuUo.js"),__vite__mapDeps([18,1,4,3,2,19]),import.meta.url),meta:{requiresAuth:!0}},{path:"/profile",name:"Profile",component:()=>M(()=>import("./Profile-ouHVYfDT.js"),__vite__mapDeps([20,1,21,3,22]),import.meta.url),meta:{requiresAuth:!0}},{path:"/:pathMatch(.*)*",name:"NotFound",component:()=>M(()=>import("./NotFound-DzjqExFp.js"),__vite__mapDeps([23,1,24]),import.meta.url)}],K=ne({history:re(),routes:Re});K.beforeEach((n,r,i)=>{const l=Z();l.initialize(),n.meta.requiresAuth&&!l.isAuthenticated?i("/login"):n.path==="/login"&&l.isAuthenticated?i("/"):i()});/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),De=n=>n.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,i,l)=>l?l.toUpperCase():i.toLowerCase()),Ue=n=>{const r=De(n);return r.charAt(0).toUpperCase()+r.slice(1)},Ne=(...n)=>n.filter((r,i,l)=>!!r&&r.trim()!==""&&l.indexOf(r)===i).join(" ").trim(),F=n=>n==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var O={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=({name:n,iconNode:r,absoluteStrokeWidth:i,"absolute-stroke-width":l,strokeWidth:s,"stroke-width":o,size:u=O.width,color:h=O.stroke,...x},{slots:y})=>T("svg",{...O,...x,width:u,height:u,stroke:h,"stroke-width":F(i)||F(l)||i===!0||l===!0?Number(s||o||O["stroke-width"])*24/Number(u):s||o||O["stroke-width"],class:Ne("lucide",x.class,...n?[`lucide-${$(Ue(n))}-icon`,`lucide-${$(n)}`]:["lucide-icon"])},[...r.map(c=>T(...c)),...y.default?[y.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e=(n,r)=>(i,{slots:l,attrs:s})=>T(Be,{...s,...i,iconNode:r,name:n},l);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=e("bell-ring",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=e("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=e("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=e("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=e("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=e("car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=e("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=e("chart-pie",[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=e("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=e("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=e("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=e("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=e("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=e("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=e("coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=e("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=e("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=e("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=e("ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=e("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=e("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=e("film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=e("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=e("gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=e("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=e("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=e("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=e("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=e("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=e("languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=e("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=e("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=e("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=e("monitor-smartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=e("moon",[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=e("palette",[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=e("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=e("piggy-bank",[["path",{d:"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",key:"1piglc"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M2 8v1a2 2 0 0 0 2 2h1",key:"1env43"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=e("plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=e("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=e("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=e("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=e("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=e("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=e("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ot=e("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=e("shopping-cart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=e("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=e("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=e("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=e("sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=e("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=e("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ut=e("trending-down",[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=e("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=e("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=e("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=e("utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=e("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=e("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Zt={Home:J,CreditCard:nt,PieChart:Xe,Target:Rt,BarChart3:Qe,Globe:yt,User:$t,LogOut:G,Plus:At,Download:lt,Bell:Fe,Settings:jt,TrendingUp:Nt,TrendingDown:Ut,DollarSign:rt,Wallet:Jt,PiggyBank:bt,Calendar:Ze,ShoppingCart:It,Utensils:Ft,Car:Ke,HomeIcon:J,Heart:vt,BookOpen:Je,Film:dt,Coffee:st,Smartphone:zt,Plane:St,Gift:pt,MoreHorizontal:it,ChevronRight:We,Check:Ye,X:Gt,Edit:Vt,Trash2:Dt,Filter:ht,Search:Et,Eye:ut,EyeOff:ct,Lock:gt,Mail:Mt,Phone:_t,CalendarDays:Ge,BellRing:$e,Shield:Ot,Key:mt,MonitorSmartphone:wt,LogOutIcon:G,AlertCircle:et,CheckCircle:tt,Info:kt,Star:Tt,Clock:ot,Upload:Bt,Share2:qt,Printer:Pt,RefreshCw:Lt,HelpCircle:at,Moon:xt,Sun:Ht,Palette:Ct,Languages:ft},z=le(Ve),Kt=ie();z.use(Kt);z.use(K);Object.entries(Zt).forEach(([n,r])=>{z.component(n,r)});z.mount("#app");export{ce as _,Z as u};
