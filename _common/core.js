/* lily 共通：タブ・目次・前後ナビ・確認問題・内部タブ・解説スイッチ・相互リンク
   各章のHTMLは、.part（data-title, data-desc）と section（data-t, h2 .sn）を並べるだけでよい。
   パートが表示されたときに "partshown" イベント（detail.id）を発行する。 */
(function(){
  const parts=[...document.querySelectorAll(".part")];
  const tabs=document.getElementById("tabs");
  const drawerList=document.getElementById("drawerList");
  const body=document.body, menuBtn=document.getElementById("menuBtn"), drawer=document.getElementById("drawer");
  let current=0;

  parts.forEach((p,i)=>{
    p.setAttribute("role","tabpanel");
    const secs=[...p.querySelectorAll("section")];
    const head=document.createElement("div");head.className="part-head";
    head.innerHTML='<div class="ph-main"><div class="pn">Part '+(i+1)+' / '+parts.length+'</div><h1>'+p.dataset.title+'</h1><p>'+p.dataset.desc+'</p></div>';
    const mini=document.createElement("div");mini.className="toc-mini";
    secs.forEach(s=>{const b=document.createElement("button");b.type="button";b.textContent=s.querySelector(".sn").textContent+". "+s.dataset.t;b.addEventListener("click",()=>s.scrollIntoView({behavior:"smooth",block:"start"}));mini.appendChild(b);});
    head.querySelector(".ph-main").appendChild(mini);p.prepend(head);

    const t=document.createElement("button");t.type="button";t.className="tab";t.setAttribute("role","tab");t.id="tab-"+p.id;t.setAttribute("aria-controls",p.id);
    t.innerHTML='<span class="n">'+(i+1)+'</span>'+p.dataset.title;
    t.addEventListener("click",()=>go(i,true));
    t.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){const k=(i+1)%parts.length;go(k,true);tabs.children[k].focus();}if(e.key==="ArrowLeft"){const k=(i-1+parts.length)%parts.length;go(k,true);tabs.children[k].focus();}});
    tabs.appendChild(t);p.setAttribute("aria-labelledby",t.id);

    const h=document.createElement("h4");const hb=document.createElement("button");hb.type="button";hb.innerHTML='<span class="n">'+(i+1)+'</span>'+p.dataset.title;hb.addEventListener("click",()=>{go(i,true);closeMenu();});h.appendChild(hb);drawerList.appendChild(h);
    const ul=document.createElement("ul");
    secs.forEach(s=>{const li=document.createElement("li");const b=document.createElement("button");b.type="button";b.textContent=s.querySelector(".sn").textContent+". "+s.dataset.t;b.addEventListener("click",()=>{go(i,false);closeMenu();setTimeout(()=>s.scrollIntoView({block:"start"}),30);});li.appendChild(b);ul.appendChild(li);});
    drawerList.appendChild(ul);
  });

  function go(i,top){
    current=i;
    parts.forEach((p,k)=>p.classList.toggle("on",k===i));
    [...tabs.children].forEach((t,k)=>{t.setAttribute("aria-selected",k===i?"true":"false");t.tabIndex=k===i?0:-1;});
    [...drawerList.querySelectorAll("h4")].forEach((h,k)=>h.classList.toggle("cur",k===i));
    tabs.children[i].scrollIntoView({block:"nearest",inline:"nearest"});
    const pg=document.getElementById("pager");pg.innerHTML="";
    if(i>0){const b=document.createElement("button");b.type="button";b.innerHTML="<small>前のパート</small>← "+parts[i-1].dataset.title;b.addEventListener("click",()=>go(i-1,true));pg.appendChild(b);}
    if(i<parts.length-1){const b=document.createElement("button");b.type="button";b.className="next";b.innerHTML="<small>次のパート</small>"+parts[i+1].dataset.title+" →";b.addEventListener("click",()=>go(i+1,true));pg.appendChild(b);}
    try{if(location.hash!=="#"+parts[i].id)history.replaceState(null,"","#"+parts[i].id);}catch(e){}
    if(top)window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent("partshown",{detail:{id:parts[i].id}}));
  }
  function openMenu(){body.classList.add("menu-open");drawer.setAttribute("aria-hidden","false");menuBtn.setAttribute("aria-expanded","true");document.getElementById("closeBtn").focus();}
  function closeMenu(){body.classList.remove("menu-open");drawer.setAttribute("aria-hidden","true");menuBtn.setAttribute("aria-expanded","false");}
  menuBtn.addEventListener("click",openMenu);
  document.getElementById("closeBtn").addEventListener("click",()=>{closeMenu();menuBtn.focus();});
  document.getElementById("scrim").addEventListener("click",closeMenu);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&body.classList.contains("menu-open")){closeMenu();menuBtn.focus();}});
  window.addEventListener("hashchange",()=>{const k=parts.findIndex(p=>"#"+p.id===location.hash);if(k>=0&&k!==current)go(k,true);});

  /* 内部タブ（.itabs の button[aria-controls]） */
  document.querySelectorAll(".itabs").forEach(box=>{
    const bs=[...box.querySelectorAll("button")];
    const sel=i=>bs.forEach((b,k)=>{b.setAttribute("aria-selected",k===i?"true":"false");b.tabIndex=k===i?0:-1;document.getElementById(b.getAttribute("aria-controls")).hidden=k!==i;});
    bs.forEach((b,i)=>{b.addEventListener("click",()=>sel(i));b.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){const k=(i+1)%bs.length;sel(k);bs[k].focus();}if(e.key==="ArrowLeft"){const k=(i-1+bs.length)%bs.length;sel(k);bs[k].focus();}});});
    sel(0);
  });

  /* 確認問題・ヒント（.q の .show で .ans を開閉） */
  document.querySelectorAll(".q").forEach(q=>{const b=q.querySelector(".show"),a=q.querySelector(".ans");if(!b||!a)return;const lab=b.textContent;b.setAttribute("aria-expanded","false");b.addEventListener("click",()=>{a.hidden=!a.hidden;b.textContent=a.hidden?lab:"閉じる";b.setAttribute("aria-expanded",a.hidden?"false":"true");});});

  /* 解説と答案例の表示スイッチ */
  const tg=document.getElementById("ansToggle"),note=document.getElementById("ansNote");
  if(tg){
    const setAns=on=>{document.body.classList.toggle("ans-off",!on);tg.checked=on;if(note)note.textContent=on?"オン：解説と答案例を表示しています。":"オフ：問題とヒントだけを表示しています。";};
    tg.addEventListener("change",()=>setAns(tg.checked));
    setAns(typeof ANSWERS_DEFAULT_ON!=="undefined"&&ANSWERS_DEFAULT_ON);
  }

  /* 解説の開閉 */
  document.querySelectorAll(".solbtn").forEach(b=>b.addEventListener("click",()=>{const bd=b.nextElementSibling;bd.hidden=!bd.hidden;b.setAttribute("aria-expanded",bd.hidden?"false":"true");b.textContent=bd.hidden?"解説を読む（手順を追って説明）":"解説を閉じる";document.dispatchEvent(new CustomEvent("solopen"));}));

  /* 相互リンク */
  document.addEventListener("click",e=>{const a=e.target.closest("[data-goto]");if(!a)return;e.preventDefault();const t=document.getElementById(a.dataset.goto);if(!t)return;const k=parts.findIndex(p=>p.contains(t));if(k<0)return;go(k,false);setTimeout(()=>t.scrollIntoView({block:"start"}),30);});

  const start=parts.findIndex(p=>"#"+p.id===location.hash);
  go(start>=0?start:0,false);
})();
