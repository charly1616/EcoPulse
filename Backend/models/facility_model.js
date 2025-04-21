import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Shape: {
            type: [Number],
            default: []
        },
        CompanyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        }
    },
    { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;