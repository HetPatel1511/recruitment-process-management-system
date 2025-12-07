using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;

namespace Backend.Services.User
{
  public interface IUserService
  {
    Task<UserResponseDTO> GetMyUserAsync(int id);
    Task<UserResponseDTO> UpdateMyUserAsync(int id, UpdateUserServiceDTO updateUserDTO);
  }
}