import express from 'express'
import './config/dotenv.js'
import path from 'path'
import favicon from 'serve-favicon'
import cors from "cors"

import eventRouter from './routes/event.js'
import locationRouter from './routes/location.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/events', eventRouter)
app.use('/api/locations', locationRouter)

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'party.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'party.png')))
    app.use(express.static('public'))
}

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})
