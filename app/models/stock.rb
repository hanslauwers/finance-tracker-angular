class Stock < ApplicationRecord
  has_many :user_stocks
  has_many :users, through: :user_stocks
  
  def self.find_by_ticker(ticker_symbol)
    where(ticker: ticker_symbol).first
  end
  
  def self.new_from_lookup(ticker_symbol)
    begin 
      looked_up_stock = StockQuote::Stock.quote(ticker_symbol)
      return nil unless looked_up_stock.company_name
      new_stock = new(ticker: looked_up_stock.symbol, name: looked_up_stock.company_name)
      new_stock.last_price = new_stock.price
      new_stock
    rescue Exception => e 
      return nil
    end
  end
  
  def price
    closing_price = StockQuote::Stock.quote(ticker).close
    return "#{closing_price} (Closing)" if closing_price
    
    opening_price = StockQuote::Stock.quote(ticker).open
    return "#{opening_price} (Opening)" if opening_price
    
    "Unavailable"
  end
  
  def self.strip_commas(number)
    number.gsub(",", "")   
  end
  
end
