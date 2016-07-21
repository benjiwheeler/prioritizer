# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

if User.find_by(key: "dev").blank?
  dev_user = User.create(email: "dev@dev.dev", key: "dev")
  dev_user.authorizations << Authorization.create(provider: "facebook", name: "dev")
end
