web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
client: sh -c 'rm app/assets/webpack/* || true && cd client && npm run build:development'
