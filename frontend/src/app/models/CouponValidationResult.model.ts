export interface CouponValidationResult {
    isValid: boolean;
    errorMessage: string | null;
    code: string;
    discountPercentage: number;
    discountAmount: number;
}
