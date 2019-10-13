# デフォルトでneologd辞書を使用
sed -i -e 's/^dicdir/dicdir = \/app\/mecab-ipadic-neologd\n; dicdir/g' ${MECABRC}
bundle exec rackup config.ru -p $PORT