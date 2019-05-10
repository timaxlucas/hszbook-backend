
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByUsername
};

async function authenticate({ email, password }) {
    let user = await db.client.query("SELECT * FROM dbo.user WHERE email = $1", [email]);
    if (user.rowCount == 0) {
        return;
    }
    user = user.rows[0];
    
    if (bcrypt.compareSync(password, user.hash)) {
        const { hash, id, ...userWithoutHash } = user;
        let roles = (await db.client.query("SELECT role FROM dbo.role WHERE uid = $1", [user.id])).rows;
        roles = roles.map(o => o.role);
        const token = jwt.sign({ sub: user.id, roles: roles, email: user.email }, config.secret);
        return {
            ...userWithoutHash,
            roles,
            token
        };
    }
}

async function getAll() {
    /*
    return await User.find().select('-hash');*/
}

async function getById(id) {/*
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw 'invalid id';
    }

    return await User.findById(id).select('-hash');*/
}

async function getScore(username) {/*
    let x = await Post.aggregate([
        {
            $match: {
                'username': username
            },
        },
        {
            $project: {
                count: { $size: "$upvotes" }
            }
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: "$count"
                }
            }
        }
    ]);
    return x && x[0] && (x[0].count * 5) || 0;*/
}

async function getByUsername(username) {/*
    let user = await User.findOne({username: username}).select("-hash")
    if (user) {
        user.score = await getScore(username);
    }
    return user;*/
}

async function create(userParam) {/*
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    
    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();*/
}

async function update(id, userParam) {/*
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();*/
}

async function _delete(id) {/*
    await User.findByIdAndRemove(id);*/
}