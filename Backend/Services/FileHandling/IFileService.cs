namespace Backend.Services.FileHandling
{
  public interface IFileService
  {
    Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtensions, string uploadPath="Uploads");
    void DeleteFile(string fileNameWithExtension);
  }
}