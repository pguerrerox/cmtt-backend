import db from './db/db.js'
import createApp from './app.factory.js'

const app = createApp(db)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`)
  console.log(`\x1b[35m   ➜ \x1b[0m Server running Local:   \x1b[35mhttp://localhost:${PORT}/\x1b[0m`);
})
