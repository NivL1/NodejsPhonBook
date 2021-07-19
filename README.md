# NodejsPhonBook

Simple Nodejs phone book http server
The system designed to handle multiple database connection options


# Run with Docker Compose
System requierments:
docker, docker-compose

1. Run: docker-compose build --no-cache
2. Run: docker-compose up
3. Make a get request to http://localhost:3000/api/website/1.0/contacts/setDb to initialize the required database tables


# Run without Docker 
System requiermets:
npm, running mysql server on port 3306

1. Open database scheme named `rise_db`
2. Run: npm install -g nodemon
3. Run: npm install express --save
4. Run: npm start
5. Make a get request to http://localhost:3000/api/website/1.0/contacts/setDb to initialize the required database tables
