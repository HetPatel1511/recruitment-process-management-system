using System.Security.Claims;
using Azure.Core;
using Backend.DTOs.SkillDTOs;
using Backend.Services.Skill;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SkillsController : ControllerBase
    {
        private readonly ISkillService _skillService;

        public SkillsController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetSkills()
        {
            try
            {
                var skills = await _skillService.GetAllSkillsAsync();
                return Ok(new { success = true, message = "Skills retrieved successfully", data = skills });
            }
            catch (Exception e)
            {
                
                return StatusCode(500, new { success = false, message = e.Message });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<SkillResponseDTO>> GetSkill(int id)
        {
            try
            {
                var skill = await _skillService.GetSkillByIdAsync(id);
                if (skill == null)
                {
                    return NotFound(new { success = false, message = "Skill not found" });
                }
                return Ok(new { success = true, message = "Skill retrieved successfully", data = skill });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpPost]
        public async Task<IActionResult> CreateSkill([FromBody] CreateSkillDTO createSkillDTO)
        {
            try
            {
                var skill = await _skillService.CreateSkillAsync(createSkillDTO);
                return CreatedAtAction(nameof(GetSkill), 
                    new { id = skill.Id }, 
                    new { success = true, message = "Skill created successfully", data = skill });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            try
            {
                var result = await _skillService.DeleteSkillAsync(id);
                return Ok(new { success = true, message = "Skill deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("position/{positionId}")]
        public async Task<IActionResult> GetPositionSkills(int positionId)
        {
            try
            {
                var skills = await _skillService.GetPositionSkillsAsync(positionId);
                return Ok(new { success = true, message = "Skills retrieved successfully", data = skills });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    
        [Authorize(Roles = "recruiter")]
        [HttpPost("position/{positionId}")]
        public async Task<IActionResult> AddSkillsToPosition(int positionId, [FromBody] AddSkillsToPositionRequestDTO request)
        {
            try
            {
                var result = await _skillService.AddSkillsToPositionAsync(request.SkillIds, positionId);
                return Ok(new { success = true, message = "Skill added to position successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserSkills(int id)
        {
            try
            {
                var skills = await _skillService.GetUserSkillsAsync(id);
                return Ok(new { success = true, message = "Skills retrieved successfully", data = skills });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("me")]
        public async Task<IActionResult> AddSkillsToUser([FromBody] AddSkillsToUserRequestDTO request)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var result = await _skillService.AddSkillsToUserAsync(request.SkillIds, int.Parse(userId));
                return Ok(new { success = true, message = "Skill added to user successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
