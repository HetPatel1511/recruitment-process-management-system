using Microsoft.AspNetCore.Mvc;
namespace Backend.Controllers;

[ApiController]
[Route("[Controller]")]
public class AuthController : ControllerBase {

  [HttpPost("login")]
  public string Login() {
    return "ok";
  }
}