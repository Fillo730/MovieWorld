export interface SellPointsWithMoviesRequest{  
    movieIds : number[],
    pageIndex : number,
    pageSize : number,
    userLat?: number, 
    userLng?: number
}