namespace Backend.DTOs.UserDTOs
{
  public class UpdateUserDTO
  {
    public string? Name { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? Headline { get; set; }
    public string? About { get; set; }
  }
}