require("dotenv").config();
const fastify = require("fastify")({
  logger: true,
});

// register plugins
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/sensible"));
fastify.register(require("@fastify/multipart"));
fastify.register(require("fastify-static"),{
  root:path.join(__dirname,'uploads'),
  prefix:'/uploads' // optional: default '/'
});
fastify.register(require("@fastify/env"), {
  dotenv: true,
  schema: {
    type: "object",
    required: ["PORT", "MONGODB_URI", "JWT_SECRET"],
    properties: {
      PORT: {
        type: "string",
        default: 3000,
      },
      MONGODB_URI: {
        type: "string",
      },
      JWT_SECRET: {
        type: "string",
      },
    },
  },
});

// register custom plugins
fastify.register(require("./plugins/mongodb"));
fastify.register(require("./plugins/jwt"));

// register routes
fastify.route(require("./routes/auth.routes"),{prefix: '/api/auth'});
fastify.route(require("./routes/thumbnail.routes"),{prefix: '/api/thumbnail'});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// test db connection
fastify.get("/test", async (request, reply) => {
  try {
    const mongoose = fastify.mongoose;
    const connection = mongoose.connection.readyState;
    let status = "";
    switch (connection) {
      case 0:
        status = "disconnected";
        break;
      case 1:
        status = "connected";
        break;
      case 2:
        status = "connecting";
        break;
      case 3:
        status = "disconnecting";
        break;
      default:
        status = "unknown";
        break;
    }
    reply.send({ status: status });
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'falied to connect database' });
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    fastify.log.info(
      `Server is running at http://localhost:${process.env.PORT}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
