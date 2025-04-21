import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Shape: {
            type: [Number],
            default: []
        },
        FacilityID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true,
        }
    },
    { timestamps: true }
);

const Area = mongoose.model("Area", areaSchema);

export default Area;