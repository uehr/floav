# デフォルトでneologd辞書を使用
sed -i -e 's/^dicdir/dicdir = \/app\/mecab-ipadic-neologd\n; dicdir/g' ${MECABRC}

# mecabのPATH設定
export PATH="/app/vendor/mecab/bin:$PATH"

# neologd辞書をインストール
git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git
cd mecab-ipadic-neologd
./bin/install-mecab-ipadic-neologd --ignore_adverb --ignore_noun_sahen_conn_ortho --ignore_adjective_std --ignore_adjective_verb --ignore_ill_formed_words --ignore_noun_sahen_conn_ortho

bundle exec rackup config.ru -p $PORT