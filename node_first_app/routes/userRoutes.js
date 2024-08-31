const { log } = require("console")
const jsonfile = require("jsonfile")
const path = require('path')



module.exports = function (app) {
    const userJson = path.resolve(__dirname, '../DB/users.json')

    app.get("/users", (req, res) => {

        jsonfile.readFile(userJson, (err, content) => {
            content.status = ({ "code": 200, "message": "OK" })

            if (err) {
                console.error('Error reading JSON file:', err)
                return res.status(500).json({ error: 'Internal server error' })
            }
            console.log(`/GET USERS `);

            res.json(content)
        })
    })

    app.post("/users/new", (req, res) => {

        let email = req.body.email
        let username = req.body.username

        jsonfile.readFile(userJson, (err, content) => {

            content.users.push({ email: email, username: username })

            console.log("added " + email + "to DB")

            jsonfile.writeFile(userJson, content, function (err) {
                console.log(err)
            })
            console.log(`/POST USER `);

            res.sendStatus(200)
        })

    })
}