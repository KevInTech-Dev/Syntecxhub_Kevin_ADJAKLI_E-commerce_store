import request from 'supertest'
import app from '../app.js'

describe('GET /', () => {
  it('responds with running message', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('E-commerce API is running')
  })
})
