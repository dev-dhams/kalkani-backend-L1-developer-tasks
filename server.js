const express = require("express");
require("dotenv").config();
const databaseConnection = require("./connectDatabase");
const User = require("./models/UserSchema");
const Address = require("./models/AddressSchema");
const validateUserData = require("./middleware/validateUserData");

/* Note : All the error message send back to front-end is simple, we can use much more detailed error responses */

const app = express();
app.use(express.json({ extended: false }));
databaseConnection();

app.get("/", (req, res) => {
    res.send(
        `API ENDPOINTS :\n    
        1. To add user in data base POST : http://localhost:4000/user\n 
        2. To search user : GET http://localhost:4000/search?city=Mumbai&age_lt=25 \n(For more info view /postman directory and import that json file in postman\n 
        Note : please change MONGODB_URI in .env file to communicate with DATABASE properly`
    );
});

// @route  /search
// @desc   Find user from database
// @query params :  first_name, last_name, email, city, age_gt, age_lt
app.get("/search", async (req, res) => {
    const { first_name, last_name, email, city, age_gt, age_lt } = req.query;

    /* Create normal query for first_name, last_name, email, city */
    const myQuery = (first_name, last_name, email, city) => {
        let query = { $match: {} };
        if (first_name)
            query.$match.first_name = { $regex: first_name, $options: "i" };
        if (last_name)
            query.$match.last_name = { $regex: last_name, $options: "i" };
        if (email) query.$match.email = { $regex: email, $options: "i" };
        if (city) query.$match.addresses = { $elemMatch: { city: city } };
        return query;
    };

    /* Date query is some what tricky, first have to calculate age of user at current day 
    and then check either it is greater then or less then query age */
    const dateQuery = (age_gt, age_lt, res) => {
        if (age_gt && age_lt)
            return res.send(
                "Please provide either age greater then of age less then query, not both"
            );
        let query = { $match: {} };
        if (age_lt && age_lt > 0) {
            query.$match.$expr = {
                $lte: [
                    {
                        $dateDiff: {
                            startDate: "$birth_date",
                            endDate: "$$NOW",
                            unit: "year",
                        },
                    },
                    +age_lt,
                ],
            };
            return query;
        } else {
            query.$match.$expr = {
                $gte: [
                    {
                        $dateDiff: {
                            startDate: "$birth_date",
                            endDate: "$$NOW",
                            unit: "year",
                        },
                    },
                    +age_gt || 0,
                ],
            };
            return query;
        }
    };

    /* Using mongodb aggregate pipeline to perform date query in database 
    We can use other query methods as well */
    try {
        const users = await User.aggregate([
            {
                ...myQuery(first_name, last_name, email, city),
            },
            { ...dateQuery(age_gt, age_lt, res) },
        ]);
        if (users || users === []) return res.send(users);
        return res.send("Users not found!");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

// @route  /user
// @desc   Add user in database
// @body params :  please import /postman in postman api client for more info
app.post("/user", validateUserData, async (req, res) => {
    const { first_name, last_name, email, phone_number, birth_date } =
        req.body.user;
    try {
        const address = new Address({
            ...req.body.user.address,
        });
        const user = new User({
            first_name,
            last_name,
            email,
            phone_number,
            birth_date,
        });
        user.addresses.push(address);
        await user.save();
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email)
            return res
                .status(409)
                .send("This email is already in use, kindly use another email");
        if (error.code === 11000 && error.keyPattern.phone_number)
            return res
                .status(409)
                .send(
                    "This phone number is already in use, kindly use another phone number"
                );
        return res.send(error.message);
    }
    return res.send("User added successfully");
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`App listening on port ${process.env.PORT || 4000}`);
});
