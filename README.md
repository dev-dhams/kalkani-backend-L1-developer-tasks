# Backend (Express.js & Mongodb) practical task 
> Task : Write a SPA application with backend Rest API

## Getting started / Installing

Please follow below steps to install dependencies and run this project.

```shell
git clone https://github.com/dev-dhams/kalkani-backend-L1-developer-tasks
cd kalkani-backend-L1-developer-tasks
```
Note : Before running this project, make user that MONGODB_URI is properly configured in .env file. after that install dependencies and run this project.
```shell
npm install
npm start
```

## Developing

### Built With
* Express.js : Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* Mongodb : MongoDB is a source-available cross-platform document-oriented database program. 


### Prerequisites
Node.js properly configured.

## Api Reference
There two api endpoints
1. Add user in database
POST : `http://localhost:4000/user`
Headers : `Content-Type:application/json`
Body : 
```json
{
    "user": {
        "first_name": "Terry",
        "last_name": "Medhurst",
        "email": "atunwes@sohu.com",
        "phone_number": "2234566890",
        "birth_date": "2000-12-25",
        "address": {
            "line_1": "1745 T Street",
            "line_2": "Southeast",
            "pincode": "200201",
            "city": "Mumbai",
            "state": "MH",
            "type": "Home"
        }
    }
}
```

2. Find user from database:
GET: `http://localhost:4000/search?city=Mumbai&age_lt=25`
Queries:
```json
http://localhost:4000/search?
first_name=Eleanora&
last_name=Medhurst&
email=atunweerry22301@sohu.com&
city=Mumbai&
age_gt=40&
age_lt=25
```
Make sure age_gt and age_lt are not used at same time
age_gt=25 (age 25 years greater equal)
age_lt=21 (ageless equal than 21 years)
