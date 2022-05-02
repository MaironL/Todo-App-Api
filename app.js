require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');

//Swagger imports
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//express imports
const express = require('express');
const app = express();

//db import
const connectDB = require('./db/connect');

//route imports
const authNRouter = require('./routes/authN');
const renewalAuthNRouter = require('./routes/renewalAuthN');
const tasksRouter = require('./routes/tasks');

//middleware imports
const userAuthZMiddleware = require('./middleware/userAuthZMW');
const corsCredentialsMiddleware = require('./middleware/corsCredentialsMW');
const errorHandlerMiddleware = require('./middleware/errorHandlerMW');
const notFoundMiddleware = require('./middleware/notFoundMW');

//*------------------------------------------------------

//extra packages
app.set('trust proxy', 1); // trust first proxy
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(corsCredentialsMiddleware, cors(corsOptions));

//routes
app.get('/', (req, res) => {
  res.send("<h1>Todo app API</h1><a href='/api-docs'>Swagger Documentation</a>");
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/authN', authNRouter);
app.use('/api/v1/renewalAuthN', renewalAuthNRouter);
app.use('/api/v1/tasks', userAuthZMiddleware, tasksRouter);

//error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//server listening
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`server listening on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};
start();
