const { log } = require("console")
const jsonfile = require("jsonfile")
const path = require('path')



module.exports = (app) => {
    const userJson = path.resolve(__dirname, '../DB/users.json')

    app.get("/users", (req, res) => {

        jsonfile.readFile(userJson, (err, content) => {

            if (err) {
                console.error('Error reading JSON file:', err)
                return res.status(500).json({ error: 'Internal server error' })
            }
            console.log(`/GET USERS `)

            let datas = [{
                code: 200,
                message: "OK",
                datas: content
            }]

            res.json(datas)
        })
    })

    app.get("/user", (req, res) => {

        let emailParam = req.query.email

        jsonfile.readFile(userJson, (err, datas) => {

            userData = [...datas.users]
            username = userData.find(user => user.email === emailParam)

            if (username)
                res.send(username)
            else
                res.send('Email no exists.')
        })
        console.log(`/GET USER : ${emailParam}`);
    })

    app.delete("/users", (req, res) => {
        let emailParam = req.query.email

        jsonfile.readFile(userJson, (err, datas) => {

            if (err)
                return res.status(500).send({ error: 'Error reading user data' })

            let userData = datas
            let userIndex = userData.users.findIndex(user => user.email === emailParam)

            if (userIndex > 0) {
                userData.users.splice(userIndex)
                res.send(`DELETE USER : ${emailParam}`)
            }
            else {
                res.send('User no exists.')
            }

            jsonfile.writeFile(userJson, userData, (err) => {
                console.log(err)
            })

        })
        console.log(`/DELETE USER : ${emailParam}`);

    })

    app.post("/users/new", (req, res) => {

        let email = req.body.email
        let username = req.body.username

        jsonfile.readFile(userJson, (err, datas) => {
            
            userData = datas.users
            userIsExist = userData.find(user => user.email === email)

            if(!userIsExist)
                datas.users.push({ email: email, username: username })
            else
                res.send('User Exist !')

            jsonfile.writeFile(userJson, datas, (err) => {
                console.log(err)
            })
            console.log(`/POST USER `)

            res.sendStatus(200)
        })
    })

    app.put("/users", (req, res) => {

        let userChange
        let email = req.body.email
        let username = req.body.username

        jsonfile.readFile(userJson, (err, datas) => {

            if (err)
                return res.status(500).json({ error: err })

            for (const user of datas.users) {
                if (user.email == req.query.email) {

                    userChange = user
                    userChange.username = username
                    break
                }
            }

            jsonfile.writeFile(userJson, datas, (err) => {
                if (err)
                    res.status(400).json({ error: err })

                res.send(userChange)
            })
            console.log(`/PUT USER : ${req.query.email} `)
        })

    })
}