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
                    Name = "Er-pg",
                    Description = "Stwórz własną postać i walcz w świecie fantasy.",
                    UserViews = 0,
                    WindowType = WindowType.Scalable,
                    Rating = 4.6,
                    Path = "/games/erykgame/index.html",
                    ImagePath = "/games/erykgame/view.png",
                    GameCategory = gameCategories[4]
                },
                new Game
                {
                    Name = "Arkanoid",
                    Description = "Odbijaj kulke, żeby zbić wszystkie klocki.",
                    UserViews = 0,
                    WindowType = WindowType.Fixed,
                    Rating = 3.7,
                    Path = "/games/arkanoid/index.html",
                    ImagePath = "/games/arkanoid/view.png",
                    GameCategory = gameCategories[3]
                },
                new Game
                {
                    Name = "Emoji Run",
                    Description = "Steruj swoją emotikonką i spróbuj przejść jak najdalej.",
                    UserViews = 0,
                    WindowType = WindowType.Fixed,
                    Rating = 4.1,
                    Path = "/games/EmojiRun/EmojiRun.html",
                    ImagePath = "/games/EmojiRun/view.png",
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
