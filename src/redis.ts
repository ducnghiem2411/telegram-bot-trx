import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import { REDIS_URL } from './config'


export let redis: RedisClient
export let getAsync: (key: string) => Promise<string | null>
export let setAsync: (key: string, val: string) => Promise<any>
export let setExAsync: (key: string, seconds: number, value: string) => Promise<any>
export let expireAsync: (key: string, seconds: number) => Promise<any>
export let existsAsync: (keys: string[]) => Promise<number>
export let ttlAsync: (key: string) => Promise<number>
export let delAsync: (key: string) => Promise<number>

export const initRedis = async () => {
    new Promise<void>((resolve, reject) => {
        redis = createClient({
            url: REDIS_URL,
            no_ready_check: false,
            enable_offline_queue: true,
            max_attempts: 1000,
            retry_max_delay: 1000,
            // retry_strategy: function (options) {
            //     if (options.error && options.error.code === 'ECONNREFUSED') {
            //         // End reconnecting on a specific error and flush all commands with
            //         // a individual error
            //         return new Error('The server refused the connection');
            //     }
            //     if (options.total_retry_time > 1000 * 60 * 60) {
            //         // End reconnecting after a specific timeout and flush all commands
            //         // with a individual error
            //         return new Error('Retry time exhausted');
            //     }
            //     if (options.attempt > 10) {
            //         // End reconnecting with built in error
            //         return new Error('attempt > 10');
            //     }
            //     // reconnect after
            //     return Math.min(options.attempt * 100, 3000);
            // }
        })
        redis.on('connect', function () {
            console.log('🚟 - Redis connected');
            getAsync = promisify(redis.GET).bind(redis);
            setAsync = promisify(redis.SET).bind(redis)
            setExAsync = promisify(redis.SETEX).bind(redis)
            expireAsync = promisify(redis.EXPIRE).bind(redis)
            existsAsync = promisify(redis.EXISTS).bind(redis)
            ttlAsync = promisify(redis.TTL).bind(redis)
            delAsync = promisify(redis.DEL).bind(redis)
        })

        redis.on('error', function (err) {
            console.log('❌ - Redis connect failed', err);
        })
    })
}
