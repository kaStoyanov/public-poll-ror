class Poll < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  has_many :questions, dependent: :destroy
  
  accepts_nested_attributes_for :questions
  
  validates :title, presence: true
end