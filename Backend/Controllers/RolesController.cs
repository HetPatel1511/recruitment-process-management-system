using Backend.DTOs.RoleDTOs;
using Backend.Services.Role;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class RolesController : ControllerBase
  {
    public readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
      _roleService = roleService;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<List<RoleResponseDTO>>> GetRoles()
    {
      try
      {
        var roles = await _roleService.GetRolesAsync();
        return Ok(new { success = true, message = "Roles retrieved successfully", data = roles });
      }
      catch (Exception ex)
      {
        return BadRequest(new { success = false, message = ex.Message });
      }
    }
  }
}