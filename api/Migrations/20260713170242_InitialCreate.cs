using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieWorld.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Format",
                columns: table => new
                {
                    Format_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Format__C66EB6DCC5873E6B", x => x.Format_ID);
                });

            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    Genre_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Genre__964A20062CDBCC18", x => x.Genre_ID);
                });

            migrationBuilder.CreateTable(
                name: "LanguageCode",
                columns: table => new
                {
                    LanguageCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Language__8B8C8A3513DDEABF", x => x.LanguageCode);
                });

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    News_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ImagePath = table.Column<string>(type: "TEXT", nullable: true),
                    Date = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__News__DC88604BC91A20F8", x => x.News_ID);
                });

            migrationBuilder.CreateTable(
                name: "OrderState",
                columns: table => new
                {
                    OrderState_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderSta__FE9F9561BBF12A0D", x => x.OrderState_ID);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Person_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Surname = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    imagePath = table.Column<string>(type: "TEXT", nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "(datetime('now'))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Person__7EABD08B29B36885", x => x.Person_ID);
                });

            migrationBuilder.CreateTable(
                name: "SellPoint",
                columns: table => new
                {
                    SellPoint_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Province = table.Column<string>(type: "TEXT", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    CAP = table.Column<string>(type: "TEXT", unicode: false, fixedLength: true, maxLength: 5, nullable: true),
                    Lat = table.Column<double>(type: "REAL", nullable: true),
                    Lng = table.Column<double>(type: "REAL", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SellPoin__9FBB6F5EF441F108", x => x.SellPoint_ID);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    User_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    HashPassword = table.Column<string>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Surname = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    ImagePath = table.Column<string>(type: "TEXT", nullable: true),
                    createdAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "(datetime('now'))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__206D9190B4E40C2D", x => x.User_ID);
                });

            migrationBuilder.CreateTable(
                name: "Movie",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Format_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Cost = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: true),
                    Year = table.Column<int>(type: "INTEGER", nullable: true),
                    TrailerURL = table.Column<string>(type: "TEXT", nullable: true),
                    IsCult = table.Column<bool>(type: "INTEGER", nullable: true),
                    ImagePath = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Movie__7A8804053452EFE6", x => x.Movie_ID);
                    table.ForeignKey(
                        name: "FK__Movie__Format_ID__33D4B598",
                        column: x => x.Format_ID,
                        principalTable: "Format",
                        principalColumn: "Format_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreTranslation",
                columns: table => new
                {
                    Genre_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GenreTra__DEF2E8A5963F4BE9", x => new { x.Genre_ID, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK__GenreTran__Genre__48CFD27E",
                        column: x => x.Genre_ID,
                        principalTable: "Genre",
                        principalColumn: "Genre_ID");
                    table.ForeignKey(
                        name: "FK__GenreTran__Langu__49C3F6B7",
                        column: x => x.LanguageCode,
                        principalTable: "LanguageCode",
                        principalColumn: "LanguageCode");
                });

            migrationBuilder.CreateTable(
                name: "NewsTranslation",
                columns: table => new
                {
                    News_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Text = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsTran__9430A8E8C7DC8578", x => new { x.News_ID, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK__NewsTrans__Langu__5535A963",
                        column: x => x.LanguageCode,
                        principalTable: "LanguageCode",
                        principalColumn: "LanguageCode",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__NewsTrans__News___5441852A",
                        column: x => x.News_ID,
                        principalTable: "News",
                        principalColumn: "News_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderStateTranslation",
                columns: table => new
                {
                    OrderStateId = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", unicode: false, maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "TEXT", unicode: false, maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderSta__16C8D65E39A2DB81", x => new { x.OrderStateId, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK__OrderStat__Order__01142BA1",
                        column: x => x.OrderStateId,
                        principalTable: "OrderState",
                        principalColumn: "OrderState_ID");
                });

            migrationBuilder.CreateTable(
                name: "NewsPerson",
                columns: table => new
                {
                    News_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Person_ID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsPers__7B62DD43E3464049", x => new { x.News_ID, x.Person_ID });
                    table.ForeignKey(
                        name: "FK__NewsPerso__News___5BE2A6F2",
                        column: x => x.News_ID,
                        principalTable: "News",
                        principalColumn: "News_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__NewsPerso__Perso__5CD6CB2B",
                        column: x => x.Person_ID,
                        principalTable: "Person",
                        principalColumn: "Person_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SellPointTranslation",
                columns: table => new
                {
                    SellPoint_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Address = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellPointTranslation", x => new { x.SellPoint_ID, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK_SellPointTranslation_Language",
                        column: x => x.LanguageCode,
                        principalTable: "LanguageCode",
                        principalColumn: "LanguageCode");
                    table.ForeignKey(
                        name: "FK_SellPointTranslation_SellPoint",
                        column: x => x.SellPoint_ID,
                        principalTable: "SellPoint",
                        principalColumn: "SellPoint_ID");
                });

            migrationBuilder.CreateTable(
                name: "Chart",
                columns: table => new
                {
                    Chart_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    User_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    CreationData = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(datetime('now'))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Chart__314712152BEAFB54", x => x.Chart_ID);
                    table.ForeignKey(
                        name: "FK__Chart__User_ID__37A5467C",
                        column: x => x.User_ID,
                        principalTable: "User",
                        principalColumn: "User_ID");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    Order_ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(datetime('now'))"),
                    OrderState_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    User_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    SellPoint_ID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__F1E4639B5B959D7E", x => x.Order_ID);
                    table.ForeignKey(
                        name: "FK__Order__OrderStat__3C69FB99",
                        column: x => x.OrderState_ID,
                        principalTable: "OrderState",
                        principalColumn: "OrderState_ID");
                    table.ForeignKey(
                        name: "FK__Order__SellPoint__3E52440B",
                        column: x => x.SellPoint_ID,
                        principalTable: "SellPoint",
                        principalColumn: "SellPoint_ID");
                    table.ForeignKey(
                        name: "FK__Order__User_ID__3D5E1FD2",
                        column: x => x.User_ID,
                        principalTable: "User",
                        principalColumn: "User_ID");
                });

            migrationBuilder.CreateTable(
                name: "MovieGenre",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Genre_ID = table.Column<int>(type: "INTEGER", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "MoviePerson",
                columns: table => new
                {
                    Person_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MoviePer__390350CBFE68D7D3", x => new { x.Person_ID, x.Movie_ID });
                    table.ForeignKey(
                        name: "FK__MoviePers__Movie__45F365D3",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__MoviePers__Perso__44FF419A",
                        column: x => x.Person_ID,
                        principalTable: "Person",
                        principalColumn: "Person_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MovieSellPoint",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    SellPoint_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantità = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MovieSel__8373B2F0EC6ADF7F", x => new { x.Movie_ID, x.SellPoint_ID });
                    table.ForeignKey(
                        name: "FK__MovieSell__Movie__5070F446",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID");
                    table.ForeignKey(
                        name: "FK__MovieSell__SellP__5165187F",
                        column: x => x.SellPoint_ID,
                        principalTable: "SellPoint",
                        principalColumn: "SellPoint_ID");
                });

            migrationBuilder.CreateTable(
                name: "MovieTranslation",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Story = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MovieTra__3230CCA6FDAB878F", x => new { x.Movie_ID, x.LanguageCode });
                    table.ForeignKey(
                        name: "FK__MovieTran__Langu__4222D4EF",
                        column: x => x.LanguageCode,
                        principalTable: "LanguageCode",
                        principalColumn: "LanguageCode",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__MovieTran__Movie__412EB0B6",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NewsMovie",
                columns: table => new
                {
                    News_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsMovi__9B20E00B521A0AA0", x => new { x.News_ID, x.Movie_ID });
                    table.ForeignKey(
                        name: "FK__NewsMovie__Movie__59063A47",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__NewsMovie__News___5812160E",
                        column: x => x.News_ID,
                        principalTable: "News",
                        principalColumn: "News_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChartItem",
                columns: table => new
                {
                    Chart_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantità = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChartIte__76EF9255BF58DFA4", x => new { x.Chart_ID, x.Movie_ID });
                    table.ForeignKey(
                        name: "FK__ChartItem__Chart__4CA06362",
                        column: x => x.Chart_ID,
                        principalTable: "Chart",
                        principalColumn: "Chart_ID");
                    table.ForeignKey(
                        name: "FK__ChartItem__Movie__4D94879B",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID");
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    Movie_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Order_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 1),
                    PurchasedPrice = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderIte__D596423C3691F457", x => new { x.Movie_ID, x.Order_ID });
                    table.ForeignKey(
                        name: "FK__OrderItem__Movie__7A672E12",
                        column: x => x.Movie_ID,
                        principalTable: "Movie",
                        principalColumn: "Movie_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__OrderItem__Order__7B5B524B",
                        column: x => x.Order_ID,
                        principalTable: "Order",
                        principalColumn: "Order_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chart_User_ID",
                table: "Chart",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ChartItem_Movie_ID",
                table: "ChartItem",
                column: "Movie_ID");

            migrationBuilder.CreateIndex(
                name: "IX_GenreTranslation_LanguageCode",
                table: "GenreTranslation",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_Movie_Format_ID",
                table: "Movie",
                column: "Format_ID");

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenre_Genre_ID",
                table: "MovieGenre",
                column: "Genre_ID");

            migrationBuilder.CreateIndex(
                name: "IX_MoviePerson_Movie_ID",
                table: "MoviePerson",
                column: "Movie_ID");

            migrationBuilder.CreateIndex(
                name: "IX_MovieSellPoint_SellPoint_ID",
                table: "MovieSellPoint",
                column: "SellPoint_ID");

            migrationBuilder.CreateIndex(
                name: "IX_MovieTranslation_LanguageCode",
                table: "MovieTranslation",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_NewsMovie_Movie_ID",
                table: "NewsMovie",
                column: "Movie_ID");

            migrationBuilder.CreateIndex(
                name: "IX_NewsPerson_Person_ID",
                table: "NewsPerson",
                column: "Person_ID");

            migrationBuilder.CreateIndex(
                name: "IX_NewsTranslation_LanguageCode",
                table: "NewsTranslation",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "IX_Order_OrderState_ID",
                table: "Order",
                column: "OrderState_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_SellPoint_ID",
                table: "Order",
                column: "SellPoint_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_User_ID",
                table: "Order",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_Order_ID",
                table: "OrderItem",
                column: "Order_ID");

            migrationBuilder.CreateIndex(
                name: "IX_SellPointTranslation_LanguageCode",
                table: "SellPointTranslation",
                column: "LanguageCode");

            migrationBuilder.CreateIndex(
                name: "UQ_User_Email",
                table: "User",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChartItem");

            migrationBuilder.DropTable(
                name: "GenreTranslation");

            migrationBuilder.DropTable(
                name: "MovieGenre");

            migrationBuilder.DropTable(
                name: "MoviePerson");

            migrationBuilder.DropTable(
                name: "MovieSellPoint");

            migrationBuilder.DropTable(
                name: "MovieTranslation");

            migrationBuilder.DropTable(
                name: "NewsMovie");

            migrationBuilder.DropTable(
                name: "NewsPerson");

            migrationBuilder.DropTable(
                name: "NewsTranslation");

            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "OrderStateTranslation");

            migrationBuilder.DropTable(
                name: "SellPointTranslation");

            migrationBuilder.DropTable(
                name: "Chart");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "Movie");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "LanguageCode");

            migrationBuilder.DropTable(
                name: "Format");

            migrationBuilder.DropTable(
                name: "OrderState");

            migrationBuilder.DropTable(
                name: "SellPoint");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
