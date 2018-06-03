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
        public async Task<IActionResult> GetUsers()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                var users = await _userManager.Users
                    .Select(u => new UserDto()
                    {
                        UserId = u.Id,
                        UserName = u.UserName,
                        AvatarPath = u.AvatarPath
                    })
                    .Where(u => u.UserId != user.Id).OrderBy(u => u.UserName.ToLower()).ToListAsync();

                if(users != null)
                {
                    return Ok(users);
                }
                else
                {
                    return NoContent();
                }

            }
            return Unauthorized();

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
                        Id = f.Id,
                        UserFriend = new UserDto()
                        {
                            UserId = f.ApplicationUserFriend.Id,
                            UserName = f.ApplicationUserFriend.UserName,
                            AvatarPath = f.ApplicationUserFriend.AvatarPath
                        },
                        Date = f.Date,
                        isSender = f.isSender
                    }).OrderByDescending(f => f.UserFriend.UserName).ToListAsync();
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

        [HttpGet]
        public async Task<IActionResult> GetFriendInvites()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                var invites = await _context.FriendInvites.Where(f => f.ApplicationUserInvitedId == user.Id).Include(f => f.ApplicationUser)
                    .Select(f => new FriendInviteDto()
                    {
                        Id = f.Id,
                        Inviter = new UserDto() {
                            UserId = f.ApplicationUserId,
                            UserName = f.ApplicationUser.UserName,
                            AvatarPath = f.ApplicationUser.AvatarPath
                        },
                        Date = f.Date
                    }).OrderByDescending(f => f.Date).ToListAsync();
                if (invites != null)
                {
                    return Ok(invites);
                }
                else
                {
                    return NoContent();
                }
            }
            return Unauthorized();

        }

        [HttpGet]
        public async Task<IActionResult> GetMyInvites()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                var invites = await _context.FriendInvites.Where(f => f.ApplicationUserId == user.Id).Include(f => f.ApplicationUserInvited)
                    .Select(f => new UserInviteDto()
                    {
                        Id = f.Id,
                        UserInvited = new UserDto()
                        {
                            UserId = f.ApplicationUserInvitedId,
                            UserName = f.ApplicationUserInvited.UserName,
                            AvatarPath = f.ApplicationUserInvited.AvatarPath
                        },
                        Date = f.Date
                    }).OrderByDescending(f => f.Date).ToListAsync();
                if (invites != null)
                {
                    return Ok(invites);
                }
                else
                {
                    return NoContent();
                }
            }
            return Unauthorized();

        }

        [HttpPost]
        public async Task<IActionResult> RemoveFriend(string friendId)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                var myFriendship = await _context.Friends.SingleOrDefaultAsync(f => f.ApplicationUserId == user.Id && f.ApplicationUserFriendId == friendId);
                var otherFriendship = await _context.Friends.SingleOrDefaultAsync(f => f.ApplicationUserId == friendId && f.ApplicationUserFriendId == user.Id);

                if(myFriendship != null)
                {
                    _context.Friends.Remove(myFriendship);
                }
                if (otherFriendship != null)
                {
                    _context.Friends.Remove(otherFriendship);
                }
                await _context.SaveChangesAsync();
                return Ok();
            }
            return Unauthorized();
        }
        [HttpPost]
        public async Task<IActionResult> InviteFriend(string friendId)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                if(user.Id == friendId)
                {
                    return BadRequest();
                }
                var invitedUser = await _userManager.FindByIdAsync(friendId);

                if (invitedUser != null)
                {
                    var invitationFromMe = await _context.FriendInvites.SingleOrDefaultAsync(f => f.ApplicationUserId == user.Id && f.ApplicationUserInvitedId == invitedUser.Id);
                    var invitationToMe = await _context.FriendInvites.SingleOrDefaultAsync(f => f.ApplicationUserInvitedId == user.Id && f.ApplicationUserId == invitedUser.Id);

                    if (invitationFromMe == null && invitationToMe == null)
                    {
                        _context.FriendInvites.Add(new FriendInvite()
                        {
                            ApplicationUserId = user.Id,
                            ApplicationUserInvitedId = invitedUser.Id,
                            Date = DateTime.Now
                        });
                        await _context.SaveChangesAsync();
                    }
                    return Ok();
                }
                return BadRequest();
            }
            return Unauthorized();
        }

        [HttpPost]
        public async Task<IActionResult> AcceptFriendInvite(int inviteId)
        {
            var user = await _userManager.GetUserAsync(User);
            if(user != null)
            {
                var invite = await _context.FriendInvites.SingleOrDefaultAsync(i => i.Id == inviteId);

                if(invite != null)
                {
                    string friendId = invite.ApplicationUserId;

                    if (invite.ApplicationUserInvitedId == user.Id)
                    {
                        var newFriend = new Friend()
                        {
                            ApplicationUserId = user.Id,
                            ApplicationUserFriendId = friendId,
                            Date = DateTime.Now,
                            isSender = true
                        };
                        _context.Friends.Add(newFriend);
                        _context.Friends.Add(new Friend()
                        {
                            ApplicationUserId = friendId,
                            ApplicationUserFriendId = user.Id,
                            Date = DateTime.Now,
                            isSender = false
                        });
                        
                        _context.FriendInvites.Remove(invite);
                        await _context.SaveChangesAsync();

                        var newFriendDto = await _context.Friends.Where(f => f.ApplicationUserId == user.Id && f.ApplicationUserFriendId == friendId).Include(f => f.ApplicationUserFriend)
                            .Select(f => new FriendDto()
                            {
                                Id = f.Id,
                                UserFriend = new UserDto()
                                {
                                    UserId = f.ApplicationUserFriendId,
                                    UserName = f.ApplicationUserFriend.UserName,
                                    AvatarPath = f.ApplicationUserFriend.AvatarPath
                                },
                                Date = f.Date,
                                isSender = f.isSender
                            }).SingleOrDefaultAsync();

                        if(newFriendDto != null)
                        {
                            return Ok(newFriendDto);
                        }

                        return Ok();
                    }
                    return BadRequest();
                }
                return NoContent();
            }
            return Unauthorized();
        }

    }
}