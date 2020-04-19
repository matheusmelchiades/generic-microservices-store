#!/bin/bash
set -e;

if [ -n "${MONGO_USERNAME:-}" ] && [ -n "${MONGO_PASSWORD:-}" ]; then
	"${mongo[@]}" "$MONGO_DATABASE" <<-EOJS
	  db.createUser({
      user: $(_js_escape "$MONGO_USERNAME"),
      pwd: $(_js_escape "$MONGO_PASSWORD"),
      roles: [{
        role: $(_js_escape "$MONGO_ROLE"),
        db: $(_js_escape "$MONGO_DATABASE")
      }]
    })
	EOJS
  echo "USER CREATED WITH SUCCESS!"
else
  echo ""
fi
