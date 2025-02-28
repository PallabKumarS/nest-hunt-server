import { Schema, model, Document } from 'mongoose';

export interface IUserModel extends Document {
  name: string;
  // add more fields here
}

const userSchema = new Schema<IUserModel>({
  name: { type: String, required: true },
  // add more fields here
});

const userModel = model<IUserModel>('User', userSchema);

export default userModel;
