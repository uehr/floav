require "analysis_tw_user.rb"

class AnalysisTwUserController < ApplicationController
    def index
    end

    def new
        analyzer = AnalysisTwUser.new(params[:id])
        ranking = analyzer.tweet_words_ranking
        render :json => ranking
    end
end