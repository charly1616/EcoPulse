import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
			type: String,
			required: true,
			minLength: 6,
		},
        Type: {
            type: String,
            required: false,
            default: "User",
            enum: ["Admin", "Tech", "User"]
        },
        Confirmed: {
            type: Boolean,
            requred: false,
            default: false
        },
        Blocked: {
            type: Boolean,
            required: false,
            default: false,
        },
        CompanyID: {
            type: mongoose.ObjectId,
            ref: "Company",
            required: true,
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;