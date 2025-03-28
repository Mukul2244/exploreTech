import fp from 'fastify-plugin'
import mongoose from 'mongoose'

const plugin = fp(async function (fastify, opts) {
try {
    await mongoose.connect(`${process.env.MONGODB_URI}`)
    fastify.log.info('Connected to MongoDB...!!!')
    fastify.decorate('mongoose', mongoose)
} catch (error) {
    fastify.log.error(error)
    process.exit(1)
}
})
export default plugin