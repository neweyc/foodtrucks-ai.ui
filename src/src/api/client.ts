import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5150';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor removed (Bearer token not needed)

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await client.post('/api/auth/logout', {});
};

export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
}

export const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
   await client.post('/api/auth/manage/info', request);
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

export const deleteMenuCategory = async (truckId: number, categoryId: number): Promise<void> => {
  await client.delete(`/api/trucks/${truckId}/menu-categories/${categoryId}`);
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

export interface Vendor {
  id: number;
  name: string;
  description: string;
  phoneNumber: string;
  website: string;
  isActive: boolean;
}

export interface CreateVendorRequest {
  name: string;
  description: string;
  phoneNumber: string;
  website: string;
  email: string;
}

export interface UpdateVendorRequest {
  name: string;
  description: string;
  phoneNumber: string;
  website: string;
  isActive: boolean;
}

export const getVendors = async (): Promise<Vendor[]> => {
  const response = await client.get<Vendor[]>('/api/vendors');
  return response.data;
};

export const getVendor = async (id: number): Promise<Vendor> => {
  const response = await client.get<Vendor>(`/api/vendors/${id}`);
  return response.data;
};

export const createVendor = async (request: CreateVendorRequest): Promise<void> => {
  await client.post('/api/vendors', request);
};

export const updateVendor = async (id: number, request: UpdateVendorRequest): Promise<void> => {
  await client.put(`/api/vendors/${id}`, request);
};

export const deleteVendor = async (id: number): Promise<void> => {
  await client.delete(`/api/vendors/${id}`);
};

export default client;
