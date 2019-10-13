Rails.application.routes.draw do
  root "analysis_tw_user#index"
  get "/analysis/:id", to: "analysis_tw_user#new", as: "analysis"
end