## Key Features

- Admins can create polls (open answers and select predefined answer types)

- Unauthenticated users can answer polls

- Admins can view polls' results

## Intro Sources for Ruby on Rails

- [guide](https://daily.dev/blog/ruby-on-rails-beginners-guide-2024)

- [Ruby on Rails Explained In 6 Minutes](https://www.youtube.com/watch?v=ts8L5fuwIjg)

- [Official docs(pretty descent)](https://rubyonrails.org/)

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
