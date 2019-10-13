require 'natto'

class AnalysisTwUser
    def initialize(user_id)
        @user_id = user_id
        @mecab = Natto::MeCab.new
        @noise_words = ["gt", "lt", "amp", "it", "via", "with", "on", "and", "to"]
        @client = Twitter::REST::Client.new do |config|
            config.consumer_key = ENV["TWITTER_CONSUMER_KEY"]
            config.consumer_secret = ENV["TWITTER_CONSUMER_SECRET"]
            config.access_token = ENV["TWITTER_ACCESS_KEY"]
            config.access_token_secret = ENV["TWITTER_ACCESS_SECRET"]
        end
    end

    # 最大3,200ツイートを取得
    def tweets
        pages = 1..17
        pages.inject([]) do |tweets, page|
            tweets.concat(
                @client.user_timeline(@user_id, options = {
                    count: 200,
                    page: page
                })
            )
            tweets
        end
    end

    # 日本語のツイート
    def jp_tweets
        puts "hoge"
        self.tweets.select{|tw| tw.lang == "ja"}
    end

    # 単語を抜き出す
    def nouns(text)
        @mecab.enum_parse(text).map do |parsed|
            features = parsed.feature
            if not self.noise_word?(parsed.surface) and features.match "固有名詞"
                parsed.surface
            end
        end.compact
    end

    # N件やN年といった単位付きの数値をはじく
    def numeral?(word)
        /^\d+.$/ === word
    end

    #漢数字を数字へ変換
    def convert_kansuji(text)
        text.tr('〇一二三四五六七八九', '0123456789')
            .gsub(/(\d+)?十(\d+)?/) { ($1 || 1).to_i * 10            + $2.to_i }
            .gsub(/(\d+)?百(\d+)?/) { ($1 || 1).to_i * 100           + $2.to_i }
            .gsub(/(\d+)?千(\d+)?/) { ($1 || 1).to_i * 1000          + $2.to_i }
            .gsub(/(\d+)万(\d+)?/)  {        $1.to_i * 10000         + $2.to_i }
            .gsub(/(\d+)億(\d+)?/)  {        $1.to_i * 100000000     + $2.to_i }
            .gsub(/(\d+)兆(\d+)?/)  {        $1.to_i * 1000000000000 + $2.to_i }
    end

    def noise_word?(word)
        word.length <= 1 or @noise_words.include? word or self.numeral? word
    end

    # 各要素の出現頻度を取得
    def count(array)
        hash = Hash.new 0
        array.inject(Hash.new(0)){|hash, a| hash[a] += 1; hash}.sort_by {|word, count| count}.reverse
    end

    # 文字内に含まれるURLを削除
    def url_removed(text)
        text.gsub(/[^[:print:]]/i, '').gsub(/#{URI::regexp}/, '')
    end

    # ツイートに含まれる各単語の出現頻度
    def tweet_words_ranking(tweets=nil)
        tweets ||= self.jp_tweets
        tweets_str = tweets.map{|tw|
            self.convert_kansuji self.url_removed tw.text
        }.join " "
        self.count self.nouns tweets_str
    end
end