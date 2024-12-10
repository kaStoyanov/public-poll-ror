class Answer < ApplicationRecord
    belongs_to :question
    has_many :votes, dependent: :destroy
    
    validates :text, presence: true
  end
  