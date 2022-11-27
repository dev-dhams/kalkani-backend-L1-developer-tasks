const express = require("express");
require("dotenv").config();
const databaseConnection = require("./connectDatabase");
const User = require("./models/UserSchema");
const Address = require("./models/AddressSchema");
const validateUserData = require("./middleware/validateUserData");

const app = express();
app.use(express.json({ extended: false }));
databaseConnection();

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/search", async (req, res) => {
    const { first_name, last_name, email, city, age_gt, age_lt } = req.query;

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
                    + age_gt || 0,
                ],
            };
            return query;
        }
    };

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
