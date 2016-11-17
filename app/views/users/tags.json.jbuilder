json.tags @tags do |tag|
  json.extract! tag, :id, :name, :taggings_count
end
