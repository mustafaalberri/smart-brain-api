const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    if (!name || !email || !password || password.includes(' ')){
        return res.status(400).json('Please enter valid information, unable to register.');
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx('login').insert({
            email: email,
            hash: hash,
        }).returning('email').then(loginEmail => {
                trx('users').insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date(),
                }, ['id', 'name', 'email', 'entries', 'joined'])
                .then(user => res.json(user[0]))
            })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(() => res.status(400).json('Mmmm... something wrong has happened, unable to register.'))
}

module.exports = {
    handleRegister
};