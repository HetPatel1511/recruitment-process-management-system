using Backend.DTOs.AuthDTOs;

namespace Backend.DTOs.UserDTOs
{
  public class BulkUploadUserResponseDTO
  {
    public List<string> AlreadyExists { get; set; }
    public List<UserResponseDTO> NewUsers { get; set; }
    public List<string> FailedToUpload { get; set; }
  }
}