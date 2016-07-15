class CreateAuthorizations < ActiveRecord::Migration
  def change
    create_table :authorizations do |t|
      t.references :user, index: true, foreign_key: true
      t.string :provider
      t.string :uid
      t.string :oauth_token
      t.datetime :oauth_expires_at
      t.string :oauth_secret
      t.string :name
      t.string :nickname
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :location
      t.string :description
      t.string :image
      t.string :phone
      t.json :urls
      t.json :raw_info

      t.timestamps null: false
    end
  end
end
