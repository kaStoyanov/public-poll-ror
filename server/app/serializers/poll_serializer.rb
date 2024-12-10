class PollSerializer < ActiveModel::Serializer
    attributes :id, :title, :created_at
    has_many :questions
    belongs_to :creator
  end
  