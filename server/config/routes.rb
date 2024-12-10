Rails.application.routes.draw do
  namespace :api do
    post '/login', to: 'auth#login'
    post '/signup', to: 'auth#signup'
    
    resources :polls do
      member do
        get 'votes'
      end
      resources :questions, only: [:create, :update, :destroy]
    end
    
    resources :votes, only: [:create]
  end
end