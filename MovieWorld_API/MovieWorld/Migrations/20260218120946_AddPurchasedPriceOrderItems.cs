using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class AddPurchasedPriceOrderItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PurchasedPrice",
                table: "OrderItem",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchasedPrice",
                table: "OrderItem");
        }
    }
}
