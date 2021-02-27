if [ ! -e "node_modules" ]; then
  npm install &
  (cd client/ ; npm install) &
  (cd client/ ; npx webpack) &
  (cd server/ ; npx tsc)
fi
  (cd client/ ; npx webpack --watch) &
  (cd server/ ; npx tsc --watch) &
  npx nodemon dist/server.js
