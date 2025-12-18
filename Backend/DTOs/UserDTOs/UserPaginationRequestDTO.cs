using Backend.DTOs.PaginationDTOs;

namespace Backend.DTOs.UserDTOs
{
  public class UserPaginationRequestDTO : PaginationDto
  {
    public string? Search { get; set; }
    public int? RoleId { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
  }
}