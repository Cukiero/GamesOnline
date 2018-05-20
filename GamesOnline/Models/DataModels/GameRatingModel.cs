using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models.DataModels
{
    public class GameRatingModel
    {
        public int GameId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
