import express, { Request, Response } from 'express';
import  cors from "cors"
import {createProxyMiddleware} from "http-proxy-middleware"
import compression  from "compression"
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
require("dotenv").config()

const app = express();
const port = process.env.PORT; 
console.log("port:" , port);

app.use(express.json());

// Enable rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

app.use(limiter);

// enable cors middleware
app.use(cors())

// Enable compression with specific options
app.use(compression({ level: 6 })); // Specify compression level (0-9)

// Enable helmet middleware
app.use(helmet());





// http://127.0.0.1:3000/chat-service => http://127.0.0.1:3003 (chat service)

app.use("/chat-service" , createProxyMiddleware({
    target: "http://127.0.0.1:3003",
    changeOrigin: true,
    pathRewrite: {
        "^/chat-service": ""
    }
}))

app.get('/', (req: Request, res: Response) => {
    res.json({mssg:" Hello from Express and TypeScript!"});
});

app.listen(port, () => {
    console.log(`API Gateway Server listening at http://127.0.0.1:${port}`);
});
