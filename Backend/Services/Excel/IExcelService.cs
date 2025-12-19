namespace Backend.Services.Excel
{
  public interface IExcelService
  {
    List<T> Read<T>(string filePath);
  }
}