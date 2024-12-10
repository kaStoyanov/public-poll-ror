# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_12_10_154836) do

  create_table "answers", force: :cascade do |t|
    t.string "text"
    t.integer "question_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["question_id"], name: "index_answers_on_question_id"
  end

  create_table "polls", force: :cascade do |t|
    t.string "title"
    t.integer "creator_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["creator_id"], name: "index_polls_on_creator_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "text"
    t.integer "poll_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "question_type", default: "text"
    t.text "options", default: "[]"
    t.index ["poll_id"], name: "index_questions_on_poll_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest"
    t.integer "role", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.text "answer_text", null: false
    t.string "ip_address", null: false
    t.integer "question_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ip_address", "question_id"], name: "index_votes_on_ip_address_and_question_id", unique: true
    t.index ["question_id"], name: "index_votes_on_question_id"
  end

  add_foreign_key "answers", "questions"
  add_foreign_key "polls", "users", column: "creator_id"
  add_foreign_key "questions", "polls"
  add_foreign_key "votes", "questions"
end
