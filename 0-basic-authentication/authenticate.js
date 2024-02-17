
exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader) {
        const err = new Error("You are not authenticated!")
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401
        return next(err)
    }

    const credentialsEncoded = authHeader.split(' ')[1]
    const [username, password] = Buffer.from(credentialsEncoded, 'base64')
                                       .toString().split(':')

    if(username !== 'john' || password !== 'password') {
        const err = new Error("You are not authenticated!")
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401
        return next(err)
    }

    return next()
}