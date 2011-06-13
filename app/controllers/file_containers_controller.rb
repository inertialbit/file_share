class FileContainersController < FileShare::ApplicationController
  respond_to :json
  
  def index
    respond_with FileContainer.all
  end
end