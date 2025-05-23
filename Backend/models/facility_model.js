import mongoose from "mongoose";
import Area from "./area_model.js";

const facilitySchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        CompanyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        }
    },
    { timestamps: true }
);

// Middleware para eliminar todas las áreas (y sus dispositivos) cuando se elimina una facility
facilitySchema.pre("findOneAndDelete", async function (next) {
    const facility = await this.model.findOne(this.getFilter());
    if (facility) {
        // Usamos find para obtener todas las áreas asociadas
        const areas = await Area.find({ FacilityID: facility._id });

        // Eliminamos cada área, lo que activará el middleware en Area para borrar sus devices
        for (const area of areas) {
            await Area.findOneAndDelete({ _id: area._id });
        }
    }
    next();
});

facilitySchema.pre("deleteMany", async function (next) {
    const filter = this.getFilter();

    // Obtenemos los Facility que serán eliminados
    const facilities = await this.model.find(filter);
    const facilityIds = facilities.map(f => f._id);

    if (facilityIds.length > 0) {
        // Eliminamos en bloque las áreas asociadas (esto activa el middleware de Area)
        await Area.deleteMany({ FacilityID: { $in: facilityIds } });
    }

    next();
});


facilitySchema.virtual('areas', {
    ref: 'Area',
    localField: '_id',
    foreignField: 'FacilityID',
});

facilitySchema.set('toObject', { virtuals: true });
facilitySchema.set('toJSON', { virtuals: true });

// idem para areaSchema y deviceSchema



const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;
