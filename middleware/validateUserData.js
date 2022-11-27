module.exports = async (req, res, next) => {
    const { first_name, last_name, email, phone_number, birth_date } =
        req.body.user;
    const { line_1, pincode, city, state } = req.body.user.address;

    // Validate first name
    if (!first_name) return res.status(105).send("Please enter your first name");

    // Validate last name
    if (!last_name) return res.status(105).send("Please enter your last name");

    // Validate email
    if (!email || !email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/))
        return res.status(105).send("Please enter valid email");

    // Validate phone number
    if (!phone_number || phone_number > 9999999999 || phone_number < 999999999)
        return res.status(105).send("Please enter valid phone number");

    // Check if address is present in request
    if (!req.body.user.address) return res.status(105).send("Please enter address");

    // Validate address line one
    if (!line_1)
        return res.status(105).send("Please enter address line, i.e. street name");

    // Validate pincode
    if (!pincode || pincode > 999999 || pincode <= 999)
        return res.status(105).send("Please enter valid pincode");

    // Validate city
    if (!city) return res.status(105).send("Please enter name of your city");

    // Validate state
    if (!state) return res.send("Please enter name of your state");
    next();
};
