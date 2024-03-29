cp .env-example .env.$NODE_ENV
sed -ri 's/^NODE_ENV=/NODE_ENV=\$NODE_ENV/' .env.$NODE_ENV
sed -ri 's/^APP_BASE_URL=/APP_BASE_URL=\$APP_BASE_URL/' .env.$NODE_ENV
sed -ri 's/^APP_VERSION=/APP_VERSION=\$APP_VERSION/' .env.$NODE_ENV
sed -ri 's/^API_SWAGGER=/API_SWAGGER=\$API_SWAGGER/' .env.$NODE_ENV
sed -ri 's/^PORT=/PORT=\$PORT/' .env.$NODE_ENV
sed -ri 's/^TIMEZONE=/TIMEZONE=\$TIMEZONE/' .env.$NODE_ENV
sed -ri 's/^SECRET=/SECRET=\$SECRET/' .env.$NODE_ENV
sed -ri 's/^GAME_ENGINE_PORT=/GAME_ENGINE_PORT=\$GAME_ENGINE_PORT/' .env.$NODE_ENV

# DATABASE CONFIG
sed -ri 's/^DATABASE_NAME=/DATABASE_NAME=\$DATABASE_NAME/' .env.$NODE_ENV
sed -ri 's/^DATABASE_HOST=/DATABASE_HOST=\$DATABASE_HOST/' .env.$NODE_ENV
sed -ri 's/^DATABASE_PORT=/DATABASE_PORT=\$DATABASE_PORT/' .env.$NODE_ENV
sed -ri 's/^DATABASE_USER=/DATABASE_USER=\$DATABASE_USER/' .env.$NODE_ENV
sed -ri 's/^DATABASE_PASSWORD=/DATABASE_PASSWORD=\$DATABASE_PASSWORD/' .env.$NODE_ENV
sed -ri 's/^DATABASE_SSL_ENABLED=/DATABASE_SSL_ENABLED=\$DATABASE_SSL_ENABLED/' .env.$NODE_ENV

# REDIS CONFIG 
sed -ri 's/^REDIS_HOST=/REDIS_HOST=\$REDIS_HOST/' .env.$NODE_ENV
sed -ri 's/^REDIS_PORT=/REDIS_PORT=\$REDIS_PORT/' .env.$NODE_ENV
sed -ri 's/^REDIS_DB=/REDIS_DB=\$REDIS_DB/' .env.$NODE_ENV

# AWS CONFIG
sed -ri 's/^AWS_QUESTION_BUCKET=/AWS_QUESTION_BUCKET=\$AWS_QUESTION_BUCKET/' .env.$NODE_ENV
sed -ri 's/^AWS_REGION=/AWS_REGION=\$AWS_REGION/' .env.$NODE_ENV
sed -ri 's/^AWS_ACCESS_KEY_ID=/AWS_ACCESS_KEY_ID=\$AWS_ACCESS_KEY_ID/' .env.$NODE_ENV
sed -ri 's/^AWS_ACCESS_SECRET_KEY=/AWS_ACCESS_SECRET_KEY=\$AWS_ACCESS_SECRET_KEY/' .env.$NODE_ENV
