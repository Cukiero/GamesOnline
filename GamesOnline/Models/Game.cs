using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace GamesOnline.Models
{
    public enum GameType
    {
        Angular, Java, Flash
    }
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UserViews { get; set; }
        public GameType GameType { get; set; }
        public int GameCategoryId { get; set; }
        public GameCategory GameCategory { get; set; }
    }
}
