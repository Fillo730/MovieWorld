
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MovieWorld.Models;

public partial class TrainingBrattiContext : DbContext
{
    public TrainingBrattiContext(DbContextOptions<TrainingBrattiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chart> Charts { get; set; }

    public virtual DbSet<ChartItem> ChartItems { get; set; }

    public virtual DbSet<Format> Formats { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<MovieGenre> MovieGenres { get; set; }

    public virtual DbSet<GenreTranslation> GenreTranslations { get; set; }

    public virtual DbSet<LanguageCode> LanguageCodes { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<MoviePerson> MoviePeople { get; set; }

    public virtual DbSet<MovieSellPoint> MovieSellPoints { get; set; }

    public virtual DbSet<MovieTranslation> MovieTranslations { get; set; }

    public virtual DbSet<News> News { get; set; }

    public virtual DbSet<NewsTranslation> NewsTranslations { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderState> OrderStates { get; set; }

    public virtual DbSet<OrderStateTranslation> OrderStateTranslations { get; set; }

    public virtual DbSet<Person> People { get; set; }

    public virtual DbSet<SellPoint> SellPoints { get; set; }

    public virtual DbSet<SellPointTranslation> SellPointTranslations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chart>(entity =>
        {
            entity.HasKey(e => e.ChartId).HasName("PK__Chart__314712152BEAFB54");

            entity.ToTable("Chart");

            entity.Property(e => e.ChartId).HasColumnName("Chart_ID");
            entity.Property(e => e.CreationData)
                .HasDefaultValueSql("(datetime('now'))");
            entity.Property(e => e.UserId).HasColumnName("User_ID");

            entity.HasOne(d => d.User).WithMany(p => p.Charts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Chart__User_ID__37A5467C");
        });

        modelBuilder.Entity<ChartItem>(entity =>
        {
            entity.HasKey(e => new { e.ChartId, e.MovieId }).HasName("PK__ChartIte__76EF9255BF58DFA4");

            entity.ToTable("ChartItem");

            entity.Property(e => e.ChartId).HasColumnName("Chart_ID");
            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");

            entity.HasOne(d => d.Chart).WithMany(p => p.ChartItems)
                .HasForeignKey(d => d.ChartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ChartItem__Chart__4CA06362");

            entity.HasOne(d => d.Movie).WithMany(p => p.ChartItems)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ChartItem__Movie__4D94879B");
        });

        modelBuilder.Entity<Format>(entity =>
        {
            entity.HasKey(e => e.FormatId).HasName("PK__Format__C66EB6DCC5873E6B");

            entity.ToTable("Format");

            entity.Property(e => e.FormatId).HasColumnName("Format_ID");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.GenreId).HasName("PK__Genre__964A20062CDBCC18");

            entity.ToTable("Genre");

            entity.Property(e => e.GenreId).HasColumnName("Genre_ID");
        });

        modelBuilder.Entity<GenreTranslation>(entity =>
        {
            entity.HasKey(e => new { e.GenreId, e.LanguageCode }).HasName("PK__GenreTra__DEF2E8A5963F4BE9");

            entity.ToTable("GenreTranslation");

            entity.Property(e => e.GenreId).HasColumnName("Genre_ID");
            entity.Property(e => e.LanguageCode).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(255);

            entity.HasOne(d => d.Genre).WithMany(p => p.GenreTranslations)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GenreTran__Genre__48CFD27E");

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.GenreTranslations)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GenreTran__Langu__49C3F6B7");
        });

        modelBuilder.Entity<LanguageCode>(entity =>
        {
            entity.HasKey(e => e.LanguageCode1).HasName("PK__Language__8B8C8A3513DDEABF");

            entity.ToTable("LanguageCode");

            entity.Property(e => e.LanguageCode1)
                .HasMaxLength(10)
                .HasColumnName("LanguageCode");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movie__7A8804053452EFE6");

            entity.ToTable("Movie");

            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.Cost).HasPrecision(10, 2);
            entity.Property(e => e.FormatId).HasColumnName("Format_ID");
            entity.Property(e => e.ImagePath).HasMaxLength(255);
            entity.Property(e => e.TrailerUrl).HasColumnName("TrailerURL");

            entity.HasOne(d => d.Format).WithMany(p => p.Movies)
                .HasForeignKey(d => d.FormatId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Movie__Format_ID__33D4B598");
        });

        modelBuilder.Entity<MovieGenre>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.GenreId }).HasName("PK_MovieGenre");

            entity.ToTable("MovieGenre");

            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.GenreId).HasColumnName("Genre_ID");

            entity.HasOne(d => d.Movie).WithMany(p => p.MovieGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieGenre_Movie");

            entity.HasOne(d => d.Genre).WithMany(p => p.MovieGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieGenre_Genre");
        });

        modelBuilder.Entity<MoviePerson>(entity =>
        {
            entity.HasKey(e => new { e.PersonId, e.MovieId }).HasName("PK__MoviePer__390350CBFE68D7D3");

            entity.ToTable("MoviePerson");

            entity.Property(e => e.PersonId).HasColumnName("Person_ID");
            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.Role).HasMaxLength(255);

            entity.HasOne(d => d.Movie).WithMany(p => p.MoviePeople)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MoviePers__Movie__45F365D3");

            entity.HasOne(d => d.Person).WithMany(p => p.MoviePeople)
                .HasForeignKey(d => d.PersonId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MoviePers__Perso__44FF419A");
        });

        modelBuilder.Entity<MovieSellPoint>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.SellPointId }).HasName("PK__MovieSel__8373B2F0EC6ADF7F");

            entity.ToTable("MovieSellPoint");

            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.SellPointId).HasColumnName("SellPoint_ID");

            entity.HasOne(d => d.Movie).WithMany(p => p.MovieSellPoints)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MovieSell__Movie__5070F446");

            entity.HasOne(d => d.SellPoint).WithMany(p => p.MovieSellPoints)
                .HasForeignKey(d => d.SellPointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MovieSell__SellP__5165187F");
        });

        modelBuilder.Entity<MovieTranslation>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.LanguageCode }).HasName("PK__MovieTra__3230CCA6FDAB878F");

            entity.ToTable("MovieTranslation");

            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.LanguageCode).HasMaxLength(10);
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.MovieTranslations)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MovieTran__Langu__4222D4EF");

            entity.HasOne(d => d.Movie).WithMany(p => p.MovieTranslations)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MovieTran__Movie__412EB0B6");
        });

        modelBuilder.Entity<News>(entity =>
        {
            entity.HasKey(e => e.NewsId).HasName("PK__News__DC88604BC91A20F8");

            entity.Property(e => e.NewsId).HasColumnName("News_ID");

            entity.HasMany(d => d.Movies).WithMany(p => p.News)
                .UsingEntity<Dictionary<string, object>>(
                    "NewsMovie",
                    r => r.HasOne<Movie>().WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__NewsMovie__Movie__59063A47"),
                    l => l.HasOne<News>().WithMany()
                        .HasForeignKey("NewsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__NewsMovie__News___5812160E"),
                    j =>
                    {
                        j.HasKey("NewsId", "MovieId").HasName("PK__NewsMovi__9B20E00B521A0AA0");
                        j.ToTable("NewsMovie");
                        j.IndexerProperty<int>("NewsId").HasColumnName("News_ID");
                        j.IndexerProperty<int>("MovieId").HasColumnName("Movie_ID");
                    });

            entity.HasMany(d => d.People).WithMany(p => p.News)
                .UsingEntity<Dictionary<string, object>>(
                    "NewsPerson",
                    r => r.HasOne<Person>().WithMany()
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__NewsPerso__Perso__5CD6CB2B"),
                    l => l.HasOne<News>().WithMany()
                        .HasForeignKey("NewsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__NewsPerso__News___5BE2A6F2"),
                    j =>
                    {
                        j.HasKey("NewsId", "PersonId").HasName("PK__NewsPers__7B62DD43E3464049");
                        j.ToTable("NewsPerson");
                        j.IndexerProperty<int>("NewsId").HasColumnName("News_ID");
                        j.IndexerProperty<int>("PersonId").HasColumnName("Person_ID");
                    });
        });

        modelBuilder.Entity<NewsTranslation>(entity =>
        {
            entity.HasKey(e => new { e.NewsId, e.LanguageCode }).HasName("PK__NewsTran__9430A8E8C7DC8578");

            entity.ToTable("NewsTranslation");

            entity.Property(e => e.NewsId).HasColumnName("News_ID");
            entity.Property(e => e.LanguageCode).HasMaxLength(10);
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.NewsTranslations)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__NewsTrans__Langu__5535A963");

            entity.HasOne(d => d.News).WithMany(p => p.NewsTranslations)
                .HasForeignKey(d => d.NewsId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__NewsTrans__News___5441852A");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__F1E4639B5B959D7E");

            entity.ToTable("Order");

            entity.Property(e => e.OrderId).HasColumnName("Order_ID");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("(datetime('now'))");
            entity.Property(e => e.OrderStateId).HasColumnName("OrderState_ID");
            entity.Property(e => e.SellPointId).HasColumnName("SellPoint_ID");
            entity.Property(e => e.UserId).HasColumnName("User_ID");

            entity.HasOne(d => d.OrderState).WithMany(p => p.Orders)
                .HasForeignKey(d => d.OrderStateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__OrderStat__3C69FB99");

            entity.HasOne(d => d.SellPoint).WithMany(p => p.Orders)
                .HasForeignKey(d => d.SellPointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__SellPoint__3E52440B");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__User_ID__3D5E1FD2");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.OrderId }).HasName("PK__OrderIte__D596423C3691F457");

            entity.ToTable("OrderItem");

            entity.Property(e => e.MovieId).HasColumnName("Movie_ID");
            entity.Property(e => e.OrderId).HasColumnName("Order_ID");
            entity.Property(e => e.Quantity).HasDefaultValue(1);
            entity.Property(e => e.PurchasedPrice).HasPrecision(18, 2);

            entity.HasOne(d => d.Movie).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__OrderItem__Movie__7A672E12");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__OrderItem__Order__7B5B524B");
        });

        modelBuilder.Entity<OrderState>(entity =>
        {
            entity.HasKey(e => e.OrderStateId).HasName("PK__OrderSta__FE9F9561BBF12A0D");

            entity.ToTable("OrderState");

            entity.Property(e => e.OrderStateId).HasColumnName("OrderState_ID");
        });

        modelBuilder.Entity<OrderStateTranslation>(entity =>
        {
            entity.HasKey(e => new { e.OrderStateId, e.LanguageCode }).HasName("PK__OrderSta__16C8D65E39A2DB81");

            entity.ToTable("OrderStateTranslation");

            entity.Property(e => e.LanguageCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.OrderState).WithMany(p => p.OrderStateTranslations)
                .HasForeignKey(d => d.OrderStateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderStat__Order__01142BA1");
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.PersonId).HasName("PK__Person__7EABD08B29B36885");

            entity.ToTable("Person");

            entity.Property(e => e.PersonId).HasColumnName("Person_ID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(datetime('now'))")
                .HasColumnName("createdAt");
            entity.Property(e => e.ImagePath).HasColumnName("imagePath");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Surname).HasMaxLength(255);
        });

        modelBuilder.Entity<SellPoint>(entity =>
        {
            entity.HasKey(e => e.SellPointId).HasName("PK__SellPoin__9FBB6F5EF441F108");

            entity.ToTable("SellPoint");

            entity.Property(e => e.SellPointId).HasColumnName("SellPoint_ID");
            entity.Property(e => e.Cap)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CAP");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Province)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<SellPointTranslation>(entity =>
        {
            entity.HasKey(e => new { e.SellPointId, e.LanguageCode });

            entity.ToTable("SellPointTranslation");

            entity.Property(e => e.SellPointId).HasColumnName("SellPoint_ID");
            entity.Property(e => e.LanguageCode).HasMaxLength(10);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.SellPointTranslations)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SellPointTranslation_Language");

            entity.HasOne(d => d.SellPoint).WithMany(p => p.SellPointTranslations)
                .HasForeignKey(d => d.SellPointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SellPointTranslation_SellPoint");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__206D9190B4E40C2D");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "UQ_User_Email").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("User_ID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(datetime('now'))")
                .HasColumnName("createdAt");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Surname).HasMaxLength(255);
            entity.Property(e => e.EmailNotificationsEnabled).HasDefaultValue(true);

            entity.HasOne(e => e.PreferredSellPoint)
                .WithMany()
                .HasForeignKey(e => e.PreferredSellPointId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}