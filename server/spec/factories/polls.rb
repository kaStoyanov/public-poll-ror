FactoryBot.define do
  factory :poll do
    title { Faker::Lorem.sentence }
    association :creator, factory: :admin 
  end
end
