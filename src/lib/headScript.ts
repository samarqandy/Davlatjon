/**
 * Скрипт в <head>: прячет страницу до загрузки, когда она пришла не на языке устройства (кука `lang`
 * ещё не записана), и на страницах, где в текстах стоит имя ребёнка (занятия, раздел родителя, задачник), —
 * чтобы не мелькали другой язык и «Друг» вместо имени. Главная и шахматы с именем показываются сразу:
 * там приветствие без имени до загрузки. Так же ждёт страница, открытая сразу на «экране» (адрес с якорем в шахматах
 * и в занятиях: #open-italian, #practice, #task-3): сервер якоря не видит и отдаёт страницу раздела, а нужный экран
 * появляется после загрузки — без ожидания ребёнок полсекунды-две видел список и мог нажать не туда. Запасной выход
 * для такой страницы — восемь секунд, а не полторы: на очень медленном телефоне страница дебютов оживает за 5–7 с,
 * и трёх секунд не хватало — список снова показывался. Выключенные родителем анимации — html[data-motion=off] ещё до отрисовки; тёмная тема — html[data-theme=dark]; возрастной режим — html[data-age] (как ageMode.ts); первое знакомство — html[data-first]: окно приветствия на главной видно сразу, а не после загрузки скриптов. Ошибка в нём не видна (он в try/catch) — его проверяет tests/head-script.test.ts.
 */
export const HEAD_SCRIPT = `try{var a=(JSON.parse(localStorage.getItem("davlatjon-lab:profiles")||"{}")||{}).active;var o=JSON.parse(localStorage.getItem("davlatjon-lab:v1"+(a&&a!=="main"&&/^[a-z0-9]{3,12}$/.test(a)?":"+a:""))||"{}")||{};var s=o.settings||{};var named=s.childName&&["week","parent","my-problems"].indexOf(location.pathname.split("/")[1])>=0;var h=document.documentElement,l=s.lang==="uz"?"uz":"ru";if(o.welcomed!==true)h.setAttribute("data-first","");var screen=location.hash.length>1&&["chess","week"].indexOf(location.pathname.split("/")[1])>=0;if(l!==h.lang||named||screen){h.lang=l;h.classList.add("i18n-wait");setTimeout(function(){h.classList.remove("i18n-wait")},screen?8000:1500)}if(s.animations===false)h.setAttribute("data-motion","off");if(s.theme==="dark")h.setAttribute("data-theme","dark");var g=s.age;h.setAttribute("data-age",!g?"junior":g<=7?"kid":g<=10?"junior":"teen");}catch(e){}`;
