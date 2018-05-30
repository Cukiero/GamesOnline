using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using GamesOnline.Models;
using GamesOnline.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Transforms;
using SixLabors.Primitives;



namespace GamesOnline.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHostingEnvironment _environment;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IHostingEnvironment environment
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
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
                    var user = await _userManager.FindByNameAsync(model.Username);
                    if(user != null)
                    {
                        var userDto = new UserDto()
                        {
                            UserId = user.Id,
                            UserName = user.UserName,
                            AvatarPath = user.AvatarPath
                        };

                        return Ok(userDto);
                    }
                    return Ok();
                }else {
                    return NotFound();
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> IsLoggedIn()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var userDto = new UserDto()
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    AvatarPath = user.AvatarPath
                };

                return Ok(userDto);
            }
            else {
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

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ChangePhoto([FromForm] IFormFile image)
        {
            var uploads = Path.Combine(_environment.WebRootPath, "media");
            uploads = Path.Combine(uploads, "avatars");
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                if(image != null)
                {
                    if (image.Length > 0)
                    {
                        
                        var extension = Path.GetExtension(image.FileName);
                        if(extension != ".jpg")
                        {
                            return BadRequest();
                        }
                        var fileName = user.UserName + extension;
                        var filePath = Path.Combine(uploads, fileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await image.CopyToAsync(fileStream);
                            fileStream.Close();
                            if(EditPhoto(filePath) == false)
                            {
                                System.IO.File.Delete(filePath);
                                user.AvatarPath = "/media/avatar-example.jpg";
                                await _userManager.UpdateAsync(user);
                                return Ok(new { avatarPath = user.AvatarPath });
                            }
                            user.AvatarPath = "/media/avatars/" + fileName;
                            await _userManager.UpdateAsync(user);
                            return Ok(new { avatarPath = user.AvatarPath});
                        }
                    }
                }
                return NoContent();
            }
            return Unauthorized();
            
        }

        public Boolean EditPhoto(string filePath)
        {
            try
            {
                using (Image<Rgba32> image = Image.Load(filePath))
                {
                    var height = image.Height;
                    var width = image.Width;
                    if(height > width)
                    {
                        image.Mutate(x =>
                        x.Crop(new SixLabors.Primitives.Rectangle(0, (height - width) / 2, width, width))
                        .Resize(new Size(200, 200))
                        );
                    }else if(width > height)
                    {
                        image.Mutate(x =>
                        x.Crop(new SixLabors.Primitives.Rectangle((width - height) / 2, 0, height, height))
                        .Resize(new Size(200, 200))
                        );
                    }
                    else
                    {
                        image.Mutate(x =>
                        x.Resize(new Size(200, 200))
                        );
                    }
                    image.Save(filePath);
                }
                return true;
            }catch(FileNotFoundException ex)
            {
                return false;
            }
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