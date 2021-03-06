import mongoose from 'mongoose';
import ValidationService from './service/ValidationService';

const mongo = {
    ObjectId: mongoose.Schema.Types.ObjectId,
    Collections: {
        User: "user",
        Chat: "chat",
        Message: "message",
        PastUser: "past_user",
    },
    includedUserFields: "username email createdAt _id",
};

const messages = {
    password: {
        invalid_length: `Password must have at least ${ValidationService.PASSWORD_LIMIT} characters`,
        no_match: "Passwords must match",
    },
    username: {
        invalid_length: `Username must have at least ${ValidationService.USERNAME_LIMIT} characters`,
        already_exists: "That username has been taken",
    },
    email: {
        invalid: "Please enter a valid email",
        already_exists: "That email has been taken",
    },
    login: {
        error: "Incorrect username, email, and/or password",
        success: "Login successful!",
    },
};

export default module.exports = {
    mongo,
    messages,
};