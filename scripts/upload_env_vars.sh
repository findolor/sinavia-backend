eb setenv `cat .env.test | sed '/^#/ d' | sed '/^$/ d'`