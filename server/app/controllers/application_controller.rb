class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  private

  def authenticate_user!
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def admin_only!
    unless current_user&.role == 'admin'
      render json: { error: 'Forbidden. Admin access required.' }, status: :forbidden
    end
  end
  
  def votes
    poll = Poll.find(params[:id])
    votes_by_question = {}
    
    poll.questions.each do |question|
      votes_by_question[question.id] = question.votes.map do |vote|
        {
          id: vote.id,
          answer_text: vote.answer_text,
          ip_address: vote.ip_address,
          created_at: vote.created_at
        }
      end
    end
    
    render json: votes_by_question
  end

  def current_user
    @current_user ||= User.find(decoded_token['user_id']) if decoded_token
  end

  def decoded_token
    header = request.headers['Authorization']
    if header
      token = header.split(' ')[1]
      begin
        JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      rescue JWT::DecodeError
        nil
      end
    end
  end
end