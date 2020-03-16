const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneID,userOne,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Yunis',
        email: 'yunis@example.com',
        password: 'mypass1234'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Yunis',
            email: 'yunis@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('mypass1234')
})

test('Should login exist user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[user.tokens.length - 1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '1234555555'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauth user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})
test('Should not delete account for unauth user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mikayil'
        })
        .expect(200)
    const user = await User.findById(userOneID)
    expect(user.name).toBe('Mikayil')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location:'Baku'
        })
        .expect(400)
})