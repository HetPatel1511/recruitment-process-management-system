using Backend.DTOs.AuthDTOs;
using Backend.DTOs.UserDTOs;

namespace Backend.Services.User
{
  public interface IUserService
  {
    Task<UserPaginationResponseDTO> GetUsersAsync(UserPaginationRequestDTO userPaginationRequestDTO);
    Task<UserResponseDTO> GetUserAsync(int id);
    Task<UserResponseDTO> UpdateUserAsync(int id, UpdateUserServiceDTO updateUserDTO);
    Task<UserResponseDTO> UpdateUserRoleAsync(int id, UpdateUserRoleDTO updateUserRoleDto);
    Task<BulkUploadUserResponseDTO> BulkUploadUsersAsync(BulkUploadUserServiceDTO bulkUploadUserServiceDTO);
    Task<UploadCvResultDTO> UploadCVAsync(string filePath, int userId);
    
  }
}