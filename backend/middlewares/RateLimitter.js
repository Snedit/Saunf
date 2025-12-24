import redisClient from "../util/RedisClient.js";

const window_size = 60;
const max_req = 30;

async function rateLimit(req, res, next)
{
    try{
        const key  = `rl:${req.ip}`;

        const count = await redisClient.incr(key);
        if(count  === 1)
        {
                await redisClient.expire(key, window_size);
        }
        if(count > max_req)
        {
            return res.status(429).json({message: "Rate Limit reached!"});

        }
        next();

    }
    catch(err)
    {
        console.log("rate limitter fault");
        next();
        
    }
}

export default rateLimit;