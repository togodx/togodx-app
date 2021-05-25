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
    def properties_json_url
      "https://github.com/dbcls/togosite/raw/develop/config/togosite-human/properties.json"
    end

    class << self
      def generate
        "markdown"
      end
    end
  end
end

if __FILE__ == $0
  p TogoSite::Human.generate
end
