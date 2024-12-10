class Api::VotesController < ApplicationController
  def create
    begin
      if params[:votes].blank? || params[:votes].empty?
        render json: { error: 'Please answer at least one question' }, status: :unprocessable_entity
        return
      end
      ActiveRecord::Base.transaction do
        if params[:votes]
          errors = []
          params[:votes].each do |vote_param|
            begin
              create_vote(vote_param)
            rescue ActiveRecord::RecordInvalid => e
              errors << {
                question_id: vote_param[:question_id],
                error: e.record.errors.full_messages.first
              }
            end
          end
          
          if errors.any?
            render json: { errors: errors }, status: :unprocessable_entity
          else
            render json: { message: 'Votes recorded successfully' }, status: :created
          end
        else
          # Handle single vote...
        end
      end
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

 
  def create_vote(vote_param)
    vote = Vote.new(
      question_id: vote_param[:question_id],
      answer_text: vote_param[:answer_text],
      ip_address: request.remote_ip
    )
    
    question = Question.find(vote_param[:question_id])
    if question.question_type == 'multiple_choice' && !question.options.include?(vote_param[:answer_text])
      vote.errors.add(:answer_text, 'Invalid option selected')
      raise ActiveRecord::RecordInvalid.new(vote)
    end
    
    unless vote.save
      raise ActiveRecord::RecordInvalid.new(vote)
    end
  end

  def already_voted?
    Vote.exists?(
      ip_address: request.remote_ip,
      question: Question.find(vote_params[:question_id]).poll.questions
    )
  end


  def vote_params
    params.require(:vote).permit(:question_id, :answer_text)
  end
end