Rails.application.routes.draw do
  root "analysis_tw_user#index"
  post "/analysis", to: "analysis_tw_user#new", as: "analysis"
end