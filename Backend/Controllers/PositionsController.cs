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
    [Authorize]
    public class PositionsController : ControllerBase
    {
        private readonly IPositionService _positionService;

        public PositionsController(IPositionService positionService)
        {
            _positionService = positionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PositionResponseDTO>>> GetPositions()
        {
            var positions = await _positionService.GetAllPositionsAsync();
            return Ok(positions);
        }

        [HttpGet("my-positions")]
        public async Task<ActionResult<IEnumerable<PositionResponseDTO>>> GetMyPositions()
        {
            var recruiterId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var positions = await _positionService.GetPositionsByRecruiterIdAsync(recruiterId);
            return Ok(positions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PositionResponseDTO>> GetPosition(int id)
        {
            var position = await _positionService.GetPositionByIdAsync(id);
            if (position == null)
            {
                return NotFound();
            }
            return Ok(position);
        }

        [HttpPost]
        public async Task<ActionResult<PositionResponseDTO>> CreatePosition([FromBody] CreatePositionDTO createPositionDTO)
        {
            var recruiterId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var position = await _positionService.CreatePositionAsync(createPositionDTO, recruiterId);
            return CreatedAtAction(nameof(GetPosition), new { id = position.Id }, position);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePosition(int id, UpdatePositionDTO updatePositionDTO)
        {
            var recruiterId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var position = await _positionService.UpdatePositionAsync(id, updatePositionDTO, recruiterId);
            
            if (position == null)
            {
                return NotFound();
            }
            
            return Ok(position);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            var recruiterId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
            var result = await _positionService.DeletePositionAsync(id, recruiterId);
            
            if (!result)
            {
                throw new Exception("Position not found");
            }
            return Ok(new { success = true });
        }

        // private int GetCurrentUserId()
        // {
        //     var userId = HttpContext.User?.FindFirst("sub")?.Value;
        //     Console.WriteLine(userId);
        //     if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
        //     {
        //         throw new UnauthorizedAccessException("Invalid user ID in token");
        //     }
        //     return id;
        // }
    }
}
