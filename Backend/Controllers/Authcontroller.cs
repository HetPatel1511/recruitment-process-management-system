using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Entities;
using Backend.DTOs.AuthDTOs;
using Backend.Services.Auth;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
  [ApiController]
  [Route("[Controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDTO>> Register(UserCreateDTO userDto)
    {
      var userResponseDTO = await _authService.RegisterAsync(userDto);
      return Ok(userResponseDTO);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponseDTO>> Login(UserLoginDTO userDto)
    {
      var userResponseDTO = await _authService.LoginAsync(userDto);
      return Ok(userResponseDTO);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<RefreshDTO>> Refresh([FromBody] RefreshDTO refreshDto)
    {
      var response = await _authService.RefreshAsync(refreshDto);
      return Ok(response);
    }
  }
}