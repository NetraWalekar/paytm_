const app = require("express");
const rootRouter = require("./routes/index");

app.use('/api/vi', rootRouter)

app.listen(3000)