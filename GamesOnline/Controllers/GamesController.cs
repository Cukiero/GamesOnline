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
    public class GamesController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public GamesController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _context.Games.OrderByDescending(g => g.UserViews).Include(gr => gr.GameCategory).ToListAsync();
            if (games != null)
            {
                return Ok(games);
            }
            return NotFound();
        }


        [HttpGet]
        public async Task<IActionResult> GetGameCategories()
        {
            var categories = await _context.GameCategories.OrderByDescending(c => c.Name).ToListAsync();
            if (categories != null)
            {
                return Ok(categories);
            }
            return NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetGame(int id)
        {
            var game = await _context.Games.SingleOrDefaultAsync(g => g.Id == id);
            if (game != null)
            {
                return Ok(game);
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> SaveScore([FromBody] GameScoreModel gameScoreModel)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }
                var userHighScore = await _context.GameHighScores.SingleOrDefaultAsync(h => h.ApplicationUserId == user.Id && h.GameId == gameScoreModel.GameId);
                var userScore = new GameScore()
                {
                    ApplicationUserId = user.Id,
                    GameId = gameScoreModel.GameId,
                    Score = gameScoreModel.Score,
                    Date = DateTime.Now,
                    IsHighScore = false
                };
                int isHighScore = 0;
                if (userHighScore != null)
                {
                    if (gameScoreModel.Score > userHighScore.Score)
                    {
                        userScore.IsHighScore = true;
                        userHighScore.Score = gameScoreModel.Score;
                        userHighScore.Date = DateTime.Now;

                        _context.GameScores.Add(userScore);
                        await _context.SaveChangesAsync();
                        isHighScore = 1;
                        return Ok(isHighScore);
                    }
                }
                else
                {
                    var newHighScore = new GameHighScore()
                    {
                        ApplicationUserId = user.Id,
                        GameId = gameScoreModel.GameId,
                        Score = userScore.Score,
                        Date = DateTime.Now
                    };
                    userScore.IsHighScore = true;
                    _context.GameScores.Add(userScore);
                    _context.GameHighScores.Add(newHighScore);
                    await _context.SaveChangesAsync();
                    isHighScore = 1;
                    return Ok(isHighScore);
                }
                _context.GameScores.Add(userScore);
                await _context.SaveChangesAsync();
                return Ok(isHighScore);
            }
            return BadRequest(ModelState);


        }

        [HttpPost]
        public async Task<IActionResult> AddGameRating([FromBody] GameRatingModel gameRatingModel)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }
                var game = await _context.Games.SingleOrDefaultAsync(g => g.Id == gameRatingModel.GameId);
                int[] possible_ratings = new int[] { 1, 2, 3, 4, 5 };

                if (game != null && possible_ratings.Contains(gameRatingModel.Rating))
                {
                    GameRating gameRating = new GameRating()
                    {
                        GameId = gameRatingModel.GameId,
                        Date = DateTime.Now,
                        Comment = gameRatingModel.Comment,
                        Rating = gameRatingModel.Rating,
                        ApplicationUserId = user.Id,
                        ApplicationUserName = user.UserName
                    };
                    _context.GameRatings.Add(gameRating);
                    await _context.SaveChangesAsync();

                    var game_ratings = await _context.GameRatings.Where(r => r.GameId == gameRatingModel.GameId).ToListAsync();
                    if(game_ratings != null)
                    {
                        double sumof_ratings = 0;
                        foreach(var rating in game_ratings)
                        {
                            sumof_ratings += rating.Rating;
                        }
                        double avg_rating = sumof_ratings / (double)game_ratings.Count();
                        avg_rating = Math.Round(avg_rating, 1);
                        game.Rating = avg_rating;
                        await _context.SaveChangesAsync();
                    }
                    return Ok();
                }
                return BadRequest();
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteGameRating(int ratingid)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var rating = await _context.GameRatings.SingleOrDefaultAsync(r => r.Id == ratingid);
                if(rating != null)
                {
                    if (rating.ApplicationUserId == user.Id)
                    {
                        _context.GameRatings.Remove(rating);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
                    return Unauthorized();
                }
                return BadRequest();
            }
            return Unauthorized();

        }

        [HttpGet]
        public async Task<IActionResult> GetGameRatings(int gameId)
        {
            var gameRatings = await _context.GameRatings.Where(g => g.GameId == gameId).OrderByDescending(d => d.Date).ToListAsync();
            if(gameRatings != null)
            {
                return Ok(gameRatings);
            }
            return NoContent();
        }
    }
}