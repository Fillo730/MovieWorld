export interface Coupon {
    couponId: number;
    code: string;
    discountPercentage: number;
    expiresAt: string | null;
    maxUses: number | null;
    usesCount: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreateCouponRequest {
    code: string;
    discountPercentage: number;
    expiresAt: string | null;
    maxUses: number | null;
}
