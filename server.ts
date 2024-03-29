import { createProxyMiddleware } from "http-proxy-middleware";
import express, { Request, Response } from 'express';
import next from 'next';
const dev = process.env.NODE_ENV !== 'production';
// 初始化 app
const app = next({ dev });
const handle = app.getRequestHandler();

// 代理配置表
app.prepare().then(() => {
    const env = process.env;
    const server = express();

    const proxyTable = {
        '/api': {
            target: env.NEXT_PUBLIC_API_URL,
            pathRewrite: { '^/api': '/api' },
            changeOrigin: true
        },
    };
    // 代理api接口
    server.use('/api', createProxyMiddleware(proxyTable['/api']));

    var jwt = require('jsonwebtoken');
    var PrivateKey = env.NEXT_PUBLIC_CANNY_API_PRIVATEKEY;
    server.use(express.json());
    server.post('/jwt', (req: Request, res: Response,) => {
        const jwtToken = jwt.sign(req.body, PrivateKey, { algorithm: 'HS256' });
        res.send({ jwt: jwtToken });
    });

    // 代理请求
    server.all('*', (req: Request, res: Response,) => {
        return handle(req, res);
    });

    server.listen(env.NEXT_PUBLIC_PORT, () => {
        console.log(`
        Ready on ${env.NEXT_PUBLIC_SITE_ROOT}`);
    }).on('error', (err: Error) => {
        console.error('Server failed to start:', err);
    });

}).catch(err => {
    console.log('Error:::::', err);
});
