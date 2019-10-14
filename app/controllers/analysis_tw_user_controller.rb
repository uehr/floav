require "analysis_tw_user.rb"

class AnalysisTwUserController < ApplicationController
    def index
    end

    def new
        begin
            analyzer = AnalysisTwUser.new(params[:id])
            ranking = analyzer.tweet_words_ranking
        rescue => err
            puts "errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
            puts err
        end
        render :json => ranking
    end
end