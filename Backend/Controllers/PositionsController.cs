using System.Security.Claims;
using Azure.Core;
using Backend.DTOs.PositionDTOs;
using Backend.Services.Position;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PositionsController : ControllerBase
    {
        private readonly IPositionService _positionService;

        public PositionsController(IPositionService positionService)
        {
            _positionService = positionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetPositions()
        {
            try
            {
                var positions = await _positionService.GetAllPositionsAsync();
                return Ok(new { success = true, message = "Positions retrieved successfully", data = positions });
            }
            catch (Exception e)
            {
                
                return StatusCode(500, new { success = false, message = e.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpGet("my-positions")]
        public async Task<IActionResult> GetMyPositions()
        {
            try
            {
                var recruiterId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(recruiterId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }
                var positions = await _positionService.GetPositionsByRecruiterIdAsync(int.Parse(recruiterId));
                return Ok(new { success = true, message = "Positions retrieved successfully", data = positions });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, message = e.Message });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<PositionResponseDTO>> GetPosition(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                var position = await _positionService.GetPositionByIdAsync(id, userId);
                if (position == null)
                {
                    return NotFound(new { success = false, message = "Position not found" });
                }
                return Ok(new { success = true, message = "Position retrieved successfully", data = position });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpPost]
        public async Task<IActionResult> CreatePosition([FromBody] CreatePositionDTO createPositionDTO)
        {
            try
            {
                var recruiterId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(recruiterId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var position = await _positionService.CreatePositionAsync(createPositionDTO, int.Parse(recruiterId));
                return CreatedAtAction(nameof(GetPosition), 
                    new { id = position.Id }, 
                    new { success = true, message = "Position created successfully", data = position });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePosition(int id, UpdatePositionDTO updatePositionDTO)
        {
            try
            {
                var recruiterId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(recruiterId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var position = await _positionService.UpdatePositionAsync(id, updatePositionDTO, int.Parse(recruiterId));
                return Ok(new { success = true, message = "Position updated successfully", data = position });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var result = await _positionService.DeletePositionAsync(id, userId);
                return Ok(new { success = true, message = "Position deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "candidate")]
        [HttpPost("apply/{id}")]
        public async Task<IActionResult> ApplyForPosition(int id)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var application = await _positionService.ApplyForPositionAsync(id, int.Parse(userIdClaim));
                return Ok(new { success = true, message = "Successfully applied for the position", data = application });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "recruiter")]
        [HttpGet("{positionId}/applications")]
        public async Task<IActionResult> GetPositionApplications(int positionId)
        {
            try
            {
                var RecruiterId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(RecruiterId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user ID in token" });
                }

                var result = await _positionService.GetPositionApplicantsAsync(positionId, int.Parse(RecruiterId));
                return Ok(new { success = true, message = "Applicants retrieved successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
