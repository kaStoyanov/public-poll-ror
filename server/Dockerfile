FROM ruby:3.0.2

WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y nodejs sqlite3

COPY Gemfile Gemfile.lock ./
RUN gem install bundler
RUN bundle config set force_ruby_platform true
RUN bundle install

COPY . .

RUN bundle exec rails db:create db:migrate

EXPOSE 3000

CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec rails db:seed && bundle exec rails server -b '0.0.0.0'"]