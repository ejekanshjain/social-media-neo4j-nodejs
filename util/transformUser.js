module.exports = user => ({
    username: user.username,
    name: user.email,
    gender: user.gender,
    dateOfBirth: new Date(user.dateOfBirth),
    email: user.email,
    profileImage: user.profileImage,
    createdAt: new Date(user.createdAt)
})