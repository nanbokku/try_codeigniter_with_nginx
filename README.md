# try_codeigniter_with_nginx

CodeIgniter 使ってみた．

## 環境構築

### nginx

docker コンテナ内の`/etc/nginx/conf.d/default.conf`ファイルに設定を記述．

```nginx
server {
    listen       80;
    server_name  localhost;
    root /var/www/html/public;
    charset utf8mb4;
    index index.php;

    location / {
        # ファイル，ディレクトリが見つからなかった場合 index.php/$uri に変形
        try_files $uri $uri/ /index.php?$request_uri;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ [^/]\.php(/|$) {
       root           /var/www/html/public;
       fastcgi_pass   php:9000;
       fastcgi_index  index.php;
       fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
       include        fastcgi_params;
    }

    error_log /home/app/nginx/error.log debug;
    rewrite_log on;
}
```

`root`は`var/html/www/public`にした．`public`以下のファイルが公開される．  
`try_files`は指定された順序でファイルの存在をチェック，最初に見つかったものを処理する．何も見つからなかったら最後に指定した uri に内部リダイレクト．  
php-fpm を使用しているので`fast_cgi_*`みたいなやつを書かなきゃだめぽい．  
`error_log`でエラーログの保存先の設定，`rewrite_log`で rewrite ディレクティブの動作をロギングするか設定

### codeigniter

composer でインストールした．

```bash
composer require codeigniter/framework
```

あとは順に

1. `vendor`ディレクトリ以下に`codeigniter/framework/application`ディレクトリがあるので外に出す．

1. `index.php`を書き換える．

```php
$system_path = '../vendor/codeigniter/framework/system';
$application_folder = '../application';
```

3. `config/config.php`を書き換える．

```php
$config['composer_autoload'] = realpath(APPPATH . '../vendor/autoload.php');
```

基本はこれで OK．

### mysql

docker コンテナ内の`/etc/mysql/conf.d/my.cnf`に設定を記述．

```cnf
[mysql]
default-character-set=utf8mb4

[mysqld]
default-authentication-plugin=mysql_native_password
character-set-server=utf8mb4
collation-server=utf8mb4_bin
explicit-defaults-for-timestamp=1

[client]
default-character-set=utf8mb4
```

MySQL には寿司ビール問題なるものがあるらしい...  
https://tmtms.hatenablog.com/entry/2016/09/06/mysql-utf8

とりあえず文字コードは utf8mb4 にしてる．

mysql:8.0 を使用してるので`default-authentication-plugin=mysql_native_password`は必須．  
あとは`TIMESTAMP`型を使ってるので`explicit-defaults-for-timestamp=1`も設定．

#### [要注意] Windows 上で VirtualBox 経由で Docker を起動している場合

windows 上で`my.cnf`を作成，編集してマウントさせればいいだけーと思ったらそんなに簡単じゃなかった...

設定が反映されないなーと思ってログをみたらエラーメッセージ

```shell
mysql: [Warning] World-writable config file '/etc/mysql/conf.d/my.cnf' is ignored.
```

パーミッションでエラーが出てるらしく，コンテナ内で確認すると`my.cnf`のパーミッションは 777 になってた．  
777 になってたから無視したよーって言われてるみたい．

調べてみると，

> Windows から VirtualBox 経由でマウントしているディレクトリ/ファイルはすべて 777 になる。

らしい．  
https://qiita.com/koyo-miyamura/items/4d1430b9086c5d4a58a5

なので Dockerfile でパーミッションを変更するように記述．

```dockerfile
FROM mysql

COPY ./conf.d /etc/mysql/conf.d

# permission が 777 だと mysql が読んでくれないため
RUN chmod 644 /etc/mysql/conf.d/my.cnf

ENV MYSQL_DATABASE=todo_database
ENV MYSQL_ROOT_PASSWORD=root
```

これで OK．

## CodeIgniter で URL に付加される index.php を消す

CodeIgniter はデフォルトだとhttp://localhost/index.php?/controller/method/param
でルーティングがされるようになっている．

nginx の設定ファイルに以下記述．

```nginx
    location / {
        # ファイル，ディレクトリが見つからなかった場合 index.php/$uri に変形
        try_files $uri $uri/ /index.php?$request_uri;
    }
```

`$uri`と`$uri_request`の違いについては[こちら](http://vatchcjplog.blog.shinobi.jp/nginx/%E3%80%90nginx%E3%80%91%E3%83%A1%E3%83%A2%EF%BC%9A%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E9%99%A4%E5%A4%96%E3%81%97%E3%81%9F%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88uri)がわかりやすかった．  
`$uri_request`にはクエリストリングも含めた値が入るのかな？`$uri`には入ってない．

あと`application/config/config.php`の編集．

```php
$config['index_page'] = '';
```

## CodeIgniter のデータベース設定

`application/config/database.php`で設定する．

```php
$db['todo'] = [
    'dsn' => 'mysql:host=db;dbname=todo_database;port=3306;',
    'hostname' => '',
    'username' => 'root',
    'password' => 'root',
    'database' => '',
    'dbdriver' => 'pdo',
    'dbprefix' => '',
    'pconnect' => false,
    'db_debug' => (ENVIRONMENT !== 'production'),
    'cache_on' => false,
    'cachedir' => '',
    'char_set' => 'utf8mb4',
    'dbcollat' => 'utf8mb4_bin',
    'swap_pre' => '',
    'encrypt' => false,
    'compress' => false,
    'stricton' => false,
    'failover' => [],
    'save_queries' => true,
];
```

デフォルトであったものを少し修正した．

`$db[<name>]`だと model の中で

```php
$this->load->database(<name>, false, true);
```

みたいに呼べる．

今回は PDO ドライバを使用しているので`hostname`,`database`は使用しない．`dsn`を使用する．`dsn`には`port`も指定しないとダメだった．  
http://codeigniter.jp/user_guide/3/database/connecting.html#id5
