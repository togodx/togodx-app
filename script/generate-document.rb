#!/usr/bin/env ruby
require 'open-uri'
require 'json'

class TogoSite
  module Subjects
    def get_subjects_config(url)
      JSON.load(open(url).read)
    end

    def markdown_template
      markdown = ''
      markdown << "# TogoSite Data sources\n\n"
      markdown
    end

    def generate_markdown(url)
      markdown = markdown_template
      get_subjects_config(url).each do |subject|
        markdown << "## Subject: #{subject["subject"]}\n\n"
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
