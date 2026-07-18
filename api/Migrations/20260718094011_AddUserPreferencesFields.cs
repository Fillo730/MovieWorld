using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPreferencesFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailNotificationsEnabled",
                table: "User",
                type: "INTEGER",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "PreferredSellPointId",
                table: "User",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_PreferredSellPointId",
                table: "User",
                column: "PreferredSellPointId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_SellPoint_PreferredSellPointId",
                table: "User",
                column: "PreferredSellPointId",
                principalTable: "SellPoint",
                principalColumn: "SellPoint_ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_SellPoint_PreferredSellPointId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_PreferredSellPointId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EmailNotificationsEnabled",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PreferredSellPointId",
                table: "User");
        }
    }
}
