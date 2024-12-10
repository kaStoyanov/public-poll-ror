class Api::AuthController < ApplicationController
    def login
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        token = JWT.encode({ user_id: user.id }, Rails.application.credentials.secret_key_base)
        render json: { token: token, user: user }
      else
        render json: { error: 'Invalid credentials' }, status: :unauthorized
      end
    end
  end