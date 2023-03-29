
//namespace RoslynCat.Controllers{

//    public class GlobalExceptionHandlerMiddleware
//    {
//        private readonly RequestDelegate _next;
//        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

//        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
//        {
//            _next = next;
//            _logger = logger;
//        }

//        public async Task InvokeAsync(HttpContext context)
//        {
//            try
//            {
//                await _next(context);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "An unhandled exception occurred.");
//                await HandleExceptionAsync(context, ex);
//            }
//        }

//        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
//        {
//            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
//            context.Response.ContentType = "application/json";

//            var result = JsonSerializer.Serialize(new ErrorResponse
//            {
//                Success = false,
//                Message = "An internal server error occurred."
//            });

//            await context.Response.WriteAsync(result);
//        }
//    }
        
//}

