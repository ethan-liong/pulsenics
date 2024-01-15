using Microsoft.AspNetCore.Mvc;
using MathNet.Numerics;
using System.Linq;

namespace Curve.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurveController : ControllerBase
    {
        /*
         * takes in request of /curve?points={points};&type={curveType}
        points is in the form of x1,y1;x2,y2;...xn,yn;
        curveType is linear, quadratic or cubic
        */
        [HttpGet(Name = "GetCurve")]
        public string Get(string points, string type)
        {
            // assign 2 arrays
            var pairs = points.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

            var x = new double[pairs.Length];
            var y = new double[pairs.Length];

            for (int i = 0; i < pairs.Length; i++)
            {
                var xy = pairs[i].Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                if (xy.Length != 2)
                {
                    throw new FormatException("Invalid format for coordinate pair.");
                }
                x[i] = double.Parse(xy[0]);
                y[i] = double.Parse(xy[1]);
            }
            var val = 0;
            switch (type)
            {
                case ("linear"):
                    val = 1;
                    break;
                case ("quadratic"):
                    val = 2;
                    break;
                case ("cubic"):
                    val = 3;
                    break;
            }
            return ($"[{String.Join(",", Fit.Polynomial(x, y, val).Select(d => Math.Round(d, 5)).ToArray())}]");
        }
    }
}
