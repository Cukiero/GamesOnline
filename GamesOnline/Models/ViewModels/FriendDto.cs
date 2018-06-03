﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesOnline.Models.ViewModels
{
    public class FriendDto
    {
        public int Id { get; set; }
        public UserDto UserFriend { get; set; }
        public DateTime Date { get; set; }
        public bool isSender { get; set; }
    }
}
