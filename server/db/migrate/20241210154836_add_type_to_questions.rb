class AddTypeToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :question_type, :string, default: 'text'
    add_column :questions, :options, :text, array: true, default: '[]'
  end
end