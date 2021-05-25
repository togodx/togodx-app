#!/usr/bin/env ruby
require 'open-uri'
require 'json'

class TogoSite
  module Subjects
    def get_json(url)
      JSON.load(open(url).read)
    end

    def markdown_template
      markdown = ''
      markdown << "# TogoSite Data sources\n\n"
      markdown
    end

    def sparqlist_description(sparqlist_api_url)
      sparqlet = get_json(sparqlist_api_url.sub("/api/","/-api/sparqlets/"))["data"]["attributes"]["src"]
      sparqlet.split(/\R#+ /).select{|node| node =~ /^Description/}[0].sub(/^Description\n+/,"")
    rescue NoMethodError
      "- No description\n"
    end

    def generate_markdown(subject_config_url)
      markdown = markdown_template
      get_json(subject_config_url).each do |subject|
        markdown << "## Subject: #{subject["subject"]}\n\n"

        subject["properties"].each do |property|
          markdown << "### #{property["label"]}\n\n"
          markdown << "#{property["description"]}\n\n"
          markdown << "- Identifier: #{property["primaryKey"]}\n"
          markdown << "- SPARQList endpoint: #{property["data"]}\n"
          markdown << sparqlist_description(property["data"])
          markdown << "\n"
        end
      end
      markdown
    end
  end

  module Human
    SUBJECTS_JSON_URL = "https://github.com/dbcls/togosite/raw/develop/config/togosite-human/properties.json"

    class << self
      include Subjects

      def generate
        generate_markdown(SUBJECTS_JSON_URL)
      end
    end
  end
end

if __FILE__ == $0
  puts TogoSite::Human.generate
end
