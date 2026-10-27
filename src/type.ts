export type typeProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type typeCart = {
  id: number;
  userId: number;
  date: string;
  products: [
    {
      productId: number;
      quantity: number;
    },
    {
      productId: number;
      quantity: number;
    },
    {
      productId: number;
      quantity: number;
    }
  ];
  __v: number;
};

export type typeUser = {
  address: {
    geolocation: {
      lat: string;
      long: string;
    };
    city: string;
    street: string;
    number: number;
    zipcode: number;
  };
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  __v: number;
};


