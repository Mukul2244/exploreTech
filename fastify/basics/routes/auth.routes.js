import authController from '../controllers/auth.controller';

export const authRoutes = (fastify,opts) => {
    fastify.post("/register", authController.register);
    fastify.post("/login", authController.login);
    fastify.post("/forgot-password", authController.forgotPassword);
    fastify.post("/reset-password/:token", authController.resetPassword);
    fastify.post("/logout",{
        preHandler:[fastify.authenticate]
    }, authController.logout);
}