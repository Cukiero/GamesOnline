using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamesOnline.Models.ViewModels
{
    public class FriendInviteDto
    {
        public int Id { get; set; }
        public UserDto Inviter { get; set; }
        public DateTime Date { get; set; }


    }
}
