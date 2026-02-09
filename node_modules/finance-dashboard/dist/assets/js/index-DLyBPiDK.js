const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/Dashboard-BhBh5pjN.js","assets/js/vendor-kE9Pwckw.js","assets/js/formatters-B8MMj10x.js","assets/js/useCategories-Cpdvm93F.js","assets/js/useGoals-CB1BPfKQ.js","assets/js/localStorageService-Bm_UUCrj.js","assets/js/useCards-BHytCPHY.js","assets/js/charts-BaeV1Cpd.js","assets/js/utils-B9ygI19o.js","assets/css/Dashboard-DqLbthUK.css","assets/js/Login-yT6ne5wd.js","assets/css/Login-DeeWRp0F.css","assets/js/Transactions-BA-GsQJ9.js","assets/css/Transactions-SyJYPBRi.css","assets/js/Categories-ViBdJ2-Z.js","assets/css/Categories-CZfvBudu.css","assets/js/CreditCards-DrqvOpVH.js","assets/css/CreditCards-8ERWYBXg.css","assets/js/Goals-DubEaBXX.js","assets/css/Goals-BhusufqO.css","assets/js/Reports-BWJJqxtp.js","assets/css/Reports-_LHgFwNH.css","assets/js/Currency-DJbB2NX6.js","assets/css/Currency-CjwCFRnB.css","assets/js/Profile-C9RC8_k5.js","assets/css/Profile-BjUedMR8.css","assets/js/NotFound-DIA-MIx5.js","assets/css/NotFound-DByq-iLG.css"])))=>i.map(i=>d[i]);
import{d as Q,r as x,c as A,u as se,o as re,w as N,a as S,b as E,e as s,n as O,f as k,v,g as B,h as ie,t as P,i as M,j as b,k as F,l as ne,m as le,p as w,q as ce,s as de,x as R,y as he,z as ue}from"./vendor-kE9Pwckw.js";import{a as pe}from"./utils-B9ygI19o.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const h of i.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function l(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=l(o);fetch(o.href,i)}})();const I=pe.create({baseURL:"https://finance-dashboard-rich.vercel.app/api",headers:{"Content-Type":"application/json",Accept:"application/json"}});I.interceptors.request.use(e=>{const a=localStorage.getItem("token");return a&&a!=="undefined"&&a!=="null"&&(e.headers.Authorization=`Bearer ${a.trim()}`),e});I.interceptors.response.use(e=>e,e=>(e.response&&(e.response.status===401||e.response.status===403)&&(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.pathname.includes("/login")||(window.location.href="/login")),console.error("API Error:",e.response||e.message),Promise.reject(e)));const V={get(e,a){return I.get(e,{params:a})},post(e,a){return I.post(e,a)},put(e,a){return I.put(e,a)},delete(e){return I.delete(e)}},_=typeof window<"u";function ye(){if(!_)return null;const e=localStorage.getItem("user");if(e)try{return JSON.parse(e)}catch(a){return console.error("Erro ao processar dados do usuário.",a),localStorage.removeItem("user"),localStorage.removeItem("token"),null}return null}const X=Q("auth",{state:()=>({token:_&&localStorage.getItem("token")||null,user:ye(),error:null,loading:!1}),getters:{isAuthenticated:e=>!!e.token&&!!e.user,userName:e=>{var a;return((a=e.user)==null?void 0:a.name)||"Usuário"},userEmail:e=>{var a;return((a=e.user)==null?void 0:a.email)||""}},actions:{async login(e){var a,l;this.loading=!0,this.error=null;try{const n=await V.post("/auth/login",e),{token:o,user:i}=n.data;if(!o||!i)throw new Error("Resposta de login inválida do servidor.");return this.token=o,this.user=i,_&&(localStorage.setItem("token",o),localStorage.setItem("user",JSON.stringify(i))),{success:!0,data:n.data}}catch(n){const o=((l=(a=n.response)==null?void 0:a.data)==null?void 0:l.message)||"E-mail ou senha inválidos.";return this.error=o,{success:!1,message:o}}finally{this.loading=!1}},async register(e){var a,l;this.loading=!0,this.error=null;try{const n=await V.post("/auth/register",e),{token:o,user:i}=n.data;if(!o||!i)throw new Error("Resposta de registro inválida do servidor.");return this.token=o,this.user=i,_&&(localStorage.setItem("token",o),localStorage.setItem("user",JSON.stringify(i))),{success:!0,data:n.data}}catch(n){const o=((l=(a=n.response)==null?void 0:a.data)==null?void 0:l.message)||"Não foi possível criar a conta.";return this.error=o,{success:!1,message:o}}finally{this.loading=!1}},async fetchUser(){if(this.token)try{const e=await V.get("/auth/me");this.user=e.data,_&&localStorage.setItem("user",JSON.stringify(this.user))}catch(e){console.error("Falha ao buscar dados do usuário.",e),this.logout()}},logout(){this.token=null,this.user=null,this.error=null,this.loading=!1,_&&(localStorage.removeItem("token"),localStorage.removeItem("user"),localStorage.removeItem("sidebarCollapsed"))},updateUser(e){this.user={...this.user,...e},_&&localStorage.setItem("user",JSON.stringify(this.user))},initialize(){console.log("Auth store inicializado")}}}),ke=Q("ui",()=>{const e=x(!1),a=x(!1);return{isSidebarCollapsed:e,showMobileSidebar:a,toggleSidebar:()=>{e.value=!e.value},toggleSidebarMobile:()=>{a.value=!a.value},closeMobileSidebar:()=>{a.value=!1},resetSidebar:()=>{e.value=!1,a.value=!1}}}),ve=(e,a)=>{const l=e.__vccOpts||e;for(const[n,o]of a)l[n]=o;return l},me={class:"app-container"},ge={class:"sidebar-header"},fe={class:"logo"},Me={class:"sidebar-content"},be={class:"user-info"},Ce=["title"],Se={class:"user-details"},we={class:"sidebar-nav"},_e={class:"nav-text"},xe={class:"nav-text"},Ae={class:"nav-text"},Ee={class:"nav-text"},Pe={class:"nav-text"},Ie={class:"nav-text"},Le={class:"nav-text"},qe={class:"nav-text"},ze={class:"sidebar-footer"},je=["title"],He={key:0,class:"top-bar"},Oe={class:"page-title"},Ve={class:"top-bar-actions"},Re={class:"notifications-btn"},Te={key:0,class:"notification-badge"},Ue={class:"page-container"},De={key:3,class:"loading-overlay"},Ne={__name:"App",setup(e){const a=se(),l=le(),n=X(),o=ke();x(0);const i=x(null),h=x(!1),y=x(3),p=x("#6366f1"),m=A({get:()=>o.showMobileSidebar,set:d=>{o.showMobileSidebar=d}}),c=A({get:()=>o.isSidebarCollapsed,set:d=>{o.isSidebarCollapsed=d}}),u=A(()=>n.isAuthenticated),C=A(()=>n.user),j=A(()=>{var d;return(d=C.value)!=null&&d.name?C.value.name.split(" ").map(r=>r[0]).join("").toUpperCase().slice(0,2):"U"}),W=A(()=>({"/":"Painel","/transactions":"Transações","/categories":"Categorias","/credit-cards":"Cartões de Crédito","/goals":"Metas Financeiras","/reports":"Relatórios","/currency":"Câmbio","/profile":"Perfil","/login":"Login"})[a.path]||"FinancePro"),q=()=>{o.resetSidebar(),i.value=null,h.value=!1,p.value="#6366f1",typeof localStorage<"u"&&localStorage.removeItem("sidebarCollapsed")},ee=()=>{o.toggleSidebar(),u.value&&localStorage.setItem("sidebarCollapsed",o.isSidebarCollapsed.toString())},H=()=>{o.toggleSidebarMobile()},te=()=>{n.logout(),l.push("/login")},ae=()=>{i.value=null};return re(()=>{const d=localStorage.getItem("userColor");d&&(p.value=d),u.value?localStorage.getItem("sidebarCollapsed")==="true"&&setTimeout(()=>{o.isSidebarCollapsed=!0},100):q()}),N(()=>a.path,d=>{o.closeMobileSidebar(),d==="/login"&&q()}),N(u,(d,r)=>{console.log("Auth state changed:",{old:r,new:d}),d?d&&r===!1&&(q(),setTimeout(()=>{localStorage.getItem("sidebarCollapsed")==="true"&&(o.isSidebarCollapsed=!0)},150)):q()}),(d,r)=>{var T,U,D;const f=F("router-link"),oe=F("router-view");return w(),S("div",me,[u.value?(w(),S("aside",{key:0,class:O(["sidebar",{open:m.value,collapsed:c.value}])},[s("div",ge,[s("div",fe,[r[1]||(r[1]=s("div",{class:"logo-icon"},"💰",-1)),k(s("h1",null,[...r[0]||(r[0]=[B("Finance",-1),s("span",null,"Pro",-1)])],512),[[v,!c.value]])]),s("button",{onClick:ee,class:"sidebar-collapse-desktop"},[...r[2]||(r[2]=[s("span",null,"◁",-1)])]),s("button",{onClick:H,class:"sidebar-toggle"},[...r[3]||(r[3]=[s("span",null,"×",-1)])])]),s("div",Me,[s("div",be,[s("div",{class:"avatar",style:ie({backgroundColor:p.value}),title:(T=C.value)==null?void 0:T.name},P(j.value),13,Ce),k(s("div",Se,[s("h3",null,P(((U=C.value)==null?void 0:U.name)||"Usuário"),1),s("p",null,P(((D=C.value)==null?void 0:D.email)||"user@example.com"),1)],512),[[v,!c.value]])]),s("nav",we,[M(f,{to:"/",class:"nav-item","exact-active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Painel":""},{default:b(()=>[r[4]||(r[4]=s("span",{class:"nav-icon"},"📊",-1)),k(s("span",_e,"Painel",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/transactions",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Transações":""},{default:b(()=>[r[5]||(r[5]=s("span",{class:"nav-icon"},"💳",-1)),k(s("span",xe,"Transações",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/categories",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Categorias":""},{default:b(()=>[r[6]||(r[6]=s("span",{class:"nav-icon"},"🏷️",-1)),k(s("span",Ae,"Categorias",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/credit-cards",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Cartões":""},{default:b(()=>[r[7]||(r[7]=s("span",{class:"nav-icon"},"💳",-1)),k(s("span",Ee,"Cartões",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/goals",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Metas":""},{default:b(()=>[r[8]||(r[8]=s("span",{class:"nav-icon"},"🎯",-1)),k(s("span",Pe,"Metas",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/reports",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Relatórios":""},{default:b(()=>[r[9]||(r[9]=s("span",{class:"nav-icon"},"📈",-1)),k(s("span",Ie,"Relatórios",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/currency",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Câmbio":""},{default:b(()=>[r[10]||(r[10]=s("span",{class:"nav-icon"},"🌎",-1)),k(s("span",Le,"Câmbio",512),[[v,!c.value]])]),_:1},8,["onClick","title"]),M(f,{to:"/profile",class:"nav-item","active-class":"active",onClick:d.closeMobileSidebar,title:c.value?"Perfil":""},{default:b(()=>[r[11]||(r[11]=s("span",{class:"nav-icon"},"👤",-1)),k(s("span",qe,"Perfil",512),[[v,!c.value]])]),_:1},8,["onClick","title"])]),s("div",ze,[s("button",{onClick:ne(te,["stop"]),class:"logout-btn",title:c.value?"Sair":""},[r[12]||(r[12]=s("span",{class:"logout-icon"},"🚪",-1)),k(s("span",null,"Sair",512),[[v,!c.value]])],8,je)])])],2)):E("",!0),u.value&&m.value?(w(),S("div",{key:1,class:"sidebar-overlay",onClick:H})):E("",!0),s("main",{class:O(["main-content",{"with-sidebar":u.value,collapsed:c.value}])},[u.value?(w(),S("header",He,[s("button",{onClick:H,class:"menu-toggle"},[...r[13]||(r[13]=[s("span",null,"☰",-1)])]),s("h2",Oe,P(W.value),1),s("div",Ve,[s("button",Re,[r[14]||(r[14]=s("span",null,"🔔",-1)),y.value>0?(w(),S("span",Te,P(y.value),1)):E("",!0)])])])):E("",!0),s("div",Ue,[M(oe)])],2),i.value?(w(),S("div",{key:2,class:O(["notification-toast",i.value.type])},[B(P(i.value.message)+" ",1),s("button",{onClick:ae,class:"toast-close"},"×")],2)):E("",!0),h.value?(w(),S("div",De,[...r[15]||(r[15]=[s("div",{class:"spinner"},null,-1),s("p",null,"Carregando...",-1)])])):E("",!0)])}}},Be=ve(Ne,[["__scopeId","data-v-716e4f57"]]),Fe="modulepreload",$e=function(e){return"/"+e},$={},g=function(a,l,n){let o=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const h=document.querySelector("meta[property=csp-nonce]"),y=(h==null?void 0:h.nonce)||(h==null?void 0:h.getAttribute("nonce"));o=Promise.allSettled(l.map(p=>{if(p=$e(p),p in $)return;$[p]=!0;const m=p.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${c}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":Fe,m||(u.as="script"),u.crossOrigin="",u.href=p,y&&u.setAttribute("nonce",y),document.head.appendChild(u),m)return new Promise((C,j)=>{u.addEventListener("load",C),u.addEventListener("error",()=>j(new Error(`Unable to preload CSS for ${p}`)))})}))}function i(h){const y=new Event("vite:preloadError",{cancelable:!0});if(y.payload=h,window.dispatchEvent(y),!y.defaultPrevented)throw h}return o.then(h=>{for(const y of h||[])y.status==="rejected"&&i(y.reason);return a().catch(i)})},Ge=[{path:"/",name:"Dashboard",component:()=>g(()=>import("./Dashboard-BhBh5pjN.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9])),meta:{requiresAuth:!0}},{path:"/login",name:"Login",component:()=>g(()=>import("./Login-yT6ne5wd.js"),__vite__mapDeps([10,1,8,11])),meta:{requiresGuest:!0}},{path:"/transactions",name:"Transactions",component:()=>g(()=>import("./Transactions-BA-GsQJ9.js"),__vite__mapDeps([12,1,3,2,8,13])),meta:{requiresAuth:!0}},{path:"/categories",name:"Categories",component:()=>g(()=>import("./Categories-ViBdJ2-Z.js"),__vite__mapDeps([14,1,3,2,8,15])),meta:{requiresAuth:!0}},{path:"/credit-cards",name:"CreditCards",component:()=>g(()=>import("./CreditCards-DrqvOpVH.js"),__vite__mapDeps([16,1,6,5,2,8,17])),meta:{requiresAuth:!0}},{path:"/goals",name:"Goals",component:()=>g(()=>import("./Goals-DubEaBXX.js"),__vite__mapDeps([18,1,4,5,2,8,19])),meta:{requiresAuth:!0}},{path:"/reports",name:"Reports",component:()=>g(()=>import("./Reports-BWJJqxtp.js"),__vite__mapDeps([20,1,5,2,8,21])),meta:{requiresAuth:!0}},{path:"/currency",name:"Currency",component:()=>g(()=>import("./Currency-DJbB2NX6.js"),__vite__mapDeps([22,1,7,5,2,8,23])),meta:{requiresAuth:!0}},{path:"/profile",name:"Profile",component:()=>g(()=>import("./Profile-C9RC8_k5.js"),__vite__mapDeps([24,1,5,8,25])),meta:{requiresAuth:!0}},{path:"/:pathMatch(.*)*",name:"NotFound",component:()=>g(()=>import("./NotFound-DIA-MIx5.js"),__vite__mapDeps([26,1,8,27]))}],Y=ce({history:de(),routes:Ge});Y.beforeEach((e,a,l)=>{const o=X().isAuthenticated;e.meta.requiresAuth&&!o?l("/login"):e.meta.requiresGuest&&o?l("/"):l()});/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Je=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,l,n)=>n?n.toUpperCase():l.toLowerCase()),Ze=e=>{const a=Je(e);return a.charAt(0).toUpperCase()+a.slice(1)},Ke=(...e)=>e.filter((a,l,n)=>!!a&&a.trim()!==""&&n.indexOf(a)===l).join(" ").trim(),J=e=>e==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var L={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=({name:e,iconNode:a,absoluteStrokeWidth:l,"absolute-stroke-width":n,strokeWidth:o,"stroke-width":i,size:h=L.width,color:y=L.stroke,...p},{slots:m})=>R("svg",{...L,...p,width:h,height:h,stroke:y,"stroke-width":J(l)||J(n)||l===!0||n===!0?Number(o||i||L["stroke-width"])*24/Number(h):o||i||L["stroke-width"],class:Ke("lucide",p.class,...e?[`lucide-${G(Ze(e))}-icon`,`lucide-${G(e)}`]:["lucide-icon"])},[...a.map(c=>R(...c)),...m.default?[m.default()]:[]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t=(e,a)=>(l,{slots:n,attrs:o})=>R(Qe,{...o,...l,iconNode:a,name:e},n);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=t("bell-ring",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=t("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=t("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=t("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=t("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=t("car",[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=t("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=t("chart-pie",[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=t("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=t("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=t("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=t("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=t("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=t("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=t("coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=t("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=t("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=t("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=t("ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=t("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=t("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=t("film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=t("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=t("gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=t("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=t("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=t("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=t("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=t("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=t("languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=t("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=t("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=t("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=t("monitor-smartphone",[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=t("moon",[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=t("palette",[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=t("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=t("piggy-bank",[["path",{d:"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",key:"1piglc"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M2 8v1a2 2 0 0 0 2 2h1",key:"1env43"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=t("plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=t("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=t("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ot=t("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=t("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=t("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=t("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ut=t("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=t("shopping-cart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=t("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=t("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=t("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=t("sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=t("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=t("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=t("trending-down",[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kt=t("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=t("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=t("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yt=t("utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wt=t("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=t("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),ta={Home:Z,CreditCard:ut,PieChart:st,Target:Gt,BarChart3:ot,Globe:bt,User:Xt,LogOut:K,Plus:jt,Download:yt,Bell:Ye,Settings:Rt,TrendingUp:Kt,TrendingDown:Zt,DollarSign:pt,Wallet:Wt,PiggyBank:qt,Calendar:tt,ShoppingCart:Dt,Utensils:Yt,Car:at,HomeIcon:Z,Heart:Ct,BookOpen:We,Film:gt,Coffee:ht,Smartphone:Nt,Plane:zt,Gift:Mt,MoreHorizontal:kt,ChevronRight:it,Check:rt,X:ea,Edit:Bt,Trash2:Jt,Filter:ft,Search:Vt,Eye:mt,EyeOff:vt,Lock:xt,Mail:At,Phone:Lt,CalendarDays:et,BellRing:Xe,Shield:Ut,Key:wt,MonitorSmartphone:Et,LogOutIcon:K,AlertCircle:nt,CheckCircle:lt,Info:St,Star:Ft,Clock:dt,Upload:Qt,Share2:Tt,Printer:Ht,RefreshCw:Ot,HelpCircle:ct,Moon:Pt,Sun:$t,Palette:It,Languages:_t},z=he(Be),aa=ue();z.use(aa);z.use(Y);Object.entries(ta).forEach(([e,a])=>{z.component(e,a)});z.mount("#app");export{ve as _,V as a,X as u};
