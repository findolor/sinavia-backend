eb setenv `cd .. && cat .env.test | sed '/^#/ d' | sed '/^$/ d'`