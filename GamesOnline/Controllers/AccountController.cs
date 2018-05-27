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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GamesOnline.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    AvatarPath = "/media/avatar-example.jpg"
                };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    return CreatedAtAction(nameof(Register), null);

                }else {
                    return new StatusCodeResult((int)HttpStatusCode.Conflict);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (ModelState.IsValid)
            {
                await Logout();
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, true, false);

                if (result.Succeeded)
                {
                    return Ok(new { Username = model.Username });

                }else {
                    return NotFound();
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult IsLoggedIn()
        {
            bool isAuthenticated = User.Identity.IsAuthenticated;
            if(isAuthenticated == true)
            {
                return Ok(new { Username = User.Identity.Name });
            }else {
                return Unauthorized();
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async  Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        public class LoginDto
        {
            [Required]
            public string Username { get; set; }

            [Required]
            public string Password { get; set; }

        }

        public class RegisterDto
        {
            [Required]
            public string Username { get; set; }
            [Required]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }
        }
    }
}