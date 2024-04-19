# you need docker installed
cd dev-compose
docker-compose up -d
cd ..
bun install
bun run migrate
bun run start
