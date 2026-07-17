using MovieWorld;

public interface IPagedMapper
{
    PagedResult<TDestination> MapToPagedResult<TSource, TDestination>(
        IEnumerable<TSource> items,
        int totalCount,
        int pageIndex,
        int pageSize,
        Func<TSource, TDestination> mapFunc);
}