const getUsers = (req, res, db) => {
    db('users').select('*')
        .then(users => res.json(users))
        .catch(() => res.status(400).json('Mmmm... something wrong has happened'))
}

module.exports = { 
    getUsers
};