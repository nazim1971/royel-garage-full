export const ECategory = ["Mountain", "Road", "Hybrid", "Electric"] as const;

export const productsOption = ECategory.map((i)=>({
    label: i,
    value: i, 
   }))

export type TCategory = (typeof ECategory)[number];

export type TProduct = {
  name: string;
  brand: string;
  price: number;
  category: TCategory;
  description: string;
  quantity: number;
  isStock: boolean;
};
