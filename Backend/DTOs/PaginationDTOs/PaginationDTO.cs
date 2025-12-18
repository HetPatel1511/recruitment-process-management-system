namespace Backend.DTOs.PaginationDTOs
{
  public class PaginationDto
  {
    private const int _maxPageSize = 50;
    public int _pageNumber = 1;
    public int PageNumber 
    {
      get { return _pageNumber; } 
      set { _pageNumber = (value > 0) ? value : 1; } 
    }
    private int _pageSize = 10;
    public int PageSize
    {
      get { return _pageSize; }
      set { _pageSize = (value < 0) ? 10 : value; }
    }
  }
}