import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
	constructor() {
		this.client = createClient();
		this.isConnected = true;
		this.client.on('error', err => {
			console.error('Redis client failed to connect: ', err.message);
			this.isConnected = false;
		});
		this.client.on('connect', () => {
			this.isConnected = true;
		});
	}
	
	isAlive() {
		return this.isConnected;
	}

	async get(key) {
		return new Promise((resolve, reject) => {
			this.client.get(key, (err, val) => {
				if (err) {
					reject(err);
					return;
				}
				if (val == null) {
					resolve(null);
					return;
				}
				
				try {
					resolve(JSON.parse(val));
				} catch (ex) {
					resolve(val);
				}
			});
		});
	}

	async set(key, value, duration) {
		return new Promise((resolve) => {
			this.client.set(key, value, 'EX', duration, function(err, reply) {
				if (err) {
					resolve(null);
				} else {
					resolve(reply);
				}
			})
		})
	}

	async del(key) {
		return new Promise((resolve, reject) => {
			client.del(key, (err, reply) => {
				if (err) {
					return reject(err);
				}
				return resolve(reply);
			});
		})
	}
}

const redisClient = new RedisClient();
export default redisClient;
