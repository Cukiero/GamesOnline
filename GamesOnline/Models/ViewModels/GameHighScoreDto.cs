using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models.ViewModels
{
    public class GameHighScoreDto
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int GameId { get; set; }
        public DateTime Date { get; set; }
        public UserDto User { get; set; }
    }
}
