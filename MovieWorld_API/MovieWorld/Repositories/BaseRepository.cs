using Microsoft.EntityFrameworkCore;
using MovieWorld.Models;

namespace MovieWorld.Repositories;

public class BaseRepository
{
    protected readonly TrainingBrattiContext _dbContext;

    protected BaseRepository(TrainingBrattiContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
