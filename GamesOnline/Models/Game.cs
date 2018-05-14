using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace GamesOnline.Models
{
    public enum WindowType
    {
        Fixed, Scalable
    }
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UserViews { get; set; }
        public WindowType WindowType { get; set; }
        public string Path { get; set; }
        public string ImagePath { get; set; }
        public double Rating { get; set; }
        public int GameCategoryId { get; set; }
        public GameCategory GameCategory { get; set; }
    }
}
