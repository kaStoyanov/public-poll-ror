FactoryBot.define do
  factory :vote do
    answer_text { Faker::Lorem.sentence }
    ip_address { Faker::Internet.ip_v4_address }
    association :question
  end
end