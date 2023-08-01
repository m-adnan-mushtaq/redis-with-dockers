// cache strategy will go here
const { createClient } = require('redis')
const { Query } = require('mongoose')
const client = createClient({
    url: process.env.REDIS_URL,
})

client.on('error', e => console.log(`REDIS ERROR =>`,e.message))
// cache tree for this project - HASHMAP
/*
    users key value expiry time - 30 min
    posts key value expiry time - 30 min
    del users
    del posts
 */
///////////////////////  CACHE LAYER ON MONGOOSE////////////////////////
//default cache time is 30 min
Query.prototype.cache = function (options={}) {
    let {_cacheTime,populateOptions}= options
    _cacheTime ??= 1800
    populateOptions ??= this.getPopulatedPaths()
    // console.log(_cacheTime);
    if (client.isOpen) {
        this._cache = true
        this._cacheTime = parseInt(_cacheTime)
        this._populateOptions=populateOptions
    }
    return this
}



// cache strategy
//reference to real query
const exec = Query.prototype.exec
Query.prototype.exec = async function () {
    try {
        // check if user want cache query
        console.log('query executed!',this.model.modelName);
        if (!this._cache) return exec.apply(this, arguments)
        // prepare key
        let rootKey = this.model.collection.name
        let subKey = JSON.stringify({ ...this.getQuery(), ...this.getOptions() })
        console.log('key =>', rootKey, subKey);

        // check if cache already exits
        let result = await client.hGet(rootKey, subKey)
        // console.log(this.getPopulatedPaths());
        if (result) {
            console.log('CACHE HIT');
            result = await JSON.parse(result)
            // ***********perfrom hydration *************************
            let queryOptions = this.getOptions()
            let queryProjection = this.projection() // for relations
            if (Array.isArray(result)) {
                // if result is array
                result = result.map(doc => new this.model(doc, queryOptions, queryProjection))
            }
            else {
                result = new this.model(result, queryOptions, queryProjection)
            }
            // check if any populated paths exists then populated paths
            if (this.getPopulatedPaths().length) {
                result = await this.model.populate(result, this._populateOptions)
            }
        } else {
            // set cache if not exists
            console.log('CACHE MISS');
            result = await exec.apply(this, arguments)
            await client.hSet(rootKey, subKey, JSON.stringify(result))
            await client.expire(rootKey, this._cacheTime)
        }
        return result
    } catch (error) {
        throw error
    }
}


module.exports = client