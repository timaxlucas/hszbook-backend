module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    //console.log(err);

    if (typeof (err) === 'string') {
        // custom application error
        if (res.statusCode == 200) {
            return res.status(400).json({ message: err });
        }
        return res.status(res.statusCode).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.code === 'permission_denied' || err.code === 'permissions_not_found') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({ message: 'Cannot connect to DB' });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    console.log("DEBUG: Error in " + req.url + ": " + err.name + " | " + err.code + " | " + err + " | " + err.stack);
    // default to 500 server error
    return res.status(500).json({ message: err.message });
}