class Api::PollsController < ApplicationController
    before_action :authenticate_user!, except: [:show]
    before_action :admin_only!, only: [:create, :update, :destroy]
    
    def index
      polls = Poll.all
      render json: polls
    end
    
    def show
      poll = Poll.find(params[:id])
      render json: poll
    end
    
    def create
      poll = current_user.polls.build(poll_params)
      if poll.save
        render json: poll, status: :created
      else
        render json: { errors: poll.errors }, status: :unprocessable_entity
      end
    end
    
    def votes
      poll = Poll.find(params[:id])
      votes_by_question = poll.questions.each_with_object({}) do |question, hash|
        hash[question.id] = question.votes
      end
      
      render json: votes_by_question
    end

    private
    
    def poll_params
      params.require(:poll).permit(
        :title,
        questions_attributes: [:text, :question_type, options: []]
      )
    end
  end