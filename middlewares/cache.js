const client = require("../services/cache")

async function deleteCache() {
    if (!client.isOpen) return this
    // delete cache
    let referenceKey = this.collection.name
    let exists = await client.exists(referenceKey)
    if (exists) await client.del(referenceKey)
    console.log('CLEAR CACHE!');
}

module.exports={
    deleteCache
}