# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

dev_user = User.find_by(key: "dev")
if dev_user.blank?
  dev_user = User.create(email: "dev@dev.dev", key: "dev")
end
if dev_user.authorizations.count < 1
  dev_user.authorizations << Authorization.create(provider: "facebook", name: "dev", uid: 0)
end
all_tag = ActsAsTaggableOn::Tag.find_by(name: "all")
if all_tag.blank?
  all_tag = ActsAsTaggableOn::Tag.create(name: "all")
end
