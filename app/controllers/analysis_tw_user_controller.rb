require "analysis_tw_user.rb"
require "exceptions.rb"

class AnalysisTwUserController < ApplicationController
    def index
    end

    def new
        begin
            analyzer = AnalysisTwUser.new(params[:id], tweet_limit: 100)
            ranking = analyzer.tweet_words_ranking
            # 情報を取得できない場合
            unless ranking.present?
                raise Exceptions::FailedToGetTweets
            end
            render :json => ranking
        rescue Twitter::Error::Unauthorized, Twitter::Error::NotFound
            msg = "不正なユーザーIDです"
            flash[:danger] = msg
            render status: 400, json: {error: msg}
        rescue Exceptions::FailedToGetTweets
            msg = "ツイートを取得できません"
            flash[:danger] = msg
            render status: 400, json: {error: msg}
        rescue Exceptions::EmptyTwitterId
            msg = "IDが空です"
            flash[:danger] = msg
            render status: 400, json: {error: msg}
        rescue => err
            puts err
            msg = "サーバーエラー"
            flash[:danger] = msg
            render status: 500, json: {error: msg}
        end
    end
end