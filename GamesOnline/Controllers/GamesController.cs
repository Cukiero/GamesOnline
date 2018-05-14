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
        public GamesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _context.Games.OrderByDescending(g => g.UserViews).Include(gr => gr.GameCategory).ToListAsync();
            if(games != null)
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

        
    }
}