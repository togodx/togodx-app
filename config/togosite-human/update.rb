require 'json'

class Property
  def initialize(property)
    @id = property["propertyId"]
    @label = property["label"]
    @desc = property["description"]
    @data = property["data"]
    @data_source = property["dataSource"]
    @data_source_url = property["dataSourceUrl"]
    @update = property["updatedAt"]
    @key = property["primaryKey"]
    @keyLabel = property["keyLabel"]
  end
  attr_accessor :id, :label, :desc, :data, :data_source, :data_source_url, :update, :key, :keyLabel

  def attribute
    {
      id: @id,
      label: @label,
      description: @desc,
      data: @data,
      idType: @key,
      dataSource: {
        label: @data_source,
        url: @data_source_url,
        updateDate: @update,
      },
    }
  end
end

class Subject
  def initialize(subject)
    @id = subject["subjectId"]
    @label = subject["subject"]
    @properties = subject["properties"].map{|prop| Property.new(prop) }
  end
  attr_accessor :id, :label, :properties
end

properties = JSON.load(open("./properties.json").read)
config = properties.each_with_object({}) do |subject, hash|
  hash[:tracks] ||= []
  hash[:attributes] ||= {}
  hash[:idTypes] ||= {}

  s = Subject.new(subject)

  # identifiers
  ids = s.properties.map{|p| { idType: p.key, label: p.keyLabel } }.uniq

  ids.each do |id|
    type = id.delete(:idType)
    id[:template] = "https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates/#{type}.hbs"
    id[:target] = true

    hash[:idTypes][type] = id
  end

  s.properties.each do |prop|
    a = prop.attribute
    id = a.delete(:id)
    hash[:attributes][id] = a
  end

  # categories and attributes
  h = {
    id: s.id,
    label: s.label,
    attributes: s.properties.map{|p| p.id }
  }

  hash[:tracks] << h
end

id_types = config[:idTypes].keys
id_types.each do |id|
  config[:idTypes][id][:conversion] = id_types.each_with_object({}) do |oid, hash|
    hash[oid] = "https://api.togoid.jp/convert?format=json&route=#{id},#{oid}" if id != oid
  end
end

puts JSON(config)
