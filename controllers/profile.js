const getProfile = (req, res, db) => {
    const { id } = req.params;
    db('users').select('*').where('id', '=', id)
        .then(user => user.length? res.json(user[0]): res.status(400).json('Error getting user'))
        .catch(() => res.status(400).json('User not found'))
}

module.exports = {
    getProfile
};