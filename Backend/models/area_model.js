import mongoose from "mongoose";
import Device from "./device_model.js";

const validateCoordinates = (val) => {
    return Array.isArray(val) && val.length === 2 && val.every(n => typeof n === "number");
};

const areaSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        From: {
            type: [Number],
            default: [],
            validate: {
                validator: validateCoordinates,
                message: "`From` debe ser un array de dos números"
            }
        },
        Attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: false
        },
        To: {
            type: [Number],
            default: [],
            validate: {
                validator: validateCoordinates,
                message: "`To` debe ser un array de dos números"
            }
        },
        FacilityID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true,
        }
    },
    { timestamps: true }
);



//Middleware para eliminar todos los devices cuando se elimina el area
areaSchema.pre("findOneAndDelete", async function (next) {
    const area = await this.model.findOne(this.getFilter());
    if (area) {
        await Device.deleteMany({ AreaID: area._id });
    }
    next();
});

areaSchema.pre("deleteMany", async function (next) {
    const filter = this.getFilter();
    const areas = await this.model.find(filter);
    const ids = areas.map(a => a._id);

    await Device.deleteMany({ AreaID: { $in: ids } });

    next();
});

areaSchema.virtual('devices', {
    ref: 'Device',
    localField: '_id',
    foreignField: 'AreaID',
});

const Area = mongoose.model("Area", areaSchema);

export default Area;