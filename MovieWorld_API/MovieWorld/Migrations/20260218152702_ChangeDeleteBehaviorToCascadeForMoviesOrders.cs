using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDeleteBehaviorToCascadeForMoviesOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__OrderItem__Movie__7A672E12",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK__OrderItem__Order__7B5B524B",
                table: "OrderItem");

            migrationBuilder.AddForeignKey(
                name: "FK__OrderItem__Movie__7A672E12",
                table: "OrderItem",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__OrderItem__Order__7B5B524B",
                table: "OrderItem",
                column: "Order_ID",
                principalTable: "Order",
                principalColumn: "Order_ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__OrderItem__Movie__7A672E12",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK__OrderItem__Order__7B5B524B",
                table: "OrderItem");

            migrationBuilder.AddForeignKey(
                name: "FK__OrderItem__Movie__7A672E12",
                table: "OrderItem",
                column: "Movie_ID",
                principalTable: "Movie",
                principalColumn: "Movie_ID");

            migrationBuilder.AddForeignKey(
                name: "FK__OrderItem__Order__7B5B524B",
                table: "OrderItem",
                column: "Order_ID",
                principalTable: "Order",
                principalColumn: "Order_ID");
        }
    }
}
