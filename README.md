npx prisma generate --schema apps/users/prisma/schema.prisma

chmod -R +x ./scripts

There is a problem that for migration database needed so this wont work:

DATABASE_URL="postgresql://johndoe:randompassword@database:5432/postgresql"

to work this should be

DATABASE_URL="postgresql://johndoe:randompassword@localhost:3032/postgresql"
