class CreateVotes < ActiveRecord::Migration[6.1]
  def change
    # Drop the existing table if it exists
    drop_table :votes if table_exists?(:votes)
    
    create_table :votes do |t|
      t.text :answer_text, null: false
      t.string :ip_address, null: false
      t.references :question, foreign_key: true, null: false
      t.timestamps
    end
    
    add_index :votes, [:ip_address, :question_id], unique: true
  end
end