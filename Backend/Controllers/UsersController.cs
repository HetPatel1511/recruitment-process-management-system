using System.Security.Claims;
using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;
using Backend.Services.FileHandling;
using Backend.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class UsersController : ControllerBase
  {
    public readonly IFileService _fileService;
    public readonly IUserService _userService;

    public UsersController(IFileService fileService, IUserService userService)
    {
      _fileService = fileService;
      _userService = userService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserResponseDTO>> GetMyUser()
    {
      try
      {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { success = false, message = "Invalid user ID in token" });
        }

        var user = await _userService.GetMyUserAsync(int.Parse(userId));
        return Ok(new { success = true, message = "User retrieved successfully", data = user });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserResponseDTO>> UpdateMyUser(UpdateUserDTO updateUserDto)
    {
      try
      {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { success = false, message = "Invalid user ID in token" });
        }

        var updateUserServiceDto = new UpdateUserServiceDTO
        {
          Name = updateUserDto.Name,
          Headline = updateUserDto.Headline,
          About = updateUserDto.About
        };
        Console.WriteLine("updateUserServiceDto");
        Console.WriteLine(updateUserServiceDto.Name);
        Console.WriteLine(updateUserServiceDto.Headline);
        Console.WriteLine(updateUserServiceDto.About);
        Console.WriteLine(updateUserDto.Name);
        Console.WriteLine(updateUserDto.Headline);
        Console.WriteLine(updateUserDto.About);

        if (updateUserDto.ImageFile != null)
        {
          if (updateUserDto.ImageFile.Length > 1 * 1024 * 1024)
          {
              return StatusCode(StatusCodes.Status400BadRequest, "File size should not exceed 1 MB");
          }
          string[] allowedFileExtensions = [".jpg", ".jpeg", ".png", ".avif"];
          updateUserServiceDto.ImageUrl = await _fileService.SaveFileAsync(updateUserDto.ImageFile, allowedFileExtensions);
        }

        var user = await _userService.UpdateMyUserAsync(int.Parse(userId), updateUserServiceDto);
        return Ok(new { success = true, message = "User updated successfully", data = user });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }
  }
}