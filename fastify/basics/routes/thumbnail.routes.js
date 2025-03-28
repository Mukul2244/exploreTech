import thumbnailController  from '../controllers/thumbnail.controller';

export async function routes(fastify, options) {
    fastify.register(async function (fastify, options) {
        fastify.addHook('preHandler', fastify.authenticate);

        fastify.post('/', thumbnailController.createThumbnail);
        fastify.get('/', thumbnailController.getThumbnails);
        fastify.get('/:id', thumbnailController.getThumbnail);
        fastify.put('/:id', thumbnailController.updateThumbnail);
        fastify.delete('/:id', thumbnailController.deleteThumbnail);
        fastify.delete('/', thumbnailController.deleteAllThumbnails);
    })
}