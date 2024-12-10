# app/models/question.rb
class Question < ApplicationRecord
  belongs_to :poll
  has_many :votes, dependent: :destroy
  
  validates :text, presence: true
  validates :question_type, inclusion: { in: ['text', 'multiple_choice'] }
  validate :validate_options_if_multiple_choice
  
  def options
    JSON.parse(self[:options] || '[]') # ugly but works
  end
  
  def options=(value)
    self[:options] = value.to_json
  end
  
  private
  
  def validate_options_if_multiple_choice
    if multiple_choice? && options.empty?
      errors.add(:options, "can't be empty for multiple choice questions")
    end
  end
  
  def multiple_choice?
    question_type == 'multiple_choice'
  end
end