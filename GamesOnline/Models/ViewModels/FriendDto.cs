using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models.ViewModels
{
    public class FriendDto
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string AvatarPath { get; set; }
        public DateTime Date { get; set; }
    }
}
