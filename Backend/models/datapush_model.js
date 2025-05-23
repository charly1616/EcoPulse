import mongoose from "mongoose";

const datapushSchema = new mongoose.Schema(
    {
        DeviceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },
        DateStart: {
            type: Date,
            required: false,
        },
        Time: {
            type: Number,
            default: 60
        },
        Consumption: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const DataPush = mongoose.model("DataPush", datapushSchema);

export default DataPush;