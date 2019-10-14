# neologd辞書をダウンロード
wget https://uehr-service.s3-ap-northeast-1.amazonaws.com/mecab-dict.tar.xz
tar -xf mecab-dict.tar.xz

# デフォルトでneologd辞書を使用
sed -i -e 's/^dicdir/dicdir = \/app\/mecab-dict\n; dicdir/g' ${MECABRC}

bundle exec rackup config.ru -p $PORT