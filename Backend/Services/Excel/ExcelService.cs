using NPOI.XSSF.UserModel;

namespace Backend.Services.Excel
{
  public class ExcelService : IExcelService
  {
    public List<T> Read<T>(string filePath)
    {
      using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
      var workbook = new XSSFWorkbook(stream);
      var sheet = workbook.GetSheetAt(0);
      var rows = sheet.GetRow(0);

      var headers = new List<string>();
      for (int i = 0; i < rows.LastCellNum; i++)
      {
        headers.Add(rows.GetCell(i).StringCellValue);
      }

      var data = new List<T>();
      for (int i = 1; i <= sheet.LastRowNum; i++)
      {
        var row = sheet.GetRow(i);
        var item = Activator.CreateInstance<T>();
        for (int j = 0; j < headers.Count; j++)
        {
          var property = typeof(T).GetProperty(headers[j]);
          if (property != null)
          {
            if (row.GetCell(j) == null)
            {
              property.SetValue(item, string.Empty);
            }
            else
            {
              property.SetValue(item, row.GetCell(j).StringCellValue);
            }
          }
        }
        data.Add(item);
      }
      
      return data;
    }
  }
}