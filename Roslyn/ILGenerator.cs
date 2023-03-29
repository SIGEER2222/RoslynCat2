
namespace RoslynCat.Roslyn
{
    //CSharpCompilation
    //CSharpCompilation.Create CSharpCompilation.Emit
    public class ILGenerator
    {
        public ILGenerator() {
            string sourceCode = @"
            using System;
            class HelloWorld {
                static void Main(string[] args) {
                    Console.WriteLine(""Hello, world!"");
                }
            }";

            // 创建语法树
            SyntaxTree syntaxTree = CSharpSyntaxTree.ParseText(sourceCode);

            // 创建编译选项
            CSharpCompilationOptions compilationOptions = new CSharpCompilationOptions(
            OutputKind.DynamicallyLinkedLibrary,
            optimizationLevel: OptimizationLevel.Release);

            // 创建编译器
            CSharpCompilation compilation = CSharpCompilation.Create("HelloWorld.dll")
            .WithOptions(compilationOptions)
            .AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location))
            .AddSyntaxTrees(syntaxTree);

            // 编译代码并生成 IL
            using (var stream = new MemoryStream()) {
                EmitResult result = compilation.Emit(stream);
                if (result.Success) {
                    byte[] ilCode = stream.ToArray();
                    Console.WriteLine($"IL code size: {ilCode.Length} bytes");
                }
                else {
                    Console.WriteLine("Compilation failed:");
                    foreach (Diagnostic diagnostic in result.Diagnostics) {
                        Console.WriteLine(diagnostic);
                    }
                }
                // 创建 C# 代码

            }
        }
    }
}
