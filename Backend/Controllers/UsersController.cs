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

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<UserPaginationResponseDTO>> GetUsers([FromQuery] UserPaginationRequestDTO userPaginationRequestDTO)
    {
      try
      {
        var users = await _userService.GetUsersAsync(userPaginationRequestDTO);
        return Ok(new { success = true, message = "Users retrieved successfully", data = users });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponseDTO>> GetUser(int id)
    {
      try
      {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { success = false, message = "Invalid user ID in token" });
        }

        var user = await _userService.GetUserAsync(id);
        return Ok(new { success = true, message = "User retrieved successfully", data = user });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserResponseDTO>> UpdateUser(UpdateUserDTO updateUserDto)
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

        if (updateUserDto.ImageFile != null)
        {
          if (updateUserDto.ImageFile.Length > 1 * 1024 * 1024)
          {
              return StatusCode(StatusCodes.Status400BadRequest, "File size should not exceed 1 MB");
          }
          string[] allowedFileExtensions = [".jpg", ".jpeg", ".png", ".avif"];
          updateUserServiceDto.ImageUrl = await _fileService.SaveFileAsync(updateUserDto.ImageFile, allowedFileExtensions, "Uploads");
        }

        var user = await _userService.UpdateUserAsync(int.Parse(userId), updateUserServiceDto);
        return Ok(new { success = true, message = "User updated successfully", data = user });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }
  
    [Authorize(Roles = "admin")]
    [HttpPut("{id}/role")]
    public async Task<ActionResult<UserResponseDTO>> UpdateUserRole(int id, UpdateUserRoleDTO updateUserRoleDto)
    {
      try
      {
        var user = await _userService.UpdateUserRoleAsync(id, updateUserRoleDto);
        return Ok(new { success = true, message = "User updated successfully", data = user });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }

    [Authorize(Roles = "admin")]
    [HttpPost("bulk-upload")]
    public async Task<ActionResult<UserResponseDTO>> BulkUploadUsers(BulkUploadUserRequestDTO bulkUploadUserRequestDTO)
    {
      try
      {
        if (bulkUploadUserRequestDTO.File == null)
        {
          return BadRequest(new { success = false, message = "File is required" });
        }

        string[] allowedFileExtensions = [".csv", ".xlsx", ".xls"];
        string uploadPath = "Uploads/BulkUpload";
        var bulkUploadFile = await _fileService.SaveFileAsync(bulkUploadUserRequestDTO.File, allowedFileExtensions, uploadPath);

        var bulkUploadUserServiceDTO = new BulkUploadUserServiceDTO
        {
          FilePath = $"{uploadPath}/{bulkUploadFile}"
        };

        var users = await _userService.BulkUploadUsersAsync(bulkUploadUserServiceDTO);
        return Ok(new { success = true, message = "Users uploaded successfully", data = users });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }
  
    [Authorize]
    [HttpPost("me/cv")]
    public async Task<ActionResult<UploadCvResultDTO>> UploadCV(IFormFile file)
    {
      try
      {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { success = false, message = "User not authenticated" });
        }


        if (file == null)
        {
          return BadRequest(new { success = false, message = "CV file is required" });
        }
        
        string[] allowedFileExtensions = [".pdf"];
        var cvPath = await _fileService.SaveFileAsync(file, allowedFileExtensions, "Uploads/UserCV");
        
        var data = await _userService.UploadCVAsync(cvPath, int.Parse(userId));
        return Ok(new { success = true, message = "CV uploaded successfully", data });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }

  }
}