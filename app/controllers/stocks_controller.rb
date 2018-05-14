class StocksController < ApplicationController
  
  def search
    if params[:stock]
      @stock ||= Stock.new_from_lookup(params[:stock])
    end
    
    if @stock
      @stock.can_be_added = current_user.can_add_stock?(@stock.ticker)
      render json: @stock, methods: [:can_be_added]
    else
      render status: 404, json: { response: 'No stock exists for this symbol' }
    end
  end
end