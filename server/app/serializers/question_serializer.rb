class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :question_type, :options

  def options
    object.options
  end
end