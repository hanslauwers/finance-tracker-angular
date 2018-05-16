class UsersController < ApplicationController
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  
  def my_portfolio
    @user_stocks = current_user.stocks
    @user = current_user
    
    respond_to do |format|
      format.html { render :my_portfolio }
      format.js { render partial: 'stocks/list.html' }
    end
  end
  
  def my_friends
    @friendships = current_user.friends
    
    respond_to do |format|
      format.html { render :my_friends }
      format.js { render partial: 'friends/list.html' }
    end
  end
  
  def search
    if params[:search_param].blank?
      flash.now[:danger] = "You have entered an empty search string"
    else
      @users = User.search(params[:search_param])
      @users = current_user.except_current_user(@users)
      flash.now[:danger] = "No users match this search criteria" if @users.blank?
    end
    
    if( @users.blank? )
      render status: 404, json: { response: "No users match this search criteria" }
    else
      @users.map! do |user|
        user.profile_path = user_path(user)
        user.friends_already = current_user.friends_with?(user.id)
        user
      end
      render json: @users, methods: [:profile_path, :friends_already]
    end
  end
  
  def add_friend
    @friend = User.find(params[:friend])
    current_user.friendships.build(friend_id: @friend.id)
    if current_user.save
      flash[:success] = "Friend was successfully added"
      render json: { response: flash[:success] }, status: :ok
    else
      flash[:danger] = "There was something wrong with the friend request"
      render json: { response: flash[:danger] }, status: 422
    end  
    
    
    
  end
  
  def show
    @user = User.find(params[:id])
    @user_stocks = @user.stocks
  end
  
end