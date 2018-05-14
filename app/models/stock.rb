class Stock < ApplicationRecord
  has_many :user_stocks
  has_many :users, through: :user_stocks
  attr_accessor :can_be_added
  
  def self.find_by_ticker(ticker_symbol)
    where(ticker: ticker_symbol).first
  end
      
  def self.new_from_lookup(ticker_symbol)
    begin 
      looked_up_stock = StockQuote::Stock.quote(ticker_symbol)
      new(ticker: looked_up_stock.symbol, name: looked_up_stock.company_name, last_price: looked_up_stock.close)
    rescue Exception => e 
      return nil
    end
  end
  
end
