class Vote < ApplicationRecord
  belongs_to :question
  
  validates :answer_text, presence: true
  validates :ip_address, presence: true
  validate :validate_answer_format
  validate :one_vote_per_question_per_ip

  private

  def validate_answer_format
    if question.question_type == 'multiple_choice' && !question.options.include?(answer_text)
      errors.add(:answer_text, 'must be one of the provided options')
    end
  end

  def one_vote_per_question_per_ip
    if Vote.where(ip_address: ip_address, question_id: question_id)
           .where.not(id: id)
           .exists?
      errors.add(:base, "You have already answered this question")
    end
  end
end