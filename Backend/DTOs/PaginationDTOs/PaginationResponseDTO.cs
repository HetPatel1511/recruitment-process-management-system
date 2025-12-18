namespace Backend.DTOs.PaginationDTOs
{
  public class PaginationResponseDTO<T>
  {
    public Meta Meta { get; set; }
    public List<T> Data { get; set; }
  }

  public class Meta: PaginationDto
  {
    public int TotalCount { get; set; }
    public int CurrentPageItemCount { get; set; }
    public int TotalPages { get; set; }
    public int StartIndex { get; set; } = 0;
    public int EndIndex { get; set; } = 0;
  }
}