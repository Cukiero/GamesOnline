using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models
{
    public class GameScore
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public DateTime Date { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
