require 'rails_helper'

RSpec.describe "Polls", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  
  describe "GET /api/polls" do
    before do
      create_list(:poll, 3)
    end

    it "returns all polls" do
      get "/api/polls"
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body).length).to eq(3)
    end
  end

  describe "GET /api/polls/:id" do
    let(:poll) { create(:poll) }
    let!(:questions) { create_list(:question, 2, poll: poll) }

    it "returns the poll and questions" do
      get "/api/polls/#{poll.id}"
      expect(response).to have_http_status(200)
      
      json = JSON.parse(response.body)
      expect(json['title']).to eq(poll.title)
      expect(json['questions'].length).to eq(2)
    end

    it "returns 404 for non-existent poll" do
      get "/api/polls/999999"
      expect(response).to have_http_status(404)
      expect(JSON.parse(response.body)).to include('error' => 'Poll not found')
    end
  end

  describe "POST /api/polls" do
    let(:valid_attributes) do
      {
        poll: {
          title: "Test Poll",
          questions_attributes: [
            { text: "Question 1", question_type: "text" },
            { 
              text: "Question 2", 
              question_type: "multiple_choice",
              options: ["Option 1", "Option 2"]
            }
          ]
        }
      }
    end

    context "admin user" do
      before do
        allow_any_instance_of(Api::PollsController).to receive(:current_user).and_return(admin)
      end

      it "creates a new poll" do
        expect {
          post "/api/polls", params: valid_attributes
        }.to change(Poll, :count).by(1)
        
        expect(response).to have_http_status(201)
      end
    end

    context "regular user" do
      before do
        allow_any_instance_of(Api::PollsController).to receive(:current_user).and_return(user)
      end

      it "returns forbidden status" do
        post "/api/polls", params: valid_attributes
        expect(response).to have_http_status(403)
      end
    end
  end
end