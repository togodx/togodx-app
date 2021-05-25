#!/usr/bin/env ruby
require 'open-uri'
require 'json'

class TogoSite
  module Properties
    def get_properties(url)
      JSON.load(open(url).read)
    end
  end

  module Human
    PROPERTIES_JSON_URL = "https://github.com/dbcls/togosite/raw/develop/config/togosite-human/properties.json"

    class << self
      include Properties

      def generate
        get_properties(PROPERTIES_JSON_URL)
      end
    end
  end
end

if __FILE__ == $0
  p TogoSite::Human.generate
end
