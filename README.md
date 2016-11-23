# 実況（仮）
実況用途に特化したニコニコ実況風システム

npm installをすればnode_modulesはいらないはずですが一応いれておきます。

xampp環境を用意して
jikkyou_kakko_kari.sqlをphpmyadminで実行する

# テストユーザー
・testさん
Eメール test@example.com
パスワード test

・テストさん
Eメール test2@example.com
パスワード test

# 機能
ユーザー登録・ログイン

ユーザーログイン後
コメント・ページ作成
※コメントは最新１０件をメモリ上に保存します

# 開発環境
node version v6.9.1
express version 4.14.0
Redis server v=3.2.100　（ログインセッション用）
mysql  Ver 15.1 Distrib 10.1.8-MariaDB, for Win32 (AMD64)　（チャンネル、ユーザー）
windows 7 x64

以前の流用も含め、コーディングルールは統一されておりません。

# 運用注意

・環境変数の変更
C:\Express>set NODE_ENV=production
Windows環境の場合は、コマンドプロンプトでsetすることで、Unix環境でexportするように、NODE_ENVの値を変更することができる。

引用
http://dim5.net/nodejs/develoment-production-env.html

・nodejsを１日に一回再起動する
不安定にならないように

・mysqlのコネクションを繋ぎっぱなしなので
wait_timeoutを変更する１日だったら２４時間の値にする

参考
http://qiita.com/satococoa/items/e3396d9d75b9cf7e6214

