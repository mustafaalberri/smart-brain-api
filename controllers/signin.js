const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('login').where('email', '=', email)
    .then(user => {
        const isValid = bcrypt.compareSync(password, user[0].hash);
        return isValid?(
            db.select('*').from('users').where('email', '=', email)
                .then(user => res.json(user[0]))
                .catch(() => res.status(400).json('Mmmm... something wrong has happened, unable to get user.'))
        ):(res.status(400).json('Wrong Credentials'))
    }).catch(() => res.status(400).json('Wrong credentials, unable to sign in.'))
}

const handleLogin = (req, res, db) => {
    if (req.session.user){
        db.select('*').from('users').where('email', '=', req.session.user)
                .then(user => {return res.json(user[0])})
                .catch(() => res.status(400).json('Mmmm... something wrong has happened, unable to get user.'))
    }else
        return res.json('Session ended.');
}

const handleLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/loggedin');
};

module.exports ={
    handleSignIn,
    handleLogout,
    handleLogin,
};
