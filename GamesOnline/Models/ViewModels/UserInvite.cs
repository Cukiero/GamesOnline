using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamesOnline.Models.ViewModels
{
    public class UserInviteDto
    {
        public int Id { get; set; }
        public UserDto UserInvited { get; set; }
        public DateTime Date { get; set; }


    }
}
