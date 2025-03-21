import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rootRouter from './routes/root.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import likeRouter from './routes/like.route';
import replyRouter from './routes/reply.route';
import profileRouter from './routes/profile.route';
import threadRouter from './routes/thread.route';
import followRouter from './routes/follow.route';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger/swagger-output.json';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://b59-circle.vercel.app',
    ],
  }),
);

app.use(rootRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/threads', threadRouter);
app.use('/likes', likeRouter);
app.use('/replies', replyRouter);
app.use('/profile', profileRouter);
app.use('/follow', followRouter);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'Circle App API',
    customfavIcon: 'NONE',
    isExplorer: true,
    customJs:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customCss: `
              .swagger-ui .topbar { display: none } 
              .information-container.wrapper { background:rgb(172, 199, 18); padding: 2rem } 
              .information-container .info { margin: 0 } 
              .information-container .info .main { margin: 0 !important} 
              .information-container .info .main .title { color:rgb(0, 0, 0)} 
              .renderedMarkdown p { margin: 0 !important; color:rgb(0, 0, 0) !important }
              `,
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
