const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'Cirle API',
    description: 'Welcome to circle API',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    '@schemas': {
      LoginDTO: {
        type: 'object',
        properties: {
          identifier: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      RegisterDTO: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      ForgotPasswordDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
        },
      },
      ResetPasswordDTO: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
        },
      },
      UpdateUserProfile: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          bio: {
            type: 'string',
          },
        },
      },
      CreateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'file',
          },
        },
      },
      CreateLikeDTO: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
          },
        },
      },
      Follow: {
        type: 'object',
        properties: {
          followedId: {
            type: 'string',
          },
        },
      },
      UnFollow: {
        type: 'object',
        properties: {
          followedId: {
            type: 'string',
          },
        },
      },
    },
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['src/index.ts'];

swaggerAutogen(outputFile, routes, doc);
