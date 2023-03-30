using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace RoslynCat.Data
{
    public class SourceInfo
    {

        public SourceInfo()
        {
            References = new List<string>();
        }

        public string SourceCode { get; set; }
        public string Nuget { get; set; }

        public List<string> Usings {
            get { 
                SyntaxNode root = CSharpSyntaxTree.ParseText(SourceCode).GetRoot();
                List<string> usings =  root.DescendantNodes().OfType<UsingDirectiveSyntax>().Select(x => x.Name.ToString()).ToList();
                return usings;
            }
        }

        public List<string> References { get; set; }

        public int LineNumberOffsetFromTemplate { get; set; }

        internal int CalculateVisibleLineNumber(int compilerLineError) => compilerLineError - LineNumberOffsetFromTemplate;
    }
}
