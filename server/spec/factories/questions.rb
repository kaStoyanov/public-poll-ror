FactoryBot.define do
  factory :question do
    text { Faker::Lorem.question }
    question_type { 'text' }
    options { '[]' }
    association :poll

    trait :multiple_choice do
      question_type { 'multiple_choice' }
      text { Faker::Lorem.question }
      options { ['Option 1', 'Option 2', 'Option 3'].to_json }
    end
  end
end