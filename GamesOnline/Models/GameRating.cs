using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models
{
    public class GameRating
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public DateTime Date { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public string ApplicationUserName { get; set; }
    }
}
