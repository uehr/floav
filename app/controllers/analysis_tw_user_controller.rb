require "analysis_tw_user.rb"

class AnalysisTwUserController < ApplicationController
    def index
    end

    def new
        begin
            analyzer = AnalysisTwUser.new(params[:id])
            ranking = analyzer.tweet_words_ranking
            render :json => ranking
        rescue Twitter::Error::Unauthorized, Twitter::Error::NotFound
            msg = "不正なユーザーIDです"
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