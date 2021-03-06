﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GamesOnline.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string AvatarPath { get; set; }

        public ApplicationUser()
        {
            this.AvatarPath = "/media/avatar-example.jpg";
        }

    }
}
