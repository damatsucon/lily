# _common（全章共通の部品）

各章の解説ページ（`chNN/index.html`）を、同じ見た目と仕組みで作るための部品です。公開ページはこのフォルダを読み込みません（各章の HTML は1ファイルで完結しています）。

| ファイル | 役割 |
|---|---|
| `base.css` | 見た目（方眼紙の講義プリント、書体、色、メモ、ポイント枠、式の枠、表、グラフ枠、課題パート、数式の分数・Σ/Π/∫） |
| `core.js` | 動き（パートのタブ、目次メニュー、前後ナビ、確認問題の開閉、内部タブ、解説と答案例の表示スイッチ、解説の開閉、相互リンク） |
| `build_chapter.py` | 章の本文 HTML と章ごとの JS を、上の2つと組み合わせて1つの HTML にまとめる |

## 使い方

```
python3 _common/build_chapter.py <章番号> <章タイトル> <本文.html> <章.js> <出力.html>
# 例
python3 _common/build_chapter.py 1 経済学の基礎 body.html ch1.js ch01/index.html
```

本文 HTML は、`<div class="part" id="..." data-title="..." data-desc="...">` の中に `<section id="sN" data-t="..."><h2><span class="sn">N</span>見出し</h2>…</section>` を並べます。最後のパートを「課題に挑戦」（`id="kadai"`）にし、表示スイッチ（`#ansToggle`）、解説（`.sol` / `.solbtn` / `.solbody`）、ダウンロードボタン（`.dlbtn`、href は `kaitou_chN.docx`）を置きます。
