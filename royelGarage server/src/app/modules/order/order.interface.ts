import { Types } from "mongoose";


export type Torder = {
    userId: Types.ObjectId;
    email: string;
    product: Types.ObjectId;
    quantity: number;
    totalPrice: number;
  };
  