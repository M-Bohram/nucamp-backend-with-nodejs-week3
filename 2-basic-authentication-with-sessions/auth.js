
const parseAuthHeader = authHeader => {
    const usernamePasswordPartEncoded = authHeader.split(" ")[1]
    const usernamePasswordPart = Buffer.from(usernamePasswordPartEncoded, "base64").toString()
    const [username, password] = usernamePasswordPart.split(":")
    return {
        username,
        password
    }
}

const createUnauthencatedResponse = (res, next) => {
    const err = new Error('You are not authenticated!')
    err.status = 401
    res.setHeader('WWW-Authenticate', 'Basic')
    return next(err)
}

exports.authorizeUsers = (req, res, next) => {
    const authheader = req.headers.authorization

    console.log(req.session)
    if(req.session.user && req.session.user === 'john') {
        return next()
    }

    if(!authheader) {
        createUnauthencatedResponse(res, next)
    }

    const { username, password } = parseAuthHeader(authheader)
        
    if(username !== "john" || password !== "password") {
        createUnauthencatedResponse(res, next)
    }

    req.session.user = 'john'
    return next()
}