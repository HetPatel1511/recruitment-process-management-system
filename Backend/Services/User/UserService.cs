using AutoMapper;
using Backend.Data;
using Backend.DTOs.AuthDTOs;
using Backend.DTOs.PaginationDTOs;
using Backend.DTOs.UserDTOs;
using Backend.Services.FileHandling;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.User
{
  public class UserService : IUserService
  {
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly IFileService _fileService;

    public UserService(DataContext context, IMapper mapper, IConfiguration configuration, IFileService fileService)
    {
      _context = context;
      _mapper = mapper;
      _configuration = configuration;
      _fileService = fileService;
    }

    public async Task<UserPaginationResponseDTO> GetUsersAsync(UserPaginationRequestDTO userPaginationRequestDTO)
    {
      var query = _context.Users.Include(u => u.Role).AsQueryable();

      if (!string.IsNullOrEmpty(userPaginationRequestDTO.Search))
      {
        query = query.Where(u => 
          u.Name.ToLower().Contains(userPaginationRequestDTO.Search.ToLower()) || 
          u.Email.ToLower().Contains(userPaginationRequestDTO.Search.ToLower()) ||
          u.Role.Name.ToLower().Contains(userPaginationRequestDTO.Search.ToLower())
        );
      }

      if (userPaginationRequestDTO.RoleId.HasValue)
      {
        query = query.Where(u => u.Role.Id == userPaginationRequestDTO.RoleId.Value);
      }

      query = userPaginationRequestDTO.SortBy switch
      {
        "name" => userPaginationRequestDTO.SortOrder == "asc" ? query.OrderBy(u => u.Name) : query.OrderByDescending(u => u.Name),
        "email" => userPaginationRequestDTO.SortOrder == "asc" ? query.OrderBy(u => u.Email) : query.OrderByDescending(u => u.Email),
        "role" => userPaginationRequestDTO.SortOrder == "asc" ? query.OrderBy(u => u.Role.Name) : query.OrderByDescending(u => u.Role.Name),
        "createdAt" => userPaginationRequestDTO.SortOrder == "asc" ? query.OrderBy(u => u.CreatedAt) : query.OrderByDescending(u => u.CreatedAt),
        "id" => userPaginationRequestDTO.SortOrder == "asc" ? query.OrderBy(u => u.Id) : query.OrderByDescending(u => u.Id),
        _ => query.OrderBy(u => u.Id)
      };

      int TotalCount = await query.CountAsync();
      int TotalPages = (int)Math.Ceiling((double)TotalCount / userPaginationRequestDTO.PageSize);
      int skip = (userPaginationRequestDTO.PageNumber - 1) * userPaginationRequestDTO.PageSize;

      var users = await query
                  .Skip(skip)
                  .Take(userPaginationRequestDTO.PageSize)
                  .Select(u => new UserResponseDTO
                  {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = _mapper.Map<RoleDTO>(u.Role),
                    ImageUrl = u.ImageUrl,
                    CreatedAt = u.CreatedAt
                  })
                  .ToListAsync();

      int currentPageItemCount = users.Count;
      int startIndex = 0;
      int endIndex = 0;
      if (currentPageItemCount > 0)
      {
        startIndex = skip + 1;
        endIndex = startIndex + currentPageItemCount - 1;
      }

      return new UserPaginationResponseDTO
      {
        Data = users,
        Meta = new Meta
        {
          PageNumber = userPaginationRequestDTO.PageNumber,
          PageSize = userPaginationRequestDTO.PageSize,
          TotalCount = TotalCount,
          TotalPages = TotalPages,
          CurrentPageItemCount = currentPageItemCount,
          StartIndex = startIndex,
          EndIndex = endIndex,
        },
        QueryParameters = new UserPaginationQueryParameters
        {
          Search = userPaginationRequestDTO.Search,
          RoleId = userPaginationRequestDTO.RoleId,
          SortBy = userPaginationRequestDTO.SortBy,
          SortOrder = userPaginationRequestDTO.SortOrder
        }
      };
    }

    public async Task<UserResponseDTO> GetUserAsync(int id)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      return _mapper.Map<UserResponseDTO>(user);
    }

    public async Task<UserResponseDTO> UpdateUserAsync(int id, UpdateUserServiceDTO updateUserDTO)
    {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      var old_image_url = user.ImageUrl;
      if (!string.IsNullOrEmpty(updateUserDTO.ImageUrl) && !updateUserDTO.ImageUrl.StartsWith("http"))
      {
        var baseUrl = _configuration["AppSettings:BaseUrl"];
        updateUserDTO.ImageUrl = $"{baseUrl}/Resources/{updateUserDTO.ImageUrl}";
      }

      _mapper.Map(updateUserDTO, user);
      user.UpdatedAt = DateTime.UtcNow;

      if (old_image_url != null && old_image_url != user.ImageUrl)
      {
        _fileService.DeleteFile(old_image_url.Replace($"{_configuration["AppSettings:BaseUrl"]}/Resources/", ""));
      }
      await _context.SaveChangesAsync();
      return _mapper.Map<UserResponseDTO>(user);
    }

    public async Task<UserResponseDTO> UpdateUserRoleAsync(int id, UpdateUserRoleDTO updateUserRoleDto)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
      if (user == null)
      {
        throw new Exception("User not found");
      }

      var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == updateUserRoleDto.RoleId);
      if (role == null)
      {
        throw new Exception("Role not found");
      }
      user.RoleId = updateUserRoleDto.RoleId;
      await _context.SaveChangesAsync();

      // var responseUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id==id);
      return _mapper.Map<UserResponseDTO>(user);
    }
  }
}