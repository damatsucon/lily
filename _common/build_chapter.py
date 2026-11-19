"""lily 共通ビルド：共通CSS・共通JSと、章ごとの本文・JSを1つのHTMLにまとめる。
使い方: python3 build_chapter.py <章番号> <章タイトル> <本文html> <章js> <出力html>
"""
import sys, pathlib
here = pathlib.Path(__file__).parent
num, title, body_p, js_p, out_p = sys.argv[1:6]
css = (here / 'base.css').read_text(encoding='utf-8')
core = (here / 'core.js').read_text(encoding='utf-8')
body = pathlib.Path(body_p).read_text(encoding='utf-8')
cjs = pathlib.Path(js_p).read_text(encoding='utf-8')
html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>第{num}章 {title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>

<div class="scrim" id="scrim"></div>
<nav class="drawer" id="drawer" aria-label="全体の目次" aria-hidden="true">
  <div class="drawer-head"><b>目次</b><button class="close" id="closeBtn" aria-label="目次を閉じる">×</button></div>
  <div id="drawerList"></div>
</nav>

<header class="bar">
  <div class="bar-in">
    <button class="burger" id="menuBtn" aria-label="目次を開く" aria-controls="drawer" aria-expanded="false"><span></span></button>
    <div class="course"><small>経済原論 I　マクロ経済学入門</small><b>第{num}章　{title}　解説プリントと課題</b></div>
    <a class="home" href="../">トップへ戻る</a>
  </div>
  <div class="tabs" role="tablist" aria-label="パート" id="tabs"></div>
</header>

<main>
{body}
<div class="pager" id="pager"></div>
</main>

<script>
/* 解説と答案例を最初から表示するときは true に変える */
const ANSWERS_DEFAULT_ON=false;
{cjs}
{core}
</script>
</body>
</html>
'''
pathlib.Path(out_p).write_text(html, encoding='utf-8')
print('built', out_p, len(html))
