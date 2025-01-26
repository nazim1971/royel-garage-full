import { Tbike } from './bike.interface';
import { Bike } from './bike.model';

const createBike = async (bikeData: Tbike) => {
  const result = await Bike.create(bikeData);
  return result;
};

const getAllBikeFromDB = async (searchTerm?: string) => {
  let query = {};
    if (searchTerm) {
      // Search in name, brand, or category fields
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }
    const result = await Bike.find(query);
    return result;
};

const getSingleBikeFromDB = async (id: string) => {
  const result = await Bike.findById({ _id: id });
  return result;
};

const updateSingleBikeInfo = async (
  id: string,
  updatedData: Partial<Tbike>,
) => {
  const result = await Bike.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSingleBikeFromDB= async ( id: string)=>{
  const result = await Bike.findOneAndDelete({_id: id})
  return result;
}
export const bikeService = {
  createBike,
  getAllBikeFromDB,
  getSingleBikeFromDB,
  updateSingleBikeInfo,
  deleteSingleBikeFromDB
};
