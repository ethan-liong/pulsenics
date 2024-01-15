using Microsoft.AspNetCore.Mvc;

namespace Curve.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurveController : ControllerBase
    {

        [HttpGet(Name = "GetCurve")]
        public string Get(string points, string type)
        {
            return ($"Received points: {points} with type: {type}");
        }
    }
}
