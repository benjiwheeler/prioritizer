class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
#  devise :database_authenticatable, :registerable,
#         :recoverable, :rememberable, :trackable, :validatable
  devise :rememberable, :trackable, :timeoutable
  devise :omniauthable, :omniauth_providers => [:facebook, :twitter]
  has_many :authorizations, dependent: :destroy

  def to_s
    self.name
  end

  def name
    self.authorizations.each do |auth|
      return auth.name unless auth.name.blank?
    end
    self.authorizations.each do |auth|
      return auth.screen_name unless auth.screen_name.blank?
    end
    self.authorizations.each do |auth|
      return auth.nickname unless auth.nickname.blank?
    end
    self.authorizations.each do |auth|
      return auth.email unless auth.email.blank?
    end
    return self.key unless self.key.blank?
    return "Guest"
  end

  def has_auth?(provider)
    self.authorizations.where(provider: provider.to_s).any?
  end

  def auth_field(provider, fieldname)
    return nil unless has_auth?(provider)
    self.authorizations.where(provider: provider.to_s).first.attributes[fieldname.to_s]
  end

  def User.find_from_key_or_create(user_key)
    existing_user = find_by_key(user_key)
    if existing_user.blank?
      User.create_from_key(user_key)
    end
  end

  def User.create_from_key(user_key)
#    binding.pry
    newuser = User.new
    newuser.key = user_key
#    newuser.password = Devise.friendly_token[0,20] # not sure what the deal is with this
    newuser.save!(:validate => false) # don't worry about email
    newuser
  end
end
