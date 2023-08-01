
module.exports= async function (mongoose) {
    try {
        await mongoose.connect(process.env.MONGO_DOCKER_URL)
    } catch (error) {
        console.log(`MONGO ERROR => `,error.message);
        // process.exit(1)
    }
}