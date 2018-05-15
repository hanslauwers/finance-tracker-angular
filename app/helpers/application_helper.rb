module ApplicationHelper
    
    def notices_in_flash?
       flash.notice.present? 
    end
end
