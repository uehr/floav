require "analysis_tw_user.rb"

class AnalysisTwUserController < ActionController::Base
    def index
        analyzer = AnalysisTwUser.new
        render html: analyzer.analysis
    end
end

