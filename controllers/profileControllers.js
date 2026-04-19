
const createProfile = (req, res) =>{
    
}

const userProfile = (req, res) => {
    res.send('This is your profile')
}

const allUsersProfile = (req, res) => {
    res.send('Profile of all users')
}

const deleteProfile = (req, res) => {
    res.send('Profile deleted')
}

export {
    createProfile, 
    userProfile, 
    allUsersProfile, 
    deleteProfile
}