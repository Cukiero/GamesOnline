using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace GamesOnline.Migrations
{
    public partial class friend_invites : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isSender",
                table: "Friends",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "FriendInvites",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ApplicationUserId = table.Column<string>(nullable: true),
                    ApplicationUserInvitedId = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendInvites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FriendInvites_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FriendInvites_AspNetUsers_ApplicationUserInvitedId",
                        column: x => x.ApplicationUserInvitedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FriendInvites_ApplicationUserId",
                table: "FriendInvites",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendInvites_ApplicationUserInvitedId",
                table: "FriendInvites",
                column: "ApplicationUserInvitedId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FriendInvites");

            migrationBuilder.DropColumn(
                name: "isSender",
                table: "Friends");
        }
    }
}
