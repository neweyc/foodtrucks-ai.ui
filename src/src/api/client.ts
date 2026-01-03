import axios from 'axios';

const API_BASE_URL = 'http://localhost:5150'; // Confirmed current API port

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};

export interface UserDto {
  email: string;
  vendorId?: number;
}

export const getMe = async (): Promise<UserDto> => {
  const response = await client.get<UserDto>('/api/auth/me');
  return response.data;
};

export const getTrucks = async (vendorId?: number): Promise<Truck[]> => {
  const params = vendorId ? { vendorId } : {};
  const response = await client.get<Truck[]>('/api/trucks', { params });
  return response.data;
};

export interface CreateTruckRequest {
  name: string;
  description: string;
  schedule: string;
}

export const createTruck = async (request: CreateTruckRequest): Promise<void> => {
  await client.post('/api/trucks', request);
};

export interface UpdateTruckRequest {
  name: string;
  description: string;
  schedule: string;
}

export const updateTruck = async (id: number, request: UpdateTruckRequest): Promise<void> => {
  await client.put(`/api/trucks/${id}`, request);
};

export interface MenuItemSize {
  id: number;
  name: string;
  price: number;
}

export interface MenuItemOption {
  id: number;
  name: string;
  section: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  photoUrl: string;
  isAvailable: boolean;
  sizes?: MenuItemSize[];
  options?: MenuItemOption[];
}

export interface MenuCategory {
  id: number;
  name: string;
  menuItems: MenuItem[];
}

export interface Truck {
  id: number;
  name: string;
  description: string;
  schedule?: string;
  vendorId: number;
  menuCategories?: MenuCategory[];
}

export const getTruck = async (id: number): Promise<Truck> => {
  const response = await client.get<Truck>(`/api/trucks/${id}`);
  return response.data;
};

export const addMenuCategory = async (truckId: number, name: string): Promise<void> => {
  await client.post(`/api/trucks/${truckId}/menu-categories`, { name });
};

export interface AddMenuItemSize {
  name: string;
  price: number;
}

export interface AddMenuItemOption {
  name: string;
  section: string;
  price: number;
}

export interface AddMenuItemRequest {
  name: string;
  description: string;
  price: number;
  photoUrl?: string;
  isAvailable: boolean;
  sizes?: AddMenuItemSize[];
  options?: AddMenuItemOption[];
}

export const addMenuItem = async (categoryId: number, item: AddMenuItemRequest): Promise<void> => {
  await client.post(`/api/menu-categories/${categoryId}/items`, item);
};

export const editMenuItem = async (itemId: number, item: AddMenuItemRequest): Promise<void> => {
  await client.put(`/api/menu-items/${itemId}`, item);
};

export interface PlaceOrderItemDto {
  menuItemId: number;
  quantity: number;
  sizeId?: number;
  optionIds?: number[];
}

export interface PlaceOrderRequest {
  truckId: number;
  customerName: string;
  customerPhone: string;
  paymentToken: string;
  items: PlaceOrderItemDto[];
}

export interface OrderResultDto {
  id: number;
  trackingCode: string;
}

export const placeOrder = async (order: PlaceOrderRequest): Promise<OrderResultDto> => {
  const response = await client.post<OrderResultDto>('/api/orders', order);
  return response.data;
};

export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export const getOrder = async (trackingCode: string): Promise<Order> => {
    const response = await client.get<Order>(`/api/orders/${trackingCode}`);
    return response.data;
};

export const getOrders = async (truckId: number): Promise<Order[]> => {
  const response = await client.get<Order[]>(`/api/trucks/${truckId}/orders`);
  return response.data;
};

export default client;
