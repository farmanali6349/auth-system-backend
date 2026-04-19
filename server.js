import { PORT } from './src/config/config.js';
import { app } from './src/app.js';

app.listen(PORT, () => {
  console.log(`Please visit: http://localhost:${PORT}`);
});
