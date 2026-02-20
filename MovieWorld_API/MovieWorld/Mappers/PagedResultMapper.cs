using MovieWorld;

public class PagedMapper : IPagedMapper
{
    public PagedResult<TDestination> MapToPagedResult<TSource, TDestination>(
        IEnumerable<TSource> items,
        int totalCount,
        int pageIndex,
        int pageSize,
        Func<TSource, TDestination> mapFunc)
    {
        return new PagedResult<TDestination>
        {
            Items = items.Select(mapFunc).ToList(),
            TotalCount = totalCount,
            PageIndex = pageIndex,
            PageSize = pageSize
        };
    }
}