export interface LoginRegisterResponse {
  token: string;
  id: number;
  email: string;
  name: string;
  expiration: string;
  role: number;
  imagePath?: string;
  preferredSellPointId?: number | null;
}