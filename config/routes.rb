Rails.application.routes.draw do

  get 'hello_world', to: 'hello_world#index'
  resources :attempts
  match 'tasks/next', to: 'tasks#next', as: 'next_task', via: :get
  match 'tasks/list', to: 'tasks#list', as: 'task_list', via: :get
  match 'tasks/lists', to: 'tasks#lists', as: 'task_lists', via: :get
  match 'tasks/:id/done', to: 'tasks#done', as: 'task_done', via: :post
  match 'tasks/:id/worked', to: 'tasks#worked', as: 'task_worked', via: :post
  match 'tasks/:id/postpone', to: 'tasks#postpone', as: 'task_postpone', via: :post
  match 'tasks/:id/split', to: 'tasks#split', as: 'task_split', via: :get
  resources :tasks do
    collection { post :sort }
  end
  devise_for :users, controllers: { omniauth_callbacks: 'authorizations' }
  match 'users/logout', to: 'sessions#destroy', as: 'logout', via: :delete
  match 'users/logout', to: 'sessions#destroy', via: :get # in case a provider directs us back to /logout, trying to be helpful!
  match 'users/login', to: 'sessions#login', as: 'login', via: :get
  match 'users/:id/tags', to: 'users#tags', as: 'user_tags', via: :get
  resources :users
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root "home#index" # we'll change this later

  match 'home/login', to: 'home#login', via: [:post, :get]


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
