class AuthorizationsController < Devise::OmniauthCallbacksController
  before_action :set_origin, only: [:create, :failure]
   def callback # creates auth
    set_origin # note that alias_method will skip callbacks on the destination method!
    Rails.logger.warn "AuthorizationsController:callback has @destination == #{@destination}"
    relevant_auth = nil
    oauth_params = request.env['omniauth.auth']
    existing_auth = Authorization.find_from_oauth(oauth_params)
    if existing_auth # found existing auth for that provider
      existing_auth.update_tokens(oauth_params)
      relevant_auth = existing_auth
      notice = "Welcome back, #{relevant_auth.user}!"
      if relevant_auth.oauth_expires_at.present?
        notice += "Login good until #{relevant_auth.expire_s}"
      end
    else # no existing auth; this auth is for a new source!
      # we probably have a current_user... who may be a guest or registered.
      ensure_user # at least start with a guest!
      relevant_auth = Authorization.create_from_oauth(oauth_params, current_user)
      if current_user.present?
        if current_user.registered?
          notice = "Successfully linked that account!"
        else # nil, or guest
          # now that we have a key from at least this auth, we can
          # upgrade user from guest to registered
          current_user.register_with_key_and_save(relevant_auth.user_key)
          notice = "Welcome, #{relevant_auth.user}!"
          if relevant_auth.oauth_expires_at.present?
            notice += "Login good until #{relevant_auth.expire_s}"
          end
        end
      else
        notice = "Error: failed to create any user at all!"
      end
    end
    # Log the authorizing user in, and merge with anything from current_user... be it from guest, or other auth
    set_current_user_with_merge(relevant_auth.user)
    redirect_to @destination, status: :found, notice: notice
  end

  def failure
    redirect_to @destination, status: :see_other, alert: "Connection failed"
  end

  # note that alias_method will skip callbacks on the destination method!
  # omniauth passes through auth/:provider calls to respective rack gem, per:
  # http://stackoverflow.com/questions/5531263/omniauth-doesnt-work-with-route-globbing-in-rails3
  # that's not what these are! these are calls to auth/:action/callback
  alias_method :facebook, :callback
  alias_method :twitter, :callback

  protected

  # This is necessary since Rails 3.0.4
  # See https://github.com/intridea/omniauth/issues/185
  # and http://www.arailsdemo.com/posts/44
  def handle_unverified_request
    true
  end

  def set_origin
    origin = request.env['omniauth.origin']
    @destination = origin.blank? ? root_path : origin
    Rails.logger.warn "AuthorizationsController:set_origin has @destination == #{@destination}, origin == #{origin}, root_path == #{root_path}"
    return @destination
  end
end
