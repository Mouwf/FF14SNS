# 投稿とリリース情報の関連テーブル
このテーブルは投稿がどのパッチを対象とした投稿かを関連付けるためのテーブルになる
このテーブルを使い、特定のパッチでのフィルタリングを実現する
* ID(主キー)
* 投稿ID(外部キー)
* リリースID(外部キー)