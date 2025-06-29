
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const deviceSchema = new Schema({
    userId: { type: String, default: '' },
    deviceId : { type: String, default: '' },
    city: { type: String, default: '' },
    lat: { type: String, default: '' },
    long: { type: String, default: '' },
    address: { type: String, default: '' },
    activationData: { type: String, default: '' },
    timeIntervelSet: { type: String, enum:['30 sec', '1 min', '3 min', '10 min', '15 min', '20 min','30 min', '45 min', '60 min', '2 hrs', '4 hrs', '6 hrs', '10 hrs', '12 hrs', '1 day', ], default: '3 min' },
    dataLogs: { type: [], default: [] },
    dat: { type: [], default: [] },
    dataPerameters: { type: [], default: [] },
    dataLogs: { type: [], default: [] },

    currentStatus: { type: String, default: '' },
    currentStatus: { type: String, default: '' },
},{ timestamps: true });

const Device = model('Device', deviceSchema);
export default Device;