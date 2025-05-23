import mongoose from "mongoose";
import DataPush from "./datapush_model.js";

const deviceSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Position: {
            type: [Number],
            required: true,
        },
        Attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: false
        },
        Consumption: {
            type: Number, // ✅ Cambiado de Double a Number
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

// Middleware para eliminar datapushes asociados al eliminar un device
deviceSchema.pre("findOneAndDelete", async function (next) {
    const device = await this.model.findOne(this.getFilter());
    if (device) {
        await DataPush.deleteMany({ DeviceID: device._id });
    }
    next();
});


deviceSchema.pre("deleteMany", async function (next) {
    const filter = this.getFilter(); // obtiene el filtro usado en deleteMany
    const devices = await this.model.find(filter); // busca los dispositivos que serán eliminados
    const deviceIds = devices.map(device => device._id); // extrae sus IDs

    if (deviceIds.length > 0) {
        await DataPush.deleteMany({ DeviceID: { $in: deviceIds } });
    }

    next();
});


deviceSchema.virtual('datapushes', {
    ref: 'DataPush',
    localField: '_id',
    foreignField: 'DeviceID',
});


const Device = mongoose.model("Device", deviceSchema);

export default Device;
