import express from  'express';

const app = express();
const port = 3003;

app.get('/', (req, res) => {
  res.send('Hello from chat service !');
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});
