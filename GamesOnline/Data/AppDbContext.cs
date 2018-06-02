using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GamesOnline.Models;

namespace GamesOnline.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Friend> Friends { get; set; }
        public DbSet<FriendInvite> FriendInvites { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameCategory> GameCategories { get; set; }
        public DbSet<GameScore> GameScores { get; set; }
        public DbSet<GameHighScore> GameHighScores { get; set; }
        public DbSet<GameRating> GameRatings { get; set; }
    }
}
