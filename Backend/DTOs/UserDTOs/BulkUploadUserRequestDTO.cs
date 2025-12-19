namespace Backend.DTOs.UserDTOs
{
  public class BulkUploadUserRequestDTO
  {
    public IFormFile File { get; set; } = null!;
  }
}