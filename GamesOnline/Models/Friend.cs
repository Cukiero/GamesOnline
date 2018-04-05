using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamesOnline.Models
{
    public class Friend
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ApplicationUserFriend")]
        public string ApplicationUserFriendId { get; set; }
        public ApplicationUser ApplicationUserFriend { get; set; }
        public DateTime Date { get; set; }

        
        
    }
}
