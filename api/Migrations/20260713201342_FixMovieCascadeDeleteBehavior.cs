using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class FixMovieCascadeDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ChartItem__Movie__4D94879B",
                table: "ChartItem");

            migrationBuilder.DropForeignKey(
                name: "FK__MovieSell__Movie__5070F446",
                table: "MovieSellPoint");

            migrationBuilder.AddForeignKey(
                name: "FK__ChartItem__Movie__4D94879B",
                table: "ChartItem",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__MovieSell__Movie__5070F446",
                table: "MovieSellPoint",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__ChartItem__Movie__4D94879B",
                table: "ChartItem");

            migrationBuilder.DropForeignKey(
                name: "FK__MovieSell__Movie__5070F446",
                table: "MovieSellPoint");

            migrationBuilder.AddForeignKey(
                name: "FK__ChartItem__Movie__4D94879B",
                table: "ChartItem",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID");

            migrationBuilder.AddForeignKey(
                name: "FK__MovieSell__Movie__5070F446",
                table: "MovieSellPoint",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID");
        }
    }
}
