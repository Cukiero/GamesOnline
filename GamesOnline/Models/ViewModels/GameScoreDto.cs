using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models.ViewModels
{
    public class GameScoreDto
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public Game Game { get; set; }
        public DateTime Date { get; set; }
        public bool IsHighScore { get; set; }
    }
}
