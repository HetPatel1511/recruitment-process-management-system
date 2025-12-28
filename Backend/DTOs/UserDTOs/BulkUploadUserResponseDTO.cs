using Backend.DTOs.AuthDTOs;

namespace Backend.DTOs.UserDTOs
{
  public class BulkUploadUserResponseDTO
  {
    public List<string> AlreadyExists { get; set; }
    public List<UserResponseDTO> NewUsers { get; set; }
    public List<FailedUploadDTO> FailedToUpload { get; set; }
  }

  public class FailedUploadDTO
  {
    public string Email { get; set; }
    public string Reason { get; set; }
  }
}