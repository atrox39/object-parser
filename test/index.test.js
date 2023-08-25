const { getObjectBySchema } = require('../index')

describe('Match object', () => {
  const schema = {
    user: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'string' },
      },
    },
  }

  const data = {
    user: {
      name: 'Jhon',
      lastName: 'Wick',
      password: '123456',
    },
    service: 'google.com',
  }

  it('Schema for user', () => {
    const temp = JSON.parse(JSON.stringify(data))
    delete temp.user.password
    delete temp.service
    expect(getObjectBySchema(data, schema)).toMatchObject(temp)
  })
})
