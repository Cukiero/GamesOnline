using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesOnline.Models;
using Microsoft.EntityFrameworkCore;

namespace GamesOnline.Data
{
    public class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Games.Any())
            {
                return;
            }

            var gameCategories = new GameCategory[]
            {
                new GameCategory
                {
                    Name = "Action"
                },
                new GameCategory
                {
                    Name = "Adventure"
                },
                new GameCategory
                {
                    Name = "Arcade"
                },
                new GameCategory
                {
                    Name = "Card"
                },
                new GameCategory
                {
                    Name = "Fighting"
                },
                new GameCategory
                {
                    Name = "Kids"
                },
                new GameCategory
                {
                    Name = "Platform"
                },
                new GameCategory
                {
                    Name = "Puzzle"
                },
                new GameCategory
                {
                    Name = "Racing"
                },
                new GameCategory
                {
                    Name = "Sports"
                }
            };
            foreach(GameCategory ctg in gameCategories)
            {
                context.GameCategories.Add(ctg);
            };

            var games = new Game[]
            {
                new Game
                {
                    Name = "ErykGame",
                    Description = "Cześć, jestem Eryk i zrobiłem grę w Angularze. Możesz w niej walczyć i nabijać levele.",
                    UserViews = 0,
                    WindowType = WindowType.Scalable,
                    Rating = 5.0,
                    Path = "/games/erykgame/index.html",
                    GameCategory = gameCategories[4]
                },
                new Game
                {
                    Name = "DamianGame",
                    Description = "Cześć, jestem Damian i robię grę w Javie tylko nie wiem jaką.",
                    UserViews = 0,
                    WindowType = WindowType.Fixed,
                    Rating = 5.0,
                    Path = "/",
                    GameCategory = gameCategories[3]
                },
                new Game
                {
                    Name = "KacperGame",
                    Description = "Cześć, jestem Kacprem i robię platformówkę w przestarzałym Flashu.",
                    UserViews = 0,
                    WindowType = WindowType.Fixed,
                    Rating = 5.0,
                    Path = "/games/EmojiRun/EmojiRun.html",
                    GameCategory = gameCategories[6]
                }
            };
            foreach(Game game in games)
            {
                context.Games.Add(game);
            }

            context.SaveChanges();
        }
    }
}
