class User < ApplicationRecord
    has_secure_password
    
    has_many :polls, foreign_key: 'creator_id'
    has_many :votes
    
    enum role: { user: 0, admin: 1 }
    
    validates :email, presence: true, uniqueness: true
    validates :password_digest, presence: true
  end