using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using GamesOnline.Models;
using GamesOnline.Models.DataModels;
using GamesOnline.Models.ViewModels;
using GamesOnline.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace GamesOnline.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class FriendsController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public FriendsController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetFriends()
        {
            var user = await _userManager.GetUserAsync(User);
            
            if(user != null)
            {
                var friends = await _context.Friends.Where(f => f.ApplicationUserId == user.Id).Include(f => f.ApplicationUserFriend)
                    .Select(f => new FriendDto()
                    {
                        UserId = f.ApplicationUserFriend.Id,
                        UserName = f.ApplicationUserFriend.UserName,
                        AvatarPath = f.ApplicationUserFriend.AvatarPath,
                        Date = f.Date
                    }).ToListAsync();
                if(friends != null)
                {
                    return Ok(friends);
                }
                else
                {
                    return NoContent();
                }
            }
            return Unauthorized();
           
        }


    }
}