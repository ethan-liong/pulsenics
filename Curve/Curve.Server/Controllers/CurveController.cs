using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Curve.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurveController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<CurveController> _logger;

        public CurveController(ILogger<CurveController> logger)
        {
            _logger = logger;
        }

        [HttpPost(Name = "GetFit")]
        [DisableCors]
        public IActionResult Curve123([FromBody] CurveFitRequest request)
        {
            // Now you can use request.Points and request.Type

            // Placeholder logic
            _logger.LogInformation("Received Points: {0}, Type: {1}", request.Points, request.Type);
            // Add your logic here to process the points and type

            // Placeholder return
            return Ok("Received: " + request.Points + " with type: " + request.Type);
        }
    }
}
