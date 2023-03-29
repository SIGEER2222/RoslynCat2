//using Microsoft.AspNetCore.Mvc;
//using RoslynCat.Roslyn;

//namespace RoslynCat.Controllers
//{
//    [Route("api/compiler")]
//    public class CompilerController : Controller
//    {
//        [HttpGet("get")]
//        public dynamic Get()
//        {
//            //var source = new SourceInfo();
//            //return source;
//        }

//        [HttpPost("resolve")]
//        public dynamic Resolve([FromBody]SourceInfo source)
//        {
//            try
//            {
//                return CompilerServer.CompileRos(source);
//            }
//            catch (Exception ex)
//            {
//                return ex.Message;
//                //throw;
//            }
//        }

//        [HttpPost("compile")]
//        public dynamic Compile([FromBody]SourceInfo source)
//        {

//            try
//            {
//                return CSharpScriptCompiler.Compile(source);
//            }
//            catch (Exception ex)
//            {
//                return ex.Message;
//                //throw;
//            }
//        }

//        [HttpPost("formatcode")]
//        public dynamic formatcode([FromBody]SourceInfo source)
//        {

//            try
//            {
//                return CSharpScriptCompiler.FormatCode(source);
//            }
//            catch (Exception ex)
//            {
//                return ex.Message;
//                //throw;
//            }
//        }
//    }
//}
