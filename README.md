1. git init
2. git clone https://github.com/Whitewolf128/comp-3018-assignment1.git
3. git remote add origin https://github.com/Whitewolf128/comp-3018-assignment1.git
4. git add .
5. git commit -m "Initial commit"
6.git push -u origin main

if it does not work.
1.git pull origin main

install node.js and npm
1.npm init -y
2.npm install typescript@6 --save-dev
npm install typescript ts-node @types/node --save-dev
3.npm install express
4.npm install @types/express --save-dev
5.npm install jest ts-jest @types/jest supertest @types/supertest --save-dev
6. npm audit fix **fixes vulnerabilities for packages.
7. npm install morgan @types/morgan
8. npm install joi
9. npm install firebase-admin
*note: use --force if the packages have problems installing.
**note: or if you want to fix the packages use npm audit fix
*** note: use npm list joi to see what the version is
add to tsconfig.json
"rootDir": "src",
"types": ["node"],

Source for switch case expression: https://www.xjavascript.com/blog/typescript-switch-expression/

in package.json do:
"devDependencies": {
    "@types/express": "^5.0.6",
    "@types/jest": "^30.0.0",
    "@types/node": "^24.19.2",
    "@types/supertest": "^6.0.3",
    "jest": "^30.5.2",
    "supertest": "^7.3.1",
    "ts-jest": "^29.4.15",
    "ts-node": "^10.9.2",
    "typescript": "^6.0.3"
  },
  "dependencies": {
    "@types/morgan": "^1.9.10",
    "express": "^5.3.0",
    "joi": "^18.3.1",
    "morgan": "^1.12.1"
  },
  then do npm install

  for testing add import { beforeEach ,afterEach, describe, expect, it, jest } from "@jest/globals"; at the top to fix errors