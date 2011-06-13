Rails.application.routes.draw do
  resources :file_attachments do
    member do
      get :download
    end
  end
  resources :file_containers, :only => :index
end
