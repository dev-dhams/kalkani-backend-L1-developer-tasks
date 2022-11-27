const axios = require("axios");
var { users } = require("./dummyUsers.json");

const saveUserToDatabase = async (user) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    // const body = JSON.stringify(user);
    const body = user;
    try {
        var res = await axios.post(
            "http://localhost:4000/api/user",
            body,
            config
        );
        console.log(res.data);
    } catch (error) {
        console.log(error);
        console.log(
            "Make sure you start a server first $npm start and then run node data_seeder/data_seeder.js"
        );
    }
};

users.forEach(async (u) => {
    const userData = {
        user: {
            first_name: u.firstName,
            last_name: u.lastName,
            email: u.email,
            phone_number: u.phone.replace(/ /g, "").slice(-10),
            birth_date: u.birthDate,
            address: {
                line_1: u.address.address,
                line_2: users[Math.floor(Math.random() * 30)].address.address,
                pincode: u.address.postalCode,
                city: u.address.city,
                state: u.address.state,
                type: new Array("home", "office")[
                    Math.floor(Math.random() * 2)
                ],
            },
        },
    };
    await saveUserToDatabase(userData);
    console.error(u.id);
});
