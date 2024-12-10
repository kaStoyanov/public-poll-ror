class CreatePolls < ActiveRecord::Migration[6.1]
  def change
    create_table :polls do |t|
      t.string :title
      t.references :creator, foreign_key: { to_table: :users }
      
      t.timestamps
    end
  end
end
