using Backend.DTOs.AuthDTOs;

namespace Backend.Services.Auth
{
  public interface IAuthService
  {
    IEnumerable<UserResponseDTO> GetUsers();
    Task<UserResponseDTO> RegisterAsync(UserCreateDTO userDto);
    Task<UserResponseDTO> LoginAsync(UserLoginDTO userDto);
    Task<RefreshDTO> RefreshAsync(RefreshDTO refreshDto);
  }
}


