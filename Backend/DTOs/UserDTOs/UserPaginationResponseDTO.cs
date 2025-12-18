using Backend.DTOs.AuthDTOs;
using Backend.DTOs.PaginationDTOs;

namespace Backend.DTOs.UserDTOs
{
  public class UserPaginationResponseDTO : PaginationResponseDTO<UserResponseDTO>
  {
    public UserPaginationQueryParameters QueryParameters { get; set; }
  }

  public class UserPaginationQueryParameters
  {
    public string? Search { get; set; }
    public int? RoleId { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
  }
}