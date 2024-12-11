## Key Features

```quote
These are the requirements:
- Be able to create a question ( e.g. What is your favorite food )
- Be able to add an unlimited amount of answers to each question (e.g. Mexican, Pizza, Pasta, Burger, etc )
- Be able to vote
```

### Hopefuly I got them right

- Admins can create polls (open answers and select predefined answer types)

- Unauthenticated users can answer polls

- Admins can view polls' results

## Intro Sources for Ruby on Rails

- [guide](https://daily.dev/blog/ruby-on-rails-beginners-guide-2024)

- [Ruby on Rails Explained In 6 Minutes](https://www.youtube.com/watch?v=ts8L5fuwIjg)

- [Official docs(pretty descent)](https://rubyonrails.org/)

- [Basic tests written with rspec](https://github.com/rspec/rspec-rails)

### Login as admin so you can test the app

- `email`: admin@example.com

- `password`: password

#### As we create it in the `seed.rb` for ease

```
User.create!(
  email: 'admin@example.com',
  password: 'password',
  role: 'admin'
) unless User.exists?(email: 'admin@example.com')
```

# Run the app

- ```bash
    docker compose up --build
  ```

# Run the basic tests (have to have container running already)

- ```bash
   docker compose exec api bundle exec rspec
  ```

- ```
    Finished in 0.25739 seconds (files took 0.33497 seconds to load)
    11 examples, 0 failures
  ```
