# RandomGenerator

[![GitHub Pages](https://img.shields.io/static/v1?label=GitHub+Pages&message=+&color=brightgreen&logo=github)](https://kanpurin.github.io/RandomGenerator/)

## お知らせ
このプロジェクトは以下の理由により開発者を募集していません。
- コードが汚く改変が難しいため
- ローカルで実行できないため(理由がわからない)
- 別の非公開リポジトリに依存しているため

やろうと思えば機能追加やバグ修正はできるためIssueは募集しています。

## WASMの有効化

https://emscripten.org/docs/getting_started/downloads.html

## 説明

|  名前  |  詳細  |
| :----: | :---- |
|  数列  |  (下限)以上(上限)以下の整数を一様ランダムに $N$ 個生成(重複を許すか指定可能)<br>$1\leq N\leq 5\times 10^5$<br>$-10^{18}\leq$ (下限) $\leq$ (上限) $\leq 10^{18}$  |
|  括弧列  |  長さ $2N$ の括弧列を一様ランダムに生成<br>$1\leq N\leq 10^5$  |
|  ラベル付き木  |  頂点数 $N$ のラベル付き木を一様ランダムに生成<br>$1\leq N\leq 2\times 10^5$  |
|  単純グラフ  |  頂点数 $N$ 辺数 $M$ の単純グラフを一様ランダムに生成<br>$1\leq N\leq 2\times 10^5$<br>$0\leq M\leq \min(2\times 10^5,N(N-1)/2)$  |
|  単純連結グラフ  |  頂点数 $N$ 辺数 $M$ の単純連結グラフをランダムに生成<br>[構成比近似法を用いたランダム生成アルゴリズム](https://www.jstage.jst.go.jp/article/jssst/20/4/20_4_363/_pdf/-char/ja)<br>$1\leq N\leq 2\times 10^5$<br>$N-1\leq M\leq \min(2\times 10^5,N(N-1)/2)$  |
|  素数  |  (下限)以上(上限)以下の素数を一様ランダムに生成<br>$2\leq$ (下限) $\leq$ (上限) $\leq 10^{18}$  |
