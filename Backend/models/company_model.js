import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        CompanyName: {
            type: String,
            required: true,
        },
        CompanyEmail: {
            type: String,
            required: true,
            unique: true,
        },
        CompanyPassword: {
			type: String,
			required: true,
			minLength: 6,
		},
        NIT: {
            type: String,
			required: true,
        },
        PostalCode: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;