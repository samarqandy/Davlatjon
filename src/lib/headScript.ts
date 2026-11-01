/**
 * Скрипт в <head>: прячет страницу до загрузки, когда она пришла не на языке устройства (кука `lang`
 * ещё не записана), и на страницах, где в текстах стоит имя ребёнка (занятия, раздел родителя, задачник), —
 * чтобы не мелькали другой язык и «Друг» вместо имени. Главная и шахматы с именем показываются сразу:
 * там приветствие без имени до загрузки. Ошибка в нём не видна (он в try/catch) — его проверяет tests/head-script.test.ts.
 */
export const HEAD_SCRIPT = `try{var a=(JSON.parse(localStorage.getItem("davlatjon-lab:profiles")||"{}")||{}).active;var s=JSON.parse(localStorage.getItem("davlatjon-lab:v1"+(a&&a!=="main"&&/^[a-z0-9]{3,12}$/.test(a)?":"+a:""))||"{}").settings||{};var named=s.childName&&["week","parent","my-problems"].indexOf(location.pathname.split("/")[1])>=0;var h=document.documentElement,l=s.lang==="uz"?"uz":"ru";if(l!==h.lang||named){h.lang=l;h.classList.add("i18n-wait");setTimeout(function(){h.classList.remove("i18n-wait")},1500)}}catch(e){}`;
