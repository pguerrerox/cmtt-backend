import db from './db/db.js'
import createApp from './app.factory.js'

const app = createApp(db)

/**
 * HTTP port used by the backend server.
 *
 * Reads `PORT` from environment variables and falls back to `5000`.
 * @type {string | number}
 */
const PORT = process.env.PORT || 5000

/**
 * Starts the backend HTTP server.
 *
 * Side effects: opens a listening socket and writes startup information to stdout.
 */
app.listen(PORT, () => {
  console.log(`\x1b[35m   ➜ \x1b[0m Server running Local:   \x1b[35mhttp://localhost:${PORT}/\x1b[0m`);
})
