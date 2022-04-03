export type BusinessType = {
  name: string;
  id: string;
  url: string;
  phone: string;
  rating: string;
  imageSrc: string;
  category: string;
  address: string;
  city: string;
};

export type YelpBusinessType = {
  url: string;
  name: string;
  id: string;
  imageSrc: string;
  address: string;
  city: string;
  zipZCode: string;
  category: string;
  rating: string;
  reviewCount: string;
  phone: string;
  price: string;
  image_url?: string;
  lat?: string;
  lng?: string;
  review_count: string;
  display_phone: string;
  location: {
    address1: string;
    city: string;
    zip_code: string;
  };
  // coordinates: {
  //   latitude?: string;
  //   longitude?: string;
  // };
  categories: {
    title: string;
  }[];
};
