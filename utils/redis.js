import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
	/**
	 * Creates a new RedisClient instance.
	 */
	constructor() {
		this.client = createClient();
		this.isConnected = true;
		this.client.on('error', (err) => {
			console.error('Redis client failed to connect: ', err.message);
			this.isConnected = false;
		});
		this.client.on('connect', () => {
			this.isConnected = true;
		});
	}

	/**
	 * Checks if the connection to Redis is a success or not
	 * @returns {boolean}
	 */
	isAlive() {
		return this.isConnected;
	}

	/**
	 * Retrieves the value of a given key.
	 * @param {String} key The key of the item to retrieve.
	 * @returns {String | Object}
	 */
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

	/**
	 * Stores a key and its value along with an expiration time.
	 * @param {String} key The key of the item to store.
	 * @param {String | Number | Boolean} value The item to store.
	 * @param {Number} duration The expiration time of the item in seconds.
	 * @returns {Promise<void>}
	 */
	async set(key, value, duration) {
		return new Promise((resolve) => {
			this.client.set(key, value, 'EX', duration, function(err, reply) {
				if (err) {
					resolve(null);
				} else {
					resolve(reply);
				}
			});
		});
	}

	/**
	 * Removes the value of a given key.
	 * @param {String} key The key of the item to remove.
	 * @returns {Promise<void>}
	 */
	async del(key) {
		return new Promise((resolve, reject) => {
			this.client.del(key, (err, reply) => {
				if (err) {
					return reject(err);
				}
				return resolve(reply);
			});
		});
	}
}

const redisClient = new RedisClient();
export default redisClient;
