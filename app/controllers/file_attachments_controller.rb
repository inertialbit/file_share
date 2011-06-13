class FileAttachmentsController < FileShare::ApplicationController
  
  # before_filter :load_and_authorize_current_user, :except => [:index, :show, :download]
  
  rescue_from Errno::ENOENT, :with => :file_not_found
  
  respond_to :html
  respond_to :json, :only => [:index, :create, :destroy]

  private
    def file_not_found(e)
      logger.error("FileAttachmentsController[#{action_name}] was rescued with :file_not_found. #{e.message}")
      msg = "The physical file could not be located so your request could not be completed."
      respond_to do |format|
        format.html do
          flash[:warning] = msg
          redirect_back_or_default(file_attachments_path)
        end
        format.json do
          render :status => 511, :text => msg
        end
      end
    end
    def redirect_to_index_or_attachable(params={})
      if defined?(@file_attachment)
        unless @file_attachment.attachable_id.blank?
          redirect_to(polymorphic_path(@file_attachment.attachable, params)) and return
        else
          redirect_to(file_attachments_path(params)) and return
        end
      else
        redirect_back_or_default(file_attachments_path(params)) and return
      end
    end
    def redirect_back_or_default(default)
      #unless session[:return_to] && session[:return_to] == new_user_session_path
      #  redirect_to(session[:return_to] || default)
      #else
        redirect_to(default)
      #end
      #session[:return_to] = nil
    end
  protected
  public
    def new
    end
    def show
      @file_attachment = FileAttachment.find(params[:id])
    end
    def index
      @file_attachments = FileAttachment.where(1)
      respond_with @file_attachments
    end
  
    def download
      file_attachment = FileAttachment.find(params[:id])
      file_itself     = File.open(file_attachment.full_path, 'r')
      logger.debug("FILE ATTACHMENT INFO: #{file_attachment.inspect}")
      logger.debug("FILE INFO: #{file_itself.inspect}")
      send_data(file_itself.read, :filename => File.basename(file_itself.path), :stream => true, :buffer_size => 1.megabyte)
    end

    def create
      if params[:file] # plupload param
        file_params = {
          :uploaded_file => params[:file]
        }
        if params[:attachable_id] && params[:attachable_type]
          file_params.merge!({
            :attachable_id   => params[:attachable_id],
            :attachable_type => params[:attachable_type]
          })
        end
        if params[:display_name]
          file_params.merge!({
            :name => params[:display_name]
          })
        end
        if params[:description]
          file_params.merge!({
            :description => params[:description]
          })
        end
        file_attachment = FileAttachment.new file_params
      elsif params[:file_attachment] && params[:file_attachment][:uploaded_file]
        # std form params
        file_attachment = FileAttachment.new params[:file_attachment]
      end

      if file_attachment && file_attachment.save
        flash[:notice] = "File uploaded."
      else
        if file_attachment
          flash[:warning] = "Unable to save file attachment: #{file_attachment.errors.full_messages.join('; ')}"
        else
          flash[:warning] = "No files were selected for upload."
        end
      end

      unless params[:file] || request.xhr? # html5 based multiple uploads are not xhr
        redirect_to_index_or_attachable(:std => 1)
      else
        flash.discard
        render :json => file_attachment.bb_attributes
      end
    end

    def edit
      @file_attachment = FileAttachment.find(params[:id])
    end
    
    def update
      file_attachment = FileAttachment.find(params[:id])
      success = file_attachment.update_attributes params
      respond_to do |format|
        format.html do
          if success            
            flash[:notice] = "Updated File: #{file_attachment.name}"
            redirect_to_index_or_attachable
          else
            render :edit
          end
        end
        format.json do
          if success
            render :json => file_attachment.bb_attributes
          else
            render :json => {:errors => file_attachment.errors.to_json}
          end
        end
      end
    end
    
    def destroy
      @file_attachment = FileAttachment.find(params[:id])
      @file_attachment.destroy
      msg = "Deleted File: #{@file_attachment.name}"
      respond_to do |format|
        format.html do
          flash[:notice] = msg
          redirect_to_index_or_attachable
        end
        format.json{ render :json => @file_attachment.bb_attributes }
      end
    end
end
