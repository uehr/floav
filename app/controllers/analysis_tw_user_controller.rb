require "analysis_tw_user.rb"

class AnalysisTwUserController < ActionController::Base
    def index
    end

    def show
        analyzer = AnalysisTwUser.new(params[:id])
        @ranking = analyzer.tweet_words_ranking()
    end
end