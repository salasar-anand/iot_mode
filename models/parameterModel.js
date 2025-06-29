
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const parameterSchema = new Schema({

  title: { type: String, default: 'title' },
  
  a: { type: String },
  b: { type: String },
  c: { type: String },
  d: { type: String },
  e: { type: String },
  f: { type: String },
  g: { type: String },
  h: { type: String },
  i: { type: String },
  j: { type: String },
  k: { type: String },
  l: { type: String },
  m: { type: String },
  n: { type: String },
  o: { type: String },
}, { timestamps: true });

const Parameter = model('Parameter', parameterSchema);
export default Parameter;