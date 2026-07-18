export interface CouponUsageStat {
    code: string;
    usesCount: number;
    totalDiscount: number;
}

export interface CouponStats {
    totalDiscountGiven: number;
    totalRedemptions: number;
    topCoupons: CouponUsageStat[];
}
