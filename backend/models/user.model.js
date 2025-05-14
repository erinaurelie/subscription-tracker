import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User Name is required'], // error msg if name is not passed in
        trim: true,
        minLength: 2,
        maxLength: 50
    }, 
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true, // because only one user can have a particular email
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true
 }, {
    strict: true // With strict: true, MongoDB will ignore any fields not defined in the schema.
 });

// let's create a new model off of that schema :: instance of this model
const User = mongoose.model('User', userSchema);

export default User;

/*
    When you add timestamps: true in a Mongoose schema it automatically adds two fields to your schema:
    createdAt: This field stores the date and time when the document was first created in the database.
    updatedAt: This field stores the date and time when the document was last updated.
    How It Works:
    When a new document is created, both createdAt and updatedAt are set to the current timestamp.
    When an existing document is updated, only the updatedAt field is updated to the current timestamp.
    You don't need to manually set them — Mongoose handles updating these timestamps whenever you create or update a document.
*/