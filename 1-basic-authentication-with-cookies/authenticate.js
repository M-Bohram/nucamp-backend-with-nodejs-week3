
exports.auth = (req, res, next) => {
    // check for cookie
    if(req.signedCookies.user && req.signedCookies.user === 'john') {
        return next()
    }

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

    res.cookie('user', 'john', { signed: true })

    return next()
}