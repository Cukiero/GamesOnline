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
    public class RankingsController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public RankingsController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GameHighScores(int gameId)
        {
            var gameHighScores = await _context.GameHighScores.Where(g => g.GameId == gameId).Include(g => g.ApplicationUser)
                .Select(s => new GameHighScoreDto()
                    {
                        Id = s.Id,
                        Score = s.Score,
                        GameId = s.GameId,
                        Date = s.Date,
                        User = new UserDto()
                        {
                            UserId = s.ApplicationUserId,
                            UserName = s.ApplicationUser.UserName,
                            AvatarPath = s.ApplicationUser.AvatarPath
                        }
                    })
                .OrderByDescending(g => g.Score).ToListAsync();
            if(gameHighScores != null)
            {
                return Ok(gameHighScores);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpGet]
        public async Task<IActionResult> FriendsGameHighScores(int gameId)
        {
            var user = await _userManager.GetUserAsync(User);
            if(user != null)
            {
                List<string> friends = await _context.Friends.Where(f => f.ApplicationUserId == user.Id).Select(f => f.ApplicationUserFriendId).ToListAsync();

                if(friends != null)
                {
                    var gameHighScores = await _context.GameHighScores.Where(g => g.GameId == gameId && friends.Contains(g.ApplicationUserId)).Include(g => g.ApplicationUser)
                .Select(s => new GameHighScoreDto()
                {
                    Id = s.Id,
                    Score = s.Score,
                    GameId = s.GameId,
                    Date = s.Date,
                    User = new UserDto()
                    {
                        UserId = s.ApplicationUserId,
                        UserName = s.ApplicationUser.UserName,
                        AvatarPath = s.ApplicationUser.AvatarPath
                    }
                })
                .OrderByDescending(g => g.Score).ToListAsync();
                    if (gameHighScores != null)
                    {
                        return Ok(gameHighScores);
                    }
                    else
                    {
                        return NoContent();
                    }
                }
                else
                {
                    return NoContent();
                }
            }
            return Unauthorized();

            
        }

        [HttpGet]
        public async Task<IActionResult> UserScores()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var userScores = await _context.GameScores.Where(s => s.ApplicationUserId == user.Id).Include(s => s.Game)
                    .Select(s => new GameScoreDto()
                    {
                        Id = s.Id,
                        Score = s.Score,
                        Game = s.Game,
                        Date = s.Date,
                        IsHighScore = s.IsHighScore
                    }).OrderByDescending(s => s.Date).ToListAsync();
                if(userScores != null)
                {
                    return Ok(userScores);
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