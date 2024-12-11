require 'rails_helper'

RSpec.describe "Votes", type: :request do
  let(:poll) { create(:poll) }
  let(:question) { create(:question, poll: poll) }
  let(:multiple_choice_question) { create(:question, :multiple_choice, poll: poll) }

  describe "POST /api/votes" do
    context "with single text answer" do
      let(:valid_attributes) do
        {
          votes: [{
            question_id: question.id,
            answer_text: "My answer"
          }]
        }
      end

      it "creates a new vote" do
        expect {
          post "/api/votes", params: valid_attributes
        }.to change(Vote, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end

      it "prevents duplicate votes from same IP" do
        post "/api/votes", params: valid_attributes
        post "/api/votes", params: valid_attributes
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(Vote.count).to eq(1)
      end
    end

    context "with multiple choice answer" do
      let(:valid_option) { JSON.parse(multiple_choice_question.options).first }
      let(:valid_attributes) do
        {
          votes: [{
            question_id: multiple_choice_question.id,
            answer_text: valid_option
          }]
        }
      end

      it "creates a vote with valid option" do
        expect {
          post "/api/votes", params: valid_attributes
        }.to change(Vote, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end

      it "rejects invalid option" do
        post "/api/votes", params: {
          votes: [{
            question_id: multiple_choice_question.id,
            answer_text: "Invalid Option"
          }]
        }
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "with multiple answers" do
      let(:valid_attributes) do
        {
          votes: [
            {
              question_id: question.id,
              answer_text: "Answer 1"
            },
            {
              question_id: multiple_choice_question.id,
              answer_text: JSON.parse(multiple_choice_question.options).first
            }
          ]
        }
      end

      it "creates multiple votes" do
        expect {
          post "/api/votes", params: valid_attributes
        }.to change(Vote, :count).by(2)
        
        expect(response).to have_http_status(:created)
      end

      it "validates at least one answer" do
        post "/api/votes", params: { votes: '' }
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to include('Please answer at least one question')
      end
    end
  end
end