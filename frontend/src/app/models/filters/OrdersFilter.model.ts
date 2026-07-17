export interface OrdersFilter{
    year: number | null,
    OrderStateId: number,
    totalValue: number[];
    moviesNumber: number | null,
}

export const DEFAULT_ORDERS_FILTER : OrdersFilter = {
    year: null,
    OrderStateId: 0,
    moviesNumber: null,
    totalValue: [0,1000]
}