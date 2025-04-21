import mongoose from "mongoose";
import { type } from "os";
import { float } from "webidl-conversions";

const deviceSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Position: {
            type: Number,
            required: true,
        },
        Attributes: {
            type: String,
            required: false
        },
        Consumption: {
            type: float,
            required: false
        },
        AreaID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            required: true,
        }
    },
    { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;