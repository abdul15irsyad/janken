import express, { Request, Response } from 'express';
import { PORT } from './app.config';
import { initSocket } from './app.socket';
import { join } from 'path';

const app = express();

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'hello world',
  });
});

const server = app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`),
);

initSocket(server);
