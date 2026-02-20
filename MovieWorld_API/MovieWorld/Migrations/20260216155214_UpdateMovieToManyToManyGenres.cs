using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMovieToManyToManyGenres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Movie__Genre_ID__34C8D9D1",
                table: "Movie");

            migrationBuilder.DropIndex(
                name: "IX_Movie_Genre_ID",
                table: "Movie");

            migrationBuilder.DropColumn(
                name: "Genre_ID",
                table: "Movie");

            migrationBuilder.CreateTable(
                name: "MovieGenre",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "int", nullable: false),
                    Genre_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieGenre", x => new { x.Movie_ID, x.Genre_ID });
                    table.ForeignKey(
                        name: "FK_MovieGenre_Genre",
                        column: x => x.Genre_ID,
                        principalTable: "Genre",
                        principalColumn: "Genre_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieGenre_Movie",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenre_Genre_ID",
                table: "MovieGenre",
                column: "Genre_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieGenre");

            migrationBuilder.AddColumn<int>(
                name: "Genre_ID",
                table: "Movie",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Movie_Genre_ID",
                table: "Movie",
                column: "Genre_ID");

            migrationBuilder.AddForeignKey(
                name: "FK__Movie__Genre_ID__34C8D9D1",
                table: "Movie",
                column: "Genre_ID",
                principalTable: "Genre",
                principalColumn: "Genre_ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
