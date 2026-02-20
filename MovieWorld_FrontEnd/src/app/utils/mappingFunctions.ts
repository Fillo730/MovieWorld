import { OrderState } from "../models/Order.model";

export function getOrderLabelColor(state: OrderState): string {
  switch (state.id) {
    case 1: return '#FFA500'; 
    case 2: return '#3498db'; 
    case 3: return '#9b59b6'; 
    case 4: return '#2ecc71'; 
    case 5: return '#e74c3c'; 
    default: return '#95a5a6'; 
  }
}